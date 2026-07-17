"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanActionFiles = scanActionFiles;
exports.extractModuleName = extractModuleName;
exports.generateEntry = generateEntry;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const lockfile = __importStar(require("proper-lockfile"));
// ─── Helpers ─────────────────────────────────────────────────────────
/**
 * Scan the outDir for action .js files, excluding special files:
 * - _common.js
 * - PROJ_*.js (entry files)
 * - .lock files
 * - _common_entry.ts (temp file)
 */
function scanActionFiles(absOutDir) {
    if (!fs.existsSync(absOutDir)) {
        return [];
    }
    return fs.readdirSync(absOutDir).filter((file) => {
        // Must be a .js file
        if (!file.endsWith('.js'))
            return false;
        // Exclude _common.js
        if (file === '_common.js')
            return false;
        // Exclude PROJ_*.js entry files
        if (file.startsWith('PROJ_'))
            return false;
        // Exclude .lock files (shouldn't match .js but be safe)
        if (file.endsWith('.lock'))
            return false;
        return true;
    }).sort();
}
/**
 * Extract moduleName from an action filename.
 * e.g. "src.backend.actions.Register.js" → "src.backend.actions.Register"
 */
function extractModuleName(filename) {
    return filename.replace(/\.js$/, '');
}
/**
 * Generate the content of PROJ_{projectId}.js entry file.
 */
function generateEntryContent(projectId, actionFiles) {
    const moduleNames = actionFiles.map(extractModuleName);
    // Build the registry object entries
    const registryEntries = moduleNames
        .map((mod) => `  '${mod}': require('./${mod}'),`)
        .join('\n');
    return `// PROJ_${projectId}.js (generated)
const express = require('express');
const common = require('./_common');
const { UnauthorizedError, ForbiddenError, runWithAuth: baseRunWithAuth } = common.BaseActionFun;
const serializer = common.serializer;

const router = express.Router();
const actions = new Map();

// Dynamic require for each action
const registry = {
${registryEntries}
};

// Register actions
for (const [moduleName, mod] of Object.entries(registry)) {
  for (const [fnName, fn] of Object.entries(mod)) {
    if (typeof fn === 'function') {
      actions.set(\`\${moduleName}.\${fnName}\`, fn);
    }
  }
}

// Auth module selection
// 注意：app/(backend)/ 目录下的 action 生成的 actionName 格式为 "app.backend.xxx"，
// 必须优先匹配 .backend.，否则会被 startsWith('app.') 错误路由到 appAuth
function getAuthModule(actionName) {
  if (actionName.includes('.frontend.') || actionName.startsWith('frontend.')) return common.frontendAuth;
  if (actionName.includes('.backend.') || actionName.startsWith('backend.')) return common.backendAuth;
  if (actionName.includes('.app.') || actionName.startsWith('app.')) return common.appAuth;
  return common.backendAuth;
}

// RPC route (preserving existing bundled-entry.ts logic)
router.post('/', async (req, res) => {
  try {
    const { actionName, args } = req.body;
    const fn = actions.get(actionName);
    if (!fn) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const authModule = getAuthModule(actionName);
    const { parseToken } = authModule;
    const runWithAuth = authModule.runWithAuth || baseRunWithAuth;

    const token = req.headers.authorization?.replace('Bearer ', '');
    const authContext = token ? await parseToken(token) : null;

    const result = await runWithAuth(authContext, async () => {
      return fn(...(serializer.deserialize(args)));
    });

    if (authContext && authContext.role) {
      const roleValue = Array.isArray(authContext.role)
        ? JSON.stringify(authContext.role)
        : String(authContext.role);
      res.setHeader('X-Auth-Role', roleValue);
    }

    res.json(serializer.serialize(result));
  } catch (e) {
    if (e instanceof UnauthorizedError || e.name === 'UnauthorizedError') {
      res.status(401).json({ error: e.message || '请登录' });
      return;
    }
    if (e instanceof ForbiddenError || e.name === 'ForbiddenError') {
      res.status(403).json({ error: e.message || '权限不足' });
      return;
    }
    console.error('RPC Error:', e);
    res.status(500).json({ error: e?.message ?? 'Unknown error' });
  }
});

const PROJECT_ID = 'PROJ_${projectId}';
module.exports = { path: \`/rpc/\${PROJECT_ID}\`, router };
`;
}
// ─── generateEntry ───────────────────────────────────────────────────
/**
 * 生成入口文件 PROJ_xxx.js（带文件锁）
 *
 * 1. Acquire file lock on .entry-gen.lock
 * 2. Scan outDir for action .js files
 * 3. Generate PROJ_{projectId}.js content
 * 4. Write to outDir/PROJ_{projectId}.js
 * 5. Release lock
 */
async function generateEntry(options) {
    const { projectId, outDir, projectRoot } = options;
    const absOutDir = path.resolve(projectRoot, outDir);
    const outputFile = path.join(absOutDir, `PROJ_${projectId}.js`);
    // Ensure output directory exists
    fs.mkdirSync(absOutDir, { recursive: true });
    // Lock file path
    const lockPath = options.lockFile || path.join(absOutDir, '.entry-gen.lock');
    // Ensure lock file exists (proper-lockfile requires the file to exist)
    fs.writeFileSync(lockPath, '', { flag: 'a' });
    let release = null;
    try {
        release = await lockfile.lock(lockPath, {
            stale: 10000,
            retries: { retries: 5, minTimeout: 200 },
        });
        // Scan for action files
        const actionFiles = scanActionFiles(absOutDir);
        // Generate entry content
        const content = generateEntryContent(projectId, actionFiles);
        // Write the entry file
        fs.writeFileSync(outputFile, content, 'utf-8');
        return {
            success: true,
            outputFile,
            actionFiles,
        };
    }
    catch (err) {
        const message = err.message ?? String(err);
        // Check if it's a lock timeout error
        if (message.includes('lock') || message.includes('ELOCKED')) {
            return {
                success: false,
                outputFile,
                actionFiles: [],
                errors: [`Lock timeout: ${message}. Please retry.`],
            };
        }
        return {
            success: false,
            outputFile,
            actionFiles: [],
            errors: [message],
        };
    }
    finally {
        if (release) {
            await release();
        }
    }
}
