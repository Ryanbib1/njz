/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/frontend/actions/OrderPaymentResult';

type Actions = typeof import('../../../../../src/frontend/actions/OrderPaymentResult');
export const getPaymentOrderDetails = (...args: Parameters<Actions["getPaymentOrderDetails"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getPaymentOrderDetails"]>>>("src.frontend.actions.OrderPaymentResult.getPaymentOrderDetails", ...args);
export const verifyFoodOrderPayment = (...args: Parameters<Actions["verifyFoodOrderPayment"]>) => 
  rpcCall<Awaited<ReturnType<Actions["verifyFoodOrderPayment"]>>>("src.frontend.actions.OrderPaymentResult.verifyFoodOrderPayment", ...args);
export const reconcileFoodOrderPayment = (...args: Parameters<Actions["reconcileFoodOrderPayment"]>) => 
  rpcCall<Awaited<ReturnType<Actions["reconcileFoodOrderPayment"]>>>("src.frontend.actions.OrderPaymentResult.reconcileFoodOrderPayment", ...args);
