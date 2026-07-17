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
exports.build = build;
exports.parseCliArgs = parseCliArgs;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const glob_1 = require("glob");
const action_compiler_1 = require("./action-compiler");
const common_bundle_1 = require("./common-bundle");
const entry_generator_1 = require("./entry-generator");
// ─── Constants ───────────────────────────────────────────────────────
const DEFAULT_OUT_DIR = 'server-action-generated';
const ACTION_PATTERNS = [
    'src/*/actions/*.ts',
    'src/actions/**/*.ts',
];
// ─── Helpers ─────────────────────────────────────────────────────────
/**
 * Discover all action source files using glob patterns.
 * Excludes files starting with __test_ (test temp files).
 */
async function discoverActionFiles(projectRoot) {
    const files = [];
    for (const pattern of ACTION_PATTERNS) {
        const matches = await (0, glob_1.glob)(pattern, {
            cwd: projectRoot,
            nodir: true,
        });
        files.push(...matches);
    }
    // Deduplicate and filter out test temp files
    const unique = [...new Set(files)].filter((f) => !path.basename(f).startsWith('__test_'));
    return unique.sort();
}
/**
 * Extract projectId from existing PROJ_*.js files in outDir.
 */
function extractProjectIdFromOutDir(absOutDir) {
    if (!fs.existsSync(absOutDir))
        return null;
    const files = fs.readdirSync(absOutDir);
    for (const f of files) {
        const match = f.match(/^PROJ_(.+)\.js$/);
        if (match)
            return match[1];
    }
    return null;
}
/**
 * Extract projectId from parent directory name.
 * Directory structure: .../PROJ_{id}/aigcode-demo
 * So from cwd (aigcode-demo), parent dir name is PROJ_{id}.
 */
function extractProjectIdFromParentDir(cwd) {
    const parentDir = path.basename(path.dirname(cwd));
    const match = parentDir.match(/^PROJ_(.+)$/);
    return match ? match[1] : null;
}
/**
 * Clean old webpack artifacts: a single PROJ_*.js that is much larger than expected.
 * Incremental build produces small entry files; webpack produced large bundles.
 */
function cleanOldWebpackArtifacts(absOutDir) {
    if (!fs.existsSync(absOutDir))
        return;
    const files = fs.readdirSync(absOutDir);
    for (const f of files) {
        if (!f.match(/^PROJ_.*\.js$/))
            continue;
        const filePath = path.join(absOutDir, f);
        try {
            const stat = fs.statSync(filePath);
            // Old webpack bundles are typically > 100KB; new entry files are < 10KB
            if (stat.size > 100 * 1024) {
                fs.unlinkSync(filePath);
            }
        }
        catch {
            /* ignore */
        }
    }
}
/**
 * Get default action_utils paths for all platforms.
 */
function getActionUtilsPaths() {
    return {
        frontend: 'src/frontend/action_utils.ts',
        backend: 'src/backend/action_utils.ts',
        app: 'src/app/action_utils.ts',
    };
}
/**
 * Check if _common.js is up-to-date by comparing its mtime against all source
 * files that contribute to it. Returns true if the bundle can be reused.
 *
 * Source files checked:
 *   src/tools/prisma.ts, src/@base/BaseActionFun.ts, src/utils/serializer.ts,
 *   prisma-generated/client/ (directory mtime), and each platform action_utils.
 */
function isCommonBundleUpToDate(projectRoot, absOutDir) {
    const commonPath = path.join(absOutDir, '_common.js');
    if (!fs.existsSync(commonPath))
        return false;
    let commonMtime;
    try {
        commonMtime = fs.statSync(commonPath).mtimeMs;
    }
    catch {
        return false;
    }
    const sourcesToCheck = [
        'src/tools/prisma.ts',
        'src/@base/BaseActionFun.ts',
        'src/utils/serializer.ts',
        'prisma-generated/client',
        ...Object.values(getActionUtilsPaths()),
    ];
    for (const rel of sourcesToCheck) {
        const abs = path.resolve(projectRoot, rel);
        try {
            const stat = fs.statSync(abs);
            if (stat.mtimeMs > commonMtime)
                return false;
        }
        catch {
            // File doesn't exist — not a reason to force rebuild
        }
    }
    return true;
}
// ─── Build Function ──────────────────────────────────────────────────
/**
 * Execute build with the given options.
 */
async function build(options) {
    const startTime = performance.now();
    const projectRoot = process.cwd();
    const outDir = DEFAULT_OUT_DIR;
    const absOutDir = path.resolve(projectRoot, outDir);
    const compiled = [];
    const failed = [];
    let commonRebuilt = false;
    // Ensure output directory exists
    fs.mkdirSync(absOutDir, { recursive: true });
    // ── Rebuild common only mode ───────────────────────────────────────
    if (options.rebuildCommon) {
        const commonResult = await (0, common_bundle_1.buildCommonBundle)({
            projectRoot,
            outDir,
            actionUtilsPaths: getActionUtilsPaths(),
        });
        commonRebuilt = commonResult.success;
        if (!commonResult.success) {
            return {
                success: false,
                compiled,
                failed: [{ file: '_common.js', errors: commonResult.errors ?? [] }],
                duration: Math.round(performance.now() - startTime),
                commonRebuilt: false,
            };
        }
        // Touch PROJ_{projectId}.js to trigger Worker hot reload
        const projFile = path.join(absOutDir, `PROJ_${options.projectId}.js`);
        if (fs.existsSync(projFile)) {
            const now = new Date();
            fs.utimesSync(projFile, now, now);
        }
        return {
            success: true,
            compiled,
            failed,
            duration: Math.round(performance.now() - startTime),
            commonRebuilt: true,
        };
    }
    // ── Single file mode ───────────────────────────────────────────────
    if (options.file) {
        // Check if _common.js exists, build it if not
        const commonPath = path.join(absOutDir, '_common.js');
        if (!fs.existsSync(commonPath)) {
            const commonResult = await (0, common_bundle_1.buildCommonBundle)({
                projectRoot,
                outDir,
                actionUtilsPaths: getActionUtilsPaths(),
            });
            commonRebuilt = commonResult.success;
            if (!commonResult.success) {
                return {
                    success: false,
                    compiled,
                    failed: [{ file: '_common.js', errors: commonResult.errors ?? [] }],
                    duration: Math.round(performance.now() - startTime),
                    commonRebuilt: false,
                };
            }
        }
        // Compile the specified file
        const result = await (0, action_compiler_1.compileAction)({
            sourceFile: options.file,
            outDir,
            projectRoot,
        });
        if (result.success) {
            compiled.push(result.outputFile ? path.basename(result.outputFile) : options.file);
        }
        else {
            failed.push({
                file: options.file,
                errors: (result.errors ?? []).map((e) => e.message),
            });
        }
        // Regenerate entry file
        await (0, entry_generator_1.generateEntry)({
            projectId: options.projectId,
            outDir,
            projectRoot,
        });
        return {
            success: failed.length === 0,
            compiled,
            failed,
            duration: Math.round(performance.now() - startTime),
            commonRebuilt,
        };
    }
    // ── Full build mode (default) ──────────────────────────────────────
    // Clean old webpack artifacts on first incremental build
    cleanOldWebpackArtifacts(absOutDir);
    // 1. Build Common_Bundle — skip if already up-to-date
    if (!isCommonBundleUpToDate(projectRoot, absOutDir)) {
        const commonResult = await (0, common_bundle_1.buildCommonBundle)({
            projectRoot,
            outDir,
            actionUtilsPaths: getActionUtilsPaths(),
        });
        commonRebuilt = commonResult.success;
        if (!commonResult.success) {
            return {
                success: false,
                compiled,
                failed: [{ file: '_common.js', errors: commonResult.errors ?? [] }],
                duration: Math.round(performance.now() - startTime),
                commonRebuilt: false,
            };
        }
    }
    // 2. Discover and compile all action files in parallel
    const actionFiles = await discoverActionFiles(projectRoot);
    const compileResults = await Promise.all(actionFiles.map(async (sourceFile) => {
        const result = await (0, action_compiler_1.compileAction)({
            sourceFile,
            outDir,
            projectRoot,
        });
        return { sourceFile, result };
    }));
    for (const { sourceFile, result } of compileResults) {
        if (result.success) {
            compiled.push(result.outputFile ? path.basename(result.outputFile) : sourceFile);
        }
        else {
            failed.push({
                file: sourceFile,
                errors: (result.errors ?? []).map((e) => e.message),
            });
        }
    }
    // 3. Generate entry file
    await (0, entry_generator_1.generateEntry)({
        projectId: options.projectId,
        outDir,
        projectRoot,
    });
    return {
        success: failed.length === 0,
        compiled,
        failed,
        duration: Math.round(performance.now() - startTime),
        commonRebuilt,
    };
}
// ─── CLI Entry Point ─────────────────────────────────────────────────
function parseCliArgs(args) {
    const options = {
        projectId: '',
    };
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--file':
                options.file = args[++i];
                break;
            case '--all':
                options.all = true;
                break;
            case '--rebuild-common':
                options.rebuildCommon = true;
                break;
            case '--project-id':
                options.projectId = args[++i];
                break;
        }
    }
    return options;
}
async function main() {
    const args = process.argv.slice(2);
    const options = parseCliArgs(args);
    // If no projectId provided, try to extract from existing PROJ_*.js or parent dir
    if (!options.projectId) {
        const absOutDir = path.resolve(process.cwd(), DEFAULT_OUT_DIR);
        const extracted = extractProjectIdFromOutDir(absOutDir)
            ?? extractProjectIdFromParentDir(process.cwd());
        if (extracted) {
            options.projectId = extracted;
        }
        else {
            console.error('Error: --project-id is required');
            process.exit(1);
        }
    }
    // Default to full build if no specific mode
    if (!options.file && !options.rebuildCommon) {
        options.all = true;
    }
    const result = await build(options);
    // Output JSON result to stdout
    console.log(JSON.stringify(result));
    process.exit(result.success ? 0 : 1);
}
// Run CLI when executed directly
if (require.main === module) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
