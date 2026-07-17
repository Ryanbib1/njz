/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/OrdersManagement';

type Actions = typeof import('../../../../../src/backend/actions/OrdersManagement');
export const getFoodOrdersList = (...args: Parameters<Actions["getFoodOrdersList"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getFoodOrdersList"]>>>("src.backend.actions.OrdersManagement.getFoodOrdersList", ...args);
export const getFoodOrderDetail = (...args: Parameters<Actions["getFoodOrderDetail"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getFoodOrderDetail"]>>>("src.backend.actions.OrdersManagement.getFoodOrderDetail", ...args);
export const updateFoodOrderStatus = (...args: Parameters<Actions["updateFoodOrderStatus"]>) => 
  rpcCall<Awaited<ReturnType<Actions["updateFoodOrderStatus"]>>>("src.backend.actions.OrdersManagement.updateFoodOrderStatus", ...args);
export const exportFoodOrdersList = (...args: Parameters<Actions["exportFoodOrdersList"]>) => 
  rpcCall<Awaited<ReturnType<Actions["exportFoodOrdersList"]>>>("src.backend.actions.OrdersManagement.exportFoodOrdersList", ...args);
