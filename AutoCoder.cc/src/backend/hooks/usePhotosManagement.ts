'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhotosManagement } from '@/backend/route-params';
import type { 
  PhotoSlotItem, 
  GetPhotosListOutput
} from '@/backend/actions/PhotosManagement';
import { 
  getPhotosList, 
  getPhotoDetail, 
  createPhoto, 
  updatePhoto, 
  deletePhoto 
} from '@/backend/actions/PhotosManagement';
import { toast } from "sonner";

interface FormFields {
  alt: string;
  description: string;
  imageUrl: string;
}

// Export States
export interface PhotosManagementState {
  listData: GetPhotosListOutput | null; // 首页相册插槽列表数据
  isLoadingList: boolean; // 是否正在加载列表数据
  deleteTargetId: string | null; // 当前准备删除的记录 ID
  formData: FormFields; // 编辑器表单字段数据
  isEditorLoading: boolean; // 编辑器是否正在加载详情
  isEditorSaving: boolean; // 编辑器是否正在提交保存
  isDeleting: boolean; // 是否正在执行删除操作
  activeItemInfo: { mode: 'create' | 'edit'; item: PhotoSlotItem } | null; // 当前激活的编辑器配置信息
  isFormValid: boolean; // 表单必填项是否校验通过
}

// Export Handlers
export interface PhotosManagementHandlers {
  handleOpenEdit: (id: string) => void; // 点击编辑按钮，跳转并打开编辑面板
  handleOpenCreate: (photoKey: string) => void; // 点击创建按钮，跳转并打开创建面板
  handleClosePanel: () => void; // 关闭侧边编辑面板并重置路由
  handlePanelSuccess: () => void; // 编辑成功后的回调，刷新列表并关闭面板
  handleOpenDelete: (id: string) => void; // 打开删除确认对话框
  handleCloseDelete: () => void; // 关闭删除确认对话框
  handleDeleteSuccess: () => void; // 删除成功后的回调，刷新列表并关闭对话框
  handleFormFieldChange: <K extends keyof FormFields>(field: K, value: FormFields[K]) => void; // 处理表单输入项变化
  handleSavePhoto: () => Promise<void>; // 执行创建或更新相册记录请求
  handleConfirmDelete: () => Promise<void>; // 执行删除相册记录请求
}

export const usePhotosManagement = (): {
  state: PhotosManagementState;
  handlers: PhotosManagementHandlers;
} => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { restaurantphotoId } = PhotosManagement.getParams(searchParams);

  // ===== State =====
  const [listData, setListData] = useState<GetPhotosListOutput | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Editor specific state
  const [formData, setFormData] = useState<FormFields>({
    alt: '',
    description: '',
    imageUrl: ''
  });
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isEditorSaving, setIsEditorSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===== Data Fetching =====
  const loadList = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await getPhotosList();
      setListData(data);
    } catch (error) {
      // Framework handles toast
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ===== Derived State =====
  const activeItemInfo = useMemo(() => {
    if (!listData || !restaurantphotoId) return null;
    
    const byId = listData.items.find((i) => i.id === restaurantphotoId);
    if (byId) return { mode: 'edit' as const, item: byId };

    const byKey = listData.items.find((i) => i.photoKey === restaurantphotoId && i.recordStatus === 'MISSING');
    if (byKey) return { mode: 'create' as const, item: byKey };

    return null;
  }, [listData, restaurantphotoId]);

  const isFormValid = !!(formData.alt && formData.description && formData.imageUrl);

  // ===== Effect for Editor Detail =====
  useEffect(() => {
    if (!activeItemInfo) return;

    if (activeItemInfo.mode === 'create') {
      setFormData({ alt: '', description: '', imageUrl: '' });
    } else if (activeItemInfo.mode === 'edit' && activeItemInfo.item.id) {
      setIsEditorLoading(true);
      getPhotoDetail({ id: activeItemInfo.item.id })
        .then((detail) => {
          setFormData({
            alt: detail.alt,
            description: detail.description,
            imageUrl: detail.imageUrl
          });
        })
        .finally(() => {
          setIsEditorLoading(false);
        });
    }
  }, [activeItemInfo]);

  // ===== Handlers =====
  const handleOpenEdit = (id: string) => {
    PhotosManagement.navigateToDetail(router, { restaurantphotoId: id });
  };

  const handleOpenCreate = (photoKey: string) => {
    PhotosManagement.navigateToDetail(router, { restaurantphotoId: photoKey });
  };

  const handleClosePanel = () => {
    PhotosManagement.navigateToMain(router);
  };

  const handlePanelSuccess = () => {
    loadList();
    handleClosePanel();
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleCloseDelete = () => {
    setDeleteTargetId(null);
  };

  const handleDeleteSuccess = () => {
    loadList();
    handleCloseDelete();
  };

  const handleFormFieldChange = <K extends keyof FormFields>(field: K, value: FormFields[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePhoto = async () => {
    if (!activeItemInfo || !isFormValid) return;
    setIsEditorSaving(true);
    try {
      if (activeItemInfo.mode === 'create') {
        await createPhoto({
          photoKey: activeItemInfo.item.photoKey,
          alt: formData.alt,
          description: formData.description,
          imageUrl: formData.imageUrl
        });
        toast.success("Photo record created successfully.");
      } else if (activeItemInfo.mode === 'edit' && activeItemInfo.item.id) {
        await updatePhoto({
          id: activeItemInfo.item.id,
          alt: formData.alt,
          description: formData.description,
          imageUrl: formData.imageUrl
        });
        toast.success("Photo record updated successfully.");
      }
      handlePanelSuccess();
    } catch (error) {
      // Framework handles toast
    } finally {
      setIsEditorSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deletePhoto({ id: deleteTargetId });
      toast.success("Photo record deleted successfully.");
      handleDeleteSuccess();
    } catch (error) {
      // Framework handles toast
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    state: {
      listData,
      isLoadingList,
      deleteTargetId,
      formData,
      isEditorLoading,
      isEditorSaving,
      isDeleting,
      activeItemInfo,
      isFormValid
    },
    handlers: {
      handleOpenEdit,
      handleOpenCreate,
      handleClosePanel,
      handlePanelSuccess,
      handleOpenDelete,
      handleCloseDelete,
      handleDeleteSuccess,
      handleFormFieldChange,
      handleSavePhoto,
      handleConfirmDelete
    }
  };
};