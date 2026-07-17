/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/AdminRegister';

type Actions = typeof import('../../../../../src/backend/actions/AdminRegister');
export const registerAdmin = (...args: Parameters<Actions["registerAdmin"]>) => 
  rpcCall<Awaited<ReturnType<Actions["registerAdmin"]>>>("src.backend.actions.AdminRegister.registerAdmin", ...args);
