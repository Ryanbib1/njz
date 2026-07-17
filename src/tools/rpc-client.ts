import serializer from '../utils/serializer';
import { toast } from 'sonner';
// 同时 import 前后台和 app 的 rpc-auth
import * as frontendRpcAuth from '../frontend/auth/rpc-auth';
import * as backendRpcAuth from '../backend/auth/rpc-auth';
import * as appRpcAuth from '../app/auth/rpc-auth';

// 导入前端和 app 的 session store 用于同步 role
import { useUserSession } from './FrontendSession';
import { useAppUserSession } from './AppSession';
import { useAdminSession } from './BackendSession';

// 动态获取 PROJECT_ID 和 API_URL
// 优先从 window.__dynamic_base__ 获取（生产环境），否则用环境变量
const getApiUrl = () => {
  return `http://localhost:3100/rpc/PROJ_43bb5105_snap_20260716_073319_373`;
};

// 请求去重：相同 actionName+args 的并发请求共享同一个 Promise
const pendingRequests = new Map<string, Promise<any>>();

// Common error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please login',
  FORBIDDEN: 'Permission denied',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server is taking a break, please try again later',
  OPERATION_FAILED: 'Operation failed',
};

// 根据 actionName 判断使用哪个 rpc-auth（和 bundled-entry.ts 逻辑一致）
function getRpcAuthModule(actionName: string) {
  // actionName 格式: "src.frontend.actions.xxx" 或 "src.backend.actions.xxx" 或 "src.app.actions.xxx"
  // 注意：app/(backend)/ 目录下的 action 生成的 actionName 格式为 "app.backend.xxx"，
  // 必须优先匹配 .backend.，否则会被 startsWith('app.') 错误路由到 appRpcAuth
  if (actionName.includes('.frontend.') || actionName.startsWith('frontend.')) {
    return frontendRpcAuth;
  }
  if (actionName.includes('.backend.') || actionName.startsWith('backend.')) {
    return backendRpcAuth;
  }
  if (actionName.includes('.app.') || actionName.startsWith('app.')) {
    return appRpcAuth;
  }
}

// 根据 actionName 从对应 platform 的 session store 获取当前用户角色
function getCurrentRole(actionName: string): string | undefined {
  try {
    if (actionName.includes('.frontend.') || actionName.startsWith('frontend.')) {
      const session = useUserSession.getState();
      return (session as any).role ?? undefined;
    }
    if (actionName.includes('.backend.') || actionName.startsWith('backend.')) {
      const session = useAdminSession.getState();
      return (session as any).role ?? undefined;
    }
    if (actionName.includes('.app.') || actionName.startsWith('app.')) {
      const session = useAppUserSession.getState();
      return (session as any).role ?? undefined;
    }
  } catch { /* session store 可能未初始化 */ }
  return undefined;
}

export async function rpcCall<T>(actionName: string, ...args: any[]): Promise<T> {
  const rpcAuth = getRpcAuthModule(actionName);
  const token = rpcAuth.getToken();

  // 请求去重：相同请求并发时复用同一个 Promise
  const dedupeKey = `${actionName}:${JSON.stringify(args)}`;
  if (pendingRequests.has(dedupeKey)) {
    return pendingRequests.get(dedupeKey)!;
  }

  const request = (async (): Promise<T> => {
    try {
      const apiUrl = getApiUrl();
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Timezone-Offset': String(new Date().getTimezoneOffset()),
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          // 把当前用户 ID 明文传给后端，供 Agent 诊断时使用（从 JWT payload 解析）
          ...(token ? (() => {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              return payload.userId ? { 'X-User-Id': String(payload.userId) } : {};
            } catch { return {}; }
          })() : {}),
          // 把当前用户角色传给后端，供 Agent 诊断时使用（从 session store 读取）
          ...(() => {
            const role = getCurrentRole(actionName);
            return role ? { 'X-User-Role': String(role) } : {};
          })(),
          // Pipeline test 数据库隔离：vitest 运行时注入 VITEST_PIPELINE_PAGE 环境变量
          ...(typeof process !== 'undefined' && process.env.VITEST_PIPELINE_PAGE ? {
            'X-Pipeline-Test': '1',
            'X-Pipeline-Page': process.env.VITEST_PIPELINE_PAGE,
          } : {}),
        },
        body: JSON.stringify({
          actionName,
          args: serializer.serialize(args)
        }),
      };

      let resp = await fetch(apiUrl, fetchOptions);

      // 503 服务过载：延迟 0.5 秒重试 1 次，失败就放弃
      if (resp.status === 503) {
        await new Promise(r => setTimeout(r, 500));
        resp = await fetch(apiUrl, fetchOptions);
        if (resp.status === 503) {
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
          throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
      }

      // 401 统一拦截
      if (resp.status === 401) {
        rpcAuth.handleUnauthorized();
        toast.error('Please login first', { id: 'auth-401' });
        // 不 throw，返回一个永远不 resolve 的 Promise
        // 这样上层 catch 不会触发，避免重复 toast
        return new Promise<T>(() => {});
      }

      // 403 权限不足
      if (resp.status === 403) {
        const data = await resp.json();
        const errorMsg = data.error ?? ERROR_MESSAGES.FORBIDDEN;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 404 资源不存在
      if (resp.status === 404) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        const errorMsg = errorData.error || ERROR_MESSAGES.SERVER_ERROR;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 检查后端返回的最新 role，如果与前端 session 不同则自动同步
      // 这解决了角色变更（如审核通过）后前端 session 不同步的问题
      const serverRole = resp.headers.get('X-Auth-Role');
      if (serverRole) {
        const isFrontend = actionName.includes('.frontend.');
        const isApp = actionName.includes('.app.');
        
        if (isFrontend) {
          const session = useUserSession.getState();
          if (session.role !== undefined && String(session.role) !== serverRole) {
            try {
              const parsed = JSON.parse(serverRole);
              useUserSession.setState({ role: parsed });
            } catch {
              useUserSession.setState({ role: serverRole as any });
            }
          }
        } else if (isApp) {
          const session = useAppUserSession.getState();
          if (session.role !== undefined && String(session.role) !== serverRole) {
            try {
              const parsed = JSON.parse(serverRole);
              useAppUserSession.setState({ role: parsed });
            } catch {
              useAppUserSession.setState({ role: serverRole as any });
            }
          }
        }
      }

      const rawData = await resp.json();
      
      // 先 serializer 反序列化
      const data = serializer.deserialize(rawData) as any;

      // 直接返回反序列化后的数据
      // 注意：withResult 没有包装成 { success, data } 格式，直接返回业务数据
      return data as T;
    } finally {
      pendingRequests.delete(dedupeKey);
    }
  })();

  pendingRequests.set(dedupeKey, request);
  return request;
}
