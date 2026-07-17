/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/AdminLogin';

type Actions = typeof import('../../../../../src/backend/actions/AdminLogin');
export const adminLogin = (...args: Parameters<Actions["adminLogin"]>) => 
  rpcCall<Awaited<ReturnType<Actions["adminLogin"]>>>("src.backend.actions.AdminLogin.adminLogin", ...args);
export const getGoogleLoginUrl = (...args: Parameters<Actions["getGoogleLoginUrl"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getGoogleLoginUrl"]>>>("src.backend.actions.AdminLogin.getGoogleLoginUrl", ...args);
export const handleGoogleCallback = (...args: Parameters<Actions["handleGoogleCallback"]>) => 
  rpcCall<Awaited<ReturnType<Actions["handleGoogleCallback"]>>>("src.backend.actions.AdminLogin.handleGoogleCallback", ...args);
export const checkCurrentSession = (...args: Parameters<Actions["checkCurrentSession"]>) => 
  rpcCall<Awaited<ReturnType<Actions["checkCurrentSession"]>>>("src.backend.actions.AdminLogin.checkCurrentSession", ...args);
