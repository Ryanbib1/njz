// 无需登录
// 使用方法: import { useUserSession } from '@/tools/FrontendSession';
import { createPersistStore } from './storeFactory';

export const useUserSession = createPersistStore(
  'FrontendUserSession',
  {}
);
