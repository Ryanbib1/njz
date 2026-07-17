// PROJ_43bb5105_snap_20260716_073319_373.js (generated)
const express = require('express');
const common = require('./_common');
const { UnauthorizedError, ForbiddenError, runWithAuth: baseRunWithAuth } = common.BaseActionFun;
const serializer = common.serializer;

const router = express.Router();
const actions = new Map();

// Dynamic require for each action
const registry = {
  'src.backend.actions.AdminDashboard': require('./src.backend.actions.AdminDashboard'),
  'src.backend.actions.AdminLogin': require('./src.backend.actions.AdminLogin'),
  'src.backend.actions.AdminRegister': require('./src.backend.actions.AdminRegister'),
  'src.backend.actions.BusinessInfoManagement': require('./src.backend.actions.BusinessInfoManagement'),
  'src.backend.actions.OrdersManagement': require('./src.backend.actions.OrdersManagement'),
  'src.backend.actions.PhotosManagement': require('./src.backend.actions.PhotosManagement'),
  'src.backend.actions.ReviewsManagement': require('./src.backend.actions.ReviewsManagement'),
  'src.frontend.actions.FoodOrder': require('./src.frontend.actions.FoodOrder'),
  'src.frontend.actions.Home': require('./src.frontend.actions.Home'),
  'src.frontend.actions.OrderPaymentResult': require('./src.frontend.actions.OrderPaymentResult'),
};

// Register actions
for (const [moduleName, mod] of Object.entries(registry)) {
  for (const [fnName, fn] of Object.entries(mod)) {
    if (typeof fn === 'function') {
      actions.set(`${moduleName}.${fnName}`, fn);
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

const PROJECT_ID = 'PROJ_43bb5105_snap_20260716_073319_373';
module.exports = { path: `/rpc/${PROJECT_ID}`, router };
