/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/frontend/actions/FoodOrder';

type Actions = typeof import('../../../../../src/frontend/actions/FoodOrder');
export const getMenu = (...args: Parameters<Actions["getMenu"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getMenu"]>>>("src.frontend.actions.FoodOrder.getMenu", ...args);
export const createFoodOrder = (...args: Parameters<Actions["createFoodOrder"]>) => 
  rpcCall<Awaited<ReturnType<Actions["createFoodOrder"]>>>("src.frontend.actions.FoodOrder.createFoodOrder", ...args);
export const createFoodOrderPaymentSession = (...args: Parameters<Actions["createFoodOrderPaymentSession"]>) => 
  rpcCall<Awaited<ReturnType<Actions["createFoodOrderPaymentSession"]>>>("src.frontend.actions.FoodOrder.createFoodOrderPaymentSession", ...args);
