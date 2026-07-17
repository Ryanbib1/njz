'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type {
  GetRestaurantProfileOutput,
  RestaurantPhoto,
  RestaurantReview,
  RestaurantHour,
  HighlightsJson,
} from '@/frontend/types/Home';
import { getRestaurantProfile } from '@/frontend/actions/Home';

/**
 * @Hook_Interface_Definitions
 */
export interface UseHomeState {
  /**
   * @State: isLoading
   * @Description: 页面整体数据加载状态
   * @Initial: true
   * @Mutated_By: fetchHomeData
   */
  isLoading: boolean;

  /**
   * @State: errorMsg
   * @Description: 数据加载错误信息
   * @Initial: null
   * @Mutated_By: fetchHomeData
   */
  errorMsg: string | null;

  /**
   * @State: profile
   * @Description: 餐厅主页完整聚合数据
   * @Initial: null
   * @Mutated_By: fetchHomeData
   */
  profile: GetRestaurantProfileOutput | null;
}

export interface UseHomeHandlers {}

/**
 * @Hook_Implementation
 */
export function useHome() {
  // --- States ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<GetRestaurantProfileOutput | null>(null);

  // --- Refs (Anti-recursion guard) ---
  const isFetchingRef = useRef(false);

  // --- Handlers / Inner Functions ---

  /**
   * @Method: fetchHomeData
   * @Description: 加载首页全部展示数据
   * @Trigger: 组件挂载时 (useEffect)
   * @Depends_API: getRestaurantProfile
   * @Reads_State: None
   * @State_Mutations: isLoading, errorMsg, profile
   */
  const fetchHomeData = useCallback(async () => {
    // 防止重复进入
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // 1. [fetchHomeData]: 设置 isLoading = true，清空 errorMsg。
      setIsLoading(true);
      setErrorMsg(null);

      // 2. [fetchHomeData]: 调用 getRestaurantProfile 接口获取系统数据。
      const response = await getRestaurantProfile({});

      // 3. [fetchHomeData]: 若成功，将返回的结果赋值给 profile 状态。
      setProfile(response);
    } catch (error: any) {
      // 4. [fetchHomeData]: 若失败，捕获异常并将错误信息赋值给 errorMsg。
      const errorMessage = error?.message || 'Failed to fetch restaurant profile';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      // 5. [fetchHomeData]: finally 块中设置 isLoading = false。
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // --- Life Cycle ---

  /**
   * @Trigger: 组件挂载时 (useEffect)
   */
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // --- Return structure ---
  return {
    state: {
      isLoading,
      errorMsg,
      profile,
    },
    handlers: {},
  } satisfies { state: UseHomeState; handlers: UseHomeHandlers };
}