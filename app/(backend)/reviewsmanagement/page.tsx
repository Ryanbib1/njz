// {"router": "/reviewsmanagement", "id": "b05", "en_name": "ReviewsManagement"}
'use client';

import { useReviewsManagement } from '@/backend/hooks/useReviewsManagement';
import { ReviewsManagementView } from '@/backend/components/ReviewsManagementView';
export default function ReviewsManagementPage() {
  const {
    state,
    handlers
  } = useReviewsManagement();
  return <ReviewsManagementView state={state} handlers={handlers} />;
}
