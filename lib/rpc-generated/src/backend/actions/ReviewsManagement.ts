/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/ReviewsManagement';

type Actions = typeof import('../../../../../src/backend/actions/ReviewsManagement');
export const getReviewsList = (...args: Parameters<Actions["getReviewsList"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getReviewsList"]>>>("src.backend.actions.ReviewsManagement.getReviewsList", ...args);
export const getReviewDetail = (...args: Parameters<Actions["getReviewDetail"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getReviewDetail"]>>>("src.backend.actions.ReviewsManagement.getReviewDetail", ...args);
export const createReview = (...args: Parameters<Actions["createReview"]>) => 
  rpcCall<Awaited<ReturnType<Actions["createReview"]>>>("src.backend.actions.ReviewsManagement.createReview", ...args);
export const updateReview = (...args: Parameters<Actions["updateReview"]>) => 
  rpcCall<Awaited<ReturnType<Actions["updateReview"]>>>("src.backend.actions.ReviewsManagement.updateReview", ...args);
export const deleteReview = (...args: Parameters<Actions["deleteReview"]>) => 
  rpcCall<Awaited<ReturnType<Actions["deleteReview"]>>>("src.backend.actions.ReviewsManagement.deleteReview", ...args);
