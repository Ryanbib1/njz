'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReviewsManagement } from '@/backend/route-params';
import type { ReviewSlotItem, ReviewMatchStatus } from '@/backend/actions/ReviewsManagement';
import { getReviewsList, createReview, updateReview, deleteReview } from '@/backend/actions/ReviewsManagement';
import { toast } from "sonner";

// ===== Types =====
interface FormFields {
  author_name: string;
  rating: string;
  relative_time: string;
  content: string;
}

const MATCH_STATUS_LABELS: Record<ReviewMatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched',
  MISSING: 'Missing',
};

export interface ReviewsManagementState {
  /** 评论列表数据 */
  reviews: ReviewSlotItem[];
  /** 当前已存在的评论数量 */
  presentCount: number;
  /** 总槽位数量 */
  totalSlots: number;
  /** 列表加载状态 */
  isLoading: boolean;
  /** 保存中状态 */
  isSaving: boolean;
  /** 删除中状态 */
  isDeleting: boolean;
  /** 删除弹窗上下文 */
  deleteContext: { isOpen: boolean; reviewId: string | null; slot: number | null };
  /** 表单数据 */
  formData: FormFields;
  /** 当前选中的槽位编号 */
  activeSlotNumber: number | null;
  /** 当前选中的评论详情 */
  activeReview: ReviewSlotItem | null;
  /** 匹配状态标签映射 */
  MATCH_STATUS_LABELS: Record<ReviewMatchStatus, string>;
}

export interface ReviewsManagementHandlers {
  /** 选择某个槽位进行编辑/创建 */
  handleSelectSlot: (slot: number) => void;
  /** 清除当前选择 */
  handleClearSelection: () => void;
  /** 处理表单字段变更 */
  handleFormFieldChange: <K extends keyof FormFields>(field: K, value: FormFields[K]) => void;
  /** 保存或更新评论 */
  handleSave: (e: React.FormEvent) => Promise<void>;
  /** 打开删除确认弹窗 */
  openDeleteConfirmation: (reviewId: string, slot: number) => void;
  /** 关闭删除确认弹窗 */
  closeDeleteConfirmation: () => void;
  /** 执行删除操作 */
  confirmDelete: () => Promise<void>;
}

export const useReviewsManagement = (): { state: ReviewsManagementState, handlers: ReviewsManagementHandlers } => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reviewSlot: slotParam } = ReviewsManagement.getParams(searchParams);
  const activeSlotNumber = slotParam ? parseInt(slotParam, 10) : null;

  const [reviews, setReviews] = useState<ReviewSlotItem[]>([]);
  const [presentCount, setPresentCount] = useState<number>(0);
  const [totalSlots, setTotalSlots] = useState<number>(5);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const [deleteContext, setDeleteContext] = useState<{ isOpen: boolean; reviewId: string | null; slot: number | null }>({
    isOpen: false,
    reviewId: null,
    slot: null,
  });

  const [formData, setFormData] = useState<FormFields>({
    author_name: '',
    rating: '',
    relative_time: '',
    content: ''
  });

  const activeReview = useMemo(() => {
    if (!activeSlotNumber) return null;
    return reviews.find(r => r.review_slot === activeSlotNumber) || null;
  }, [activeSlotNumber, reviews]);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReviewsList({});
      setReviews(data.list);
      setPresentCount(data.present_count);
      setTotalSlots(data.total_slots);
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (activeReview) {
      setFormData({
        author_name: activeReview.author_name || '',
        rating: activeReview.rating !== null ? String(activeReview.rating) : '',
        relative_time: activeReview.relative_time || '',
        content: activeReview.content || ''
      });
    } else {
      setFormData({ author_name: '', rating: '', relative_time: '', content: '' });
    }
  }, [activeReview]);

  const handleSelectSlot = (slot: number) => {
    ReviewsManagement.navigateToDetail(router, { reviewSlot: String(slot) });
  };

  const handleClearSelection = () => {
    ReviewsManagement.navigateToMain(router);
  };

  const handleFormFieldChange = <K extends keyof FormFields>(field: K, value: FormFields[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlotNumber) return;

    setIsSaving(true);
    try {
      const ratingNum = parseInt(formData.rating, 10);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        throw new Error("Rating must be a valid number between 1 and 5.");
      }

      if (activeReview?.is_present && activeReview.review_id) {
        await updateReview({
          review_id: activeReview.review_id,
          author_name: formData.author_name,
          rating: ratingNum,
          relative_time: formData.relative_time,
          content: formData.content
        });
        toast.success("Review successfully updated.");
      } else {
        await createReview({
          review_slot: activeSlotNumber,
          author_name: formData.author_name,
          rating: ratingNum,
          relative_time: formData.relative_time,
          content: formData.content
        });
        toast.success("Review successfully created.");
      }
      await fetchReviews();
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || "Failed to save review");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirmation = (reviewId: string, slot: number) => {
    setDeleteContext({ isOpen: true, reviewId, slot });
  };

  const closeDeleteConfirmation = () => {
    if (!isDeleting) {
      setDeleteContext({ isOpen: false, reviewId: null, slot: null });
    }
  };

  const confirmDelete = async () => {
    if (!deleteContext.reviewId) return;
    setIsDeleting(true);
    try {
      await deleteReview({ review_id: deleteContext.reviewId });
      toast.success("Review successfully deleted.");
      setDeleteContext({ isOpen: false, reviewId: null, slot: null });
      await fetchReviews();
      
      if (activeSlotNumber === deleteContext.slot) {
        ReviewsManagement.navigateToMain(router);
      }
    } catch (error) {
      const e = error as Error;
      toast.error(e.message || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const state: ReviewsManagementState = {
    reviews,
    presentCount,
    totalSlots,
    isLoading,
    isSaving,
    isDeleting,
    deleteContext,
    formData,
    activeSlotNumber,
    activeReview,
    MATCH_STATUS_LABELS,
  };

  const handlers: ReviewsManagementHandlers = {
    handleSelectSlot,
    handleClearSelection,
    handleFormFieldChange,
    handleSave,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  };

  return { state, handlers };
};
