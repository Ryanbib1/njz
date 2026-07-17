/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/BusinessInfoManagement';

type Actions = typeof import('../../../../../src/backend/actions/BusinessInfoManagement');
export const getBusinessProfile = (...args: Parameters<Actions["getBusinessProfile"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getBusinessProfile"]>>>("src.backend.actions.BusinessInfoManagement.getBusinessProfile", ...args);
export const updateBusinessIdentity = (...args: Parameters<Actions["updateBusinessIdentity"]>) => 
  rpcCall<Awaited<ReturnType<Actions["updateBusinessIdentity"]>>>("src.backend.actions.BusinessInfoManagement.updateBusinessIdentity", ...args);
export const createHourRecord = (...args: Parameters<Actions["createHourRecord"]>) => 
  rpcCall<Awaited<ReturnType<Actions["createHourRecord"]>>>("src.backend.actions.BusinessInfoManagement.createHourRecord", ...args);
export const updateHourRecord = (...args: Parameters<Actions["updateHourRecord"]>) => 
  rpcCall<Awaited<ReturnType<Actions["updateHourRecord"]>>>("src.backend.actions.BusinessInfoManagement.updateHourRecord", ...args);
export const deleteHourRecord = (...args: Parameters<Actions["deleteHourRecord"]>) => 
  rpcCall<Awaited<ReturnType<Actions["deleteHourRecord"]>>>("src.backend.actions.BusinessInfoManagement.deleteHourRecord", ...args);
