/* Auto-generated */
import { rpcCall } from '@/tools/rpc-client';
export type * from '../../../../../src/backend/actions/PhotosManagement';

type Actions = typeof import('../../../../../src/backend/actions/PhotosManagement');
export const getPhotosList = (...args: Parameters<Actions["getPhotosList"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getPhotosList"]>>>("src.backend.actions.PhotosManagement.getPhotosList", ...args);
export const getPhotoDetail = (...args: Parameters<Actions["getPhotoDetail"]>) => 
  rpcCall<Awaited<ReturnType<Actions["getPhotoDetail"]>>>("src.backend.actions.PhotosManagement.getPhotoDetail", ...args);
export const createPhoto = (...args: Parameters<Actions["createPhoto"]>) => 
  rpcCall<Awaited<ReturnType<Actions["createPhoto"]>>>("src.backend.actions.PhotosManagement.createPhoto", ...args);
export const updatePhoto = (...args: Parameters<Actions["updatePhoto"]>) => 
  rpcCall<Awaited<ReturnType<Actions["updatePhoto"]>>>("src.backend.actions.PhotosManagement.updatePhoto", ...args);
export const deletePhoto = (...args: Parameters<Actions["deletePhoto"]>) => 
  rpcCall<Awaited<ReturnType<Actions["deletePhoto"]>>>("src.backend.actions.PhotosManagement.deletePhoto", ...args);
