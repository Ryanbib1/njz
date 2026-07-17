'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReviewsManagement } from '@/backend/route-params';
import type { ReviewSlotItem, ReviewMatchStatus } from '@/backend/actions/ReviewsManagement';
import { getReviewsList, createReview, updateReview, deleteReview } from '@/backend/actions/ReviewsManagement';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ===== 枚举映射 =====
const MATCH_STATUS_LABELS: Record<ReviewMatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched',
  MISSING: 'Missing'
};

// ===== Types =====
interface FormFields {
  author_name: string;
  rating: string;
  relative_time: string;
  content: string;
}
export default function ReviewsManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    reviewSlot: slotParam
  } = ReviewsManagement.getParams(searchParams);
  const activeSlotNumber = slotParam ? parseInt(slotParam, 10) : null;

  // ===== State =====
  const [reviews, setReviews] = useState<ReviewSlotItem[]>([]);
  const [presentCount, setPresentCount] = useState<number>(0);
  const [totalSlots, setTotalSlots] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteContext, setDeleteContext] = useState<{
    isOpen: boolean;
    reviewId: string | null;
    slot: number | null;
  }>({
    isOpen: false,
    reviewId: null,
    slot: null
  });
  const [formData, setFormData] = useState<FormFields>({
    author_name: '',
    rating: '',
    relative_time: '',
    content: ''
  });

  // ===== Memos =====
  const activeReview = useMemo(() => {
    if (!activeSlotNumber) return null;
    return reviews.find(r => r.review_slot === activeSlotNumber) || null;
  }, [activeSlotNumber, reviews]);

  // ===== Effects =====
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
      setFormData({
        author_name: '',
        rating: '',
        relative_time: '',
        content: ''
      });
    }
  }, [activeReview]);

  // ===== Handlers =====
  const handleSelectSlot = (slot: number) => {
    ReviewsManagement.navigateToDetail(router, {
      reviewSlot: String(slot)
    });
  };
  const handleClearSelection = () => {
    ReviewsManagement.navigateToMain(router);
  };
  const handleFormFieldChange = <K extends keyof FormFields,>(field: K, value: FormFields[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    setDeleteContext({
      isOpen: true,
      reviewId,
      slot
    });
  };
  const closeDeleteConfirmation = () => {
    if (!isDeleting) {
      setDeleteContext({
        isOpen: false,
        reviewId: null,
        slot: null
      });
    }
  };
  const confirmDelete = async () => {
    if (!deleteContext.reviewId) return;
    setIsDeleting(true);
    try {
      await deleteReview({
        review_id: deleteContext.reviewId
      });
      toast.success("Review successfully deleted.");
      setDeleteContext({
        isOpen: false,
        reviewId: null,
        slot: null
      });
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

  // ===== Render =====
  return <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r4459a80f458bb812-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
      <header data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r22019c391656ff71-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
        <h1 data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r3f39cd633bc45d4a-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Reviews Management</h1>
        <p data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r555d0256a4fef6c9-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Data synchronization status: {presentCount}/{totalSlots} Slots Present</p>
      </header>

      <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-re148a95cb06048d3-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
        {/* Left Pane: Reviews Verification List */}
        <section data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rdbb760b4320fd21b-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
          <header data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r822ded5c7e3a0095-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
            <h2 data-api-unique-id='reviewsmanagementview-skeleton-with-logic-ref7c7bff048a6998-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Reviews Verification List</h2>
          </header>
          
          {isLoading ? <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r305970c8ba6c6572-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Loading review slots...</div> : reviews.length === 0 ? <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r0470e5d736f6fc5a-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>No reviews data available.</div> : <table data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r73b5dbeb32aa5916-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              <thead data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rced403e2ccfcb0a8-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <tr data-api-unique-id='reviewsmanagementview-skeleton-with-logic-ra2249b2ebac30cc8-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r6185d9c0c31ef9c9-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Slot</th>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r2844c8bdef347ce5-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Reviewer</th>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rb86cb4212456bed4-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Time</th>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r6805eb03db9c7dcb-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Rating</th>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r291127d481c1155a-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Status</th>
                  <th data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r0e8e493bc1555f15-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Actions</th>
                </tr>
              </thead>
              <tbody data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r68db1de33c896d11-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                {reviews.map((review, index) => <tr key={review.review_slot} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r2f7cf5bfb5b500b9-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r6d3d6a8b91cce2e0-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`reviews-${index}-review_slot`} data-api-map-var-name='review'>Slot 0{review.review_slot}</td>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r2864337d88572ba9-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>{review.author_name || '-'}</td>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r0517af9c108fdc24-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>{review.relative_time || '-'}</td>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rc2f32b83a6d2ec55-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>{review.rating ? `${review.rating} Stars` : '-'}</td>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r1b99c5d60c5eb5e1-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>{MATCH_STATUS_LABELS[review.match_status]}</td>
                    <td data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r5517535f3835fc65-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>
                      <Button variant="secondary" disabled={isLoading} onClick={() => handleSelectSlot(review.review_slot)} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r10408ec5bff075c0-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {review.is_present ? 'Edit Review' : 'Create Review'}
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>}
        </section>

        {/* Right Pane: Review Detail & Editor Panel */}
        <section data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r3f2396b157a446ab-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
          {!activeSlotNumber ? <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r649101f911cd0aec-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              <p data-api-unique-id='reviewsmanagementview-skeleton-with-logic-ra95a16fdebac6975-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Please select a review slot from the list to view or edit its details.</p>
            </div> : !activeReview ? <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r81e2cf6220befbfa-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Loading detail context...</div> : <form onSubmit={handleSave} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r271727f7634c50b4-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              <header data-api-unique-id='reviewsmanagementview-skeleton-with-logic-re59c9e6c6da120da-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <h2 data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rb8bbbb7748938c98-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Slot 0{activeReview.review_slot}</h2>
                <span data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r7474efb97bd3c0ef-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>{MATCH_STATUS_LABELS[activeReview.match_status]}</span>
                {activeReview.is_present && activeReview.review_id && <Button type="button" variant="destructive" disabled={isSaving} onClick={() => openDeleteConfirmation(activeReview.review_id!, activeReview.review_slot)} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r4206136e765b0bee-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                    Delete Review
                  </Button>}
              </header>

              <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r3a35fa045c641e83-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <label data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r39387cb2da31fe4e-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  <span data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r2aa839d1dfee32f3-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Author Name</span>
                  <Input value={formData.author_name} onChange={e => handleFormFieldChange('author_name', e.target.value)} placeholder="Enter author name" disabled={isSaving} required data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rd120fa28ad74ffc6-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' />
                </label>
              </div>

              <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r57ab995bc9b2ca31-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <label data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rb59bb3d4f67a5acb-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  <span data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r416b42880586b83f-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Rating (1-5)</span>
                  <Input type="number" min="1" max="5" value={formData.rating} onChange={e => handleFormFieldChange('rating', e.target.value)} placeholder="Enter rating" disabled={isSaving} required data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r923b4f22d16b63b1-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' />
                </label>
              </div>

              <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r4e58ae57b849ae41-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <label data-api-unique-id='reviewsmanagementview-skeleton-with-logic-ra8654ab2ec6abf52-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  <span data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rac529e666ae11a1b-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Relative Time</span>
                  <Input value={formData.relative_time} onChange={e => handleFormFieldChange('relative_time', e.target.value)} placeholder="e.g. 2 weeks ago" disabled={isSaving} required data-api-unique-id='reviewsmanagementview-skeleton-with-logic-re9c1d522fbb3c34f-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' />
                </label>
              </div>

              <div data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r27de039734b71dac-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <label data-api-unique-id='reviewsmanagementview-skeleton-with-logic-ra780adc31184f700-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  <span data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r55263f34f9f6df48-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Verbatim Review Content</span>
                  <Textarea value={formData.content} onChange={e => handleFormFieldChange('content', e.target.value)} placeholder="Enter the exact review text" disabled={isSaving} required data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r747f0f3f9d706376-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic' />
                </label>
              </div>

              <footer data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r61557a35877e58f7-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                <Button type="submit" disabled={isSaving} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r0e8e2024ed815859-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  {activeReview.is_present ? 'Update Review' : 'Save Review'}
                </Button>
                <Button type="button" variant="outline" disabled={isSaving} onClick={handleClearSelection} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rafe22d0ee8fb405d-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
                  Cancel Edit
                </Button>
              </footer>
            </form>}
        </section>
      </div>

      {/* Deletion Confirmation Dialog */}
      <Dialog open={deleteContext.isOpen} onOpenChange={open => !open && closeDeleteConfirmation()} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r335dcc817b56ec8f-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
        <DialogContent data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r65f5d8ec9417f594-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
          <DialogHeader data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r22af8bfb2b3565ae-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
            <DialogTitle data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r4a11ec0257715223-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>Confirm Review Deletion</DialogTitle>
            <DialogDescription data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r537fdc18ddab25d2-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              Are you sure you want to delete this review? This will immediately remove the review from the homepage and change its slot status to Missing. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r917fa50f0f052a4c-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
            <Button variant="outline" onClick={closeDeleteConfirmation} disabled={isDeleting} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-r7af46ac1df68a36c-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting} data-api-unique-id='reviewsmanagementview-skeleton-with-logic-rc3338c9e732dee9e-s3827904801' data-api-unique-page-name='src/backend/components/ReviewsManagementView_skeleton_with_logic'>
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}