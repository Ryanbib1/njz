'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { 
  UpdateRestaurantProfileInput, 
  GetAdminDashboardDataOutput, 
  DashboardPhotoItem, 
  DashboardReviewItem, 
  DashboardHourItem, 
  DashboardCounts 
} from '@/backend/types/AdminDashboard';
import { 
  getAdminDashboardData, 
  updateRestaurantProfile, 
  removeDashboardPhoto, 
  removeDashboardReview 
} from '@/backend/actions/AdminDashboard';
import { 
  AdminDashboard, 
  PhotosManagement, 
  ReviewsManagement, 
  BusinessInfoManagement 
} from '@/backend/route-params';

// Export States
export interface UseAdminDashboardState {
  /**
   * @State: isLoading
   * @Description: 标识页面级数据（概览、列表）是否正在加载中
   * @Initial: true
   * @Mutated_By: fetchDashboardData
   */
  isLoading: boolean;

  /**
   * @State: isSaving
   * @Description: 标识餐厅基本信息表单是否正在提交保存中
   * @Initial: false
   * @Mutated_By: handleSaveProfile
   */
  isSaving: boolean;

  /**
   * @State: saveSuccess
   * @Description: 控制表单保存成功后的 Toast 提示或 Check 图标的显示状态
   * @Initial: false
   * @Mutated_By: handleSaveProfile
   */
  saveSuccess: boolean;

  /**
   * @State: dashboardData
   * @Description: 后端返回的仪表盘概览核心数据聚合
   * @Initial: null
   * @Mutated_By: fetchDashboardData
   */
  dashboardData: GetAdminDashboardDataOutput | null;

  /**
   * @State: profileFormData
   * @Description: 用于受控绑定 Store Profile Form 各个输入框的表单状态对象
   * @Initial: { name: '', brandStory: '', phone: '', website: '', address: '' }
   * @Mutated_By: fetchDashboardData, handleProfileFormChange
   */
  profileFormData: UpdateRestaurantProfileInput;
}

// Export Handlers
export interface UseAdminDashboardHandlers {
  /**
   * @Method: handleProfileFormChange
   * @Description: 更新餐厅基本信息受控表单字段
   * @Trigger: Store Profile Form 输入框内容变化时触发
   */
  handleProfileFormChange: <K extends keyof UpdateRestaurantProfileInput>(
    field: K, 
    value: UpdateRestaurantProfileInput[K]
  ) => void;

  /**
   * @Method: handleSaveProfile
   * @Description: 提交最新的餐厅信息表单
   * @Trigger: 点击 "Publish Changes" 按钮提交表单
   */
  handleSaveProfile: (e: React.FormEvent, formData: UpdateRestaurantProfileInput) => Promise<void>;

  /**
   * @Method: handleRemovePhoto
   * @Description: 在仪表盘快速移除选中的照片记录
   * @Trigger: 在 Gallery 卡片区域点击具体图片的 "Remove" 按钮
   */
  handleRemovePhoto: (photoId: string) => Promise<void>;

  /**
   * @Method: handleHideReview
   * @Description: 在仪表盘快速隐藏（物理删除）选中的评论记录
   * @Trigger: 在 Review 列表项点击 "Hide" 按钮
   */
  handleHideReview: (reviewId: string) => Promise<void>;

  /**
   * @Method: handleNavigateToPhotosManagement
   * @Description: 跳转到照片管理独立模块主页面
   */
  handleNavigateToPhotosManagement: () => void;

  /**
   * @Method: handleNavigateToPhotoDetail
   * @Description: 跳转到单张照片的详细编辑页面
   */
  handleNavigateToPhotoDetail: (photoId: string) => void;

  /**
   * @Method: handleNavigateToReviewsManagement
   * @Description: 跳转到评论管理独立模块主页面
   */
  handleNavigateToReviewsManagement: () => void;

  /**
   * @Method: handleNavigateToReviewDetail
   * @Description: 跳转到单条评论的详细编辑页面
   */
  handleNavigateToReviewDetail: (slot: number) => void;

  /**
   * @Method: handleNavigateToBusinessInfo
   * @Description: 跳转到详细商业信息管理界面
   */
  handleNavigateToBusinessInfo: () => void;
}

/**
 * useAdminDashboard Hook 实现
 */
export function useAdminDashboard() {
  const router = useRouter();

  // --- States ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<GetAdminDashboardDataOutput | null>(null);
  const [profileFormData, setProfileFormData] = useState<UpdateRestaurantProfileInput>({
    name: '',
    brandStory: '',
    phone: '',
    website: '',
    address: ''
  });

  // --- Inner Functions ---

  /**
   * @Method: fetchDashboardData
   * @Steps:
   *   1. [设置 isLoading = true]: 初始化加载状态。
   *   2. [调用 getAdminDashboardData() 获取所有数据]: 执行 API 请求。
   *   3. [若返回数据中包含 restaurant，则提取相应字段更新 profileFormData]: 同步表单初始值。
   *   4. [将全量数据赋值给 dashboardData 状态用于渲染卡片和列表]: 更新视图数据。
   *   5. [finally 块中设置 isLoading = false]: 关闭加载状态。
   */
  const fetchDashboardData = useCallback(async () => {
    // 1. [设置 isLoading = true]: 初始化加载状态。
    setIsLoading(true);
    try {
      // 2. [调用 getAdminDashboardData() 获取所有数据]: 执行 API 请求。
      const data = await getAdminDashboardData();
      
      // 3. [若返回数据中包含 restaurant，则提取相应字段更新 profileFormData]: 同步表单初始值。
      if (data.restaurant) {
        setProfileFormData({
          name: data.restaurant.name || '',
          brandStory: data.restaurant.brandStory || '',
          phone: data.restaurant.phone || '',
          website: data.restaurant.website || '',
          address: data.restaurant.address || '',
        });
      }
      
      // 4. [将全量数据赋值给 dashboardData 状态用于渲染卡片和列表]: 更新视图数据。
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      // 5. [finally 块中设置 isLoading = false]: 关闭加载状态。
      setIsLoading(false);
    }
  }, []);

  // --- Life Cycle ---
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Handlers ---

  /**
   * @Method: handleProfileFormChange
   * @Steps:
   *   1. [接收字段名和对应值，使用 setState(prev => ({ ...prev, [field]: value })) 更新本地 profileFormData]: 保持受控表单同步。
   */
  const handleProfileFormChange: UseAdminDashboardHandlers['handleProfileFormChange'] = (field, value) => {
    // 1. [接收字段名和对应值，使用 setState(prev => ({ ...prev, [field]: value })) 更新本地 profileFormData]: 保持受控表单同步。
    setProfileFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * @Method: handleSaveProfile
   * @Steps:
   *   1. [阻止默认表单提交行为]: 防止页面刷新。
   *   2. [设置 isSaving = true，重置 saveSuccess = false]: 进入保存状态。
   *   3. [调用 updateRestaurantProfile(formData) 发起更新请求]: 提交数据。
   *   4. [若成功，设置 saveSuccess = true，并设置 3 秒后的定时器恢复 saveSuccess = false]: 显示成功反馈。
   *   5. [finally 块中设置 isSaving = false]: 结束保存状态。
   */
  const handleSaveProfile: UseAdminDashboardHandlers['handleSaveProfile'] = async (e, formData) => {
    // 1. [阻止默认表单提交行为]: 防止页面刷新。
    e.preventDefault();
    // 2. [设置 isSaving = true，重置 saveSuccess = false]: 进入保存状态。
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 3. [调用 updateRestaurantProfile(formData) 发起更新请求]: 提交数据。
      await updateRestaurantProfile(formData);
      // 4. [若成功，设置 saveSuccess = true，并设置 3 秒后的定时器恢复 saveSuccess = false]: 显示成功反馈。
      setSaveSuccess(true);
      toast.success('Profile updated successfully');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      // 5. [finally 块中设置 isSaving = false]: 结束保存状态。
      setIsSaving(false);
    }
  };

  /**
   * @Method: handleRemovePhoto
   * @Steps:
   *   1. [弹出 window.confirm 二次确认提示]: 防止误删。
   *   2. [确认后调用 removeDashboardPhoto({ id: photoId })]: 执行删除。
   *   3. [成功后调用内部 fetchDashboardData() 重新拉取概览数据以刷新视图]: 同步服务端状态。
   */
  const handleRemovePhoto = async (photoId: string) => {
    // 1. [弹出 window.confirm 二次确认提示]: 防止误删。
    if (!window.confirm('Are you sure you want to remove this photo?')) return;

    try {
      // 2. [确认后调用 removeDashboardPhoto({ id: photoId })]: 执行删除。
      await removeDashboardPhoto({ id: photoId });
      toast.success('Photo removed');
      // 3. [成功后调用内部 fetchDashboardData() 重新拉取概览数据以刷新视图]: 同步服务端状态。
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  /**
   * @Method: handleHideReview
   * @Steps:
   *   1. [弹出 window.confirm 二次确认提示]: 防止误操作。
   *   2. [确认后调用 removeDashboardReview({ id: reviewId })]: 执行移除。
   *   3. [成功后调用内部 fetchDashboardData() 重新拉取概览数据以刷新视图]: 同步数据。
   */
  const handleHideReview = async (reviewId: string) => {
    // 1. [弹出 window.confirm 二次确认提示]: 防止误操作。
    if (!window.confirm('Are you sure you want to hide this review?')) return;

    try {
      // 2. [确认后调用 removeDashboardReview({ id: reviewId })]: 执行移除。
      await removeDashboardReview({ id: reviewId });
      toast.success('Review hidden');
      // 3. [成功后调用内部 fetchDashboardData() 重新拉取概览数据以刷新视图]: 同步数据。
      await fetchDashboardData();
    } catch (error) {
      toast.error('Failed to hide review');
    }
  };

  /**
   * @Method: handleNavigateToPhotosManagement
   * @Steps:
   *   1. [调用 router.push 按照 PhotosManagement.path 进行页面跳转]: 跳转到照片管理。
   */
  const handleNavigateToPhotosManagement = () => {
    // 1. [调用 router.push 按照 PhotosManagement.path 进行页面跳转]: 跳转到照片管理。
    PhotosManagement.navigateToMain(router);
  };

  /**
   * @Method: handleNavigateToPhotoDetail
   * @Steps:
   *   1. [组装参数 { restaurantphotoId: photoId }]: 准备跳转参数。
   *   2. [按照 route-params 中 PhotosManagement.navigateToDetail 定义拼接 URL 并跳转]: 进入详情页。
   */
  const handleNavigateToPhotoDetail = (photoId: string) => {
    // 1. [组装参数 { restaurantphotoId: photoId }]: 准备跳转参数。
    // 2. [按照 route-params 中 PhotosManagement.navigateToDetail 定义拼接 URL 并跳转]: 进入详情页。
    PhotosManagement.navigateToDetail(router, { restaurantphotoId: photoId });
  };

  /**
   * @Method: handleNavigateToReviewsManagement
   * @Steps:
   *   1. [调用 router.push 按照 ReviewsManagement.path 进行页面跳转]: 跳转至评论管理。
   */
  const handleNavigateToReviewsManagement = () => {
    // 1. [调用 router.push 按照 ReviewsManagement.path 进行页面跳转]: 跳转至评论管理。
    ReviewsManagement.navigateToMain(router);
  };

  /**
   * @Method: handleNavigateToReviewDetail
   * @Steps:
   *   1. [组装参数 { reviewSlot: String(slot) }]: 序列化槽位参数。
   *   2. [按照 route-params 中 ReviewsManagement.navigateToDetail 定义拼接 URL 并跳转]: 导航至评论详情。
   */
  const handleNavigateToReviewDetail = (slot: number) => {
    // 1. [组装参数 { reviewSlot: String(slot) }]: 序列化槽位参数。
    // 2. [按照 route-params 中 ReviewsManagement.navigateToDetail 定义拼接 URL 并跳转]: 导航至评论详情。
    ReviewsManagement.navigateToDetail(router, { reviewSlot: String(slot) });
  };

  /**
   * @Method: handleNavigateToBusinessInfo
   * @Steps:
   *   1. [调用 router.push 按照 BusinessInfoManagement.path 进行页面跳转]: 跳转到营业时间管理。
   */
  const handleNavigateToBusinessInfo = () => {
    // 1. [调用 router.push 按照 BusinessInfoManagement.path 进行页面跳转]: 跳转到营业时间管理。
    BusinessInfoManagement.navigateTo(router);
  };

  return {
    state: {
      isLoading,
      isSaving,
      saveSuccess,
      dashboardData,
      profileFormData
    },
    handlers: {
      handleProfileFormChange,
      handleSaveProfile,
      handleRemovePhoto,
      handleHideReview,
      handleNavigateToPhotosManagement,
      handleNavigateToPhotoDetail,
      handleNavigateToReviewsManagement,
      handleNavigateToReviewDetail,
      handleNavigateToBusinessInfo
    }
  } satisfies { state: UseAdminDashboardState; handlers: UseAdminDashboardHandlers };
}