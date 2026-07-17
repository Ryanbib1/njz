'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhotosManagement } from '@/backend/route-params';
import type { PhotoSlotItem, RecordStatus, MatchStatus, GetPhotosListOutput } from '@/backend/actions/PhotosManagement';
import { getPhotosList, getPhotoDetail, createPhoto, updatePhoto, deletePhoto } from '@/backend/actions/PhotosManagement';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

// ===== Enum Mappings (en-US) =====
const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  PRESENT: 'Present',
  MISSING: 'Missing'
};
const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched'
};

// ===== Types =====
interface FormFields {
  alt: string;
  description: string;
  imageUrl: string;
}

// ===== Sub-Components =====

function PhotoEditorSheet({
  isOpen,
  mode,
  item,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  item: PhotoSlotItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<FormFields>({
    alt: '',
    description: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!isOpen || !item) return;
    if (mode === 'create') {
      setFormData({
        alt: '',
        description: '',
        imageUrl: ''
      });
    } else if (mode === 'edit' && item.id) {
      setIsLoading(true);
      getPhotoDetail({
        id: item.id
      }).then(detail => {
        setFormData({
          alt: detail.alt,
          description: detail.description,
          imageUrl: detail.imageUrl
        });
      }).catch(() => {
        // Framework handles toast
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, mode, item]);
  const handleFormFieldChange = <K extends keyof FormFields,>(field: K, value: FormFields[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const isFormValid = !!(formData.alt && formData.description && formData.imageUrl);
  const handleSave = async () => {
    if (!item || !isFormValid) return;
    setIsSaving(true);
    try {
      if (mode === 'create') {
        await createPhoto({
          photoKey: item.photoKey,
          alt: formData.alt,
          description: formData.description,
          imageUrl: formData.imageUrl
        });
        toast.success("Photo record created successfully.");
      } else if (mode === 'edit' && item.id) {
        await updatePhoto({
          id: item.id,
          alt: formData.alt,
          description: formData.description,
          imageUrl: formData.imageUrl
        });
        toast.success("Photo record updated successfully.");
      }
      onSuccess();
    } catch (error) {
      // Framework handles toast
    } finally {
      setIsSaving(false);
    }
  };
  return <Sheet open={isOpen} onOpenChange={open => !open && onClose()} data-api-unique-id='photosmanagementview-skeleton-with-logic-r34fa9a9b631ba9a3-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
      <SheetContent data-api-unique-id='photosmanagementview-skeleton-with-logic-r34d956c45f014d88-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
        <SheetHeader data-api-unique-id='photosmanagementview-skeleton-with-logic-rf7388af2d733dc99-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
          <SheetTitle data-api-unique-id='photosmanagementview-skeleton-with-logic-rd0898975d40069ac-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            {mode === 'create' ? `Create Missing Record: ${item?.photoKey}` : `Edit Record: ${item?.photoKey}`}
          </SheetTitle>
          <SheetDescription data-api-unique-id='photosmanagementview-skeleton-with-logic-r5955e7e13490cf7c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Modify the structured content for this gallery slot.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r5cc5aabd47a537d1-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Loading details...</div> : <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r22a2bce658eefc3a-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            <div data-api-unique-id='photosmanagementview-skeleton-with-logic-rda4533c9bcecd91d-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
              {formData.imageUrl ? <img src={formData.imageUrl} alt={formData.alt || 'Live preview'} data-api-unique-id='photosmanagementview-skeleton-with-logic-r8ee2407aa6833cd1-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' /> : <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r43009ae4254e2223-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>No Image Provided</div>}
            </div>

            <form data-api-unique-id='photosmanagementview-skeleton-with-logic-r7096e0d8de7eb20c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-rd28398d7337c9ffc-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='photosmanagementview-skeleton-with-logic-re007e142b53cdf76-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Slot Assignment</Label>
                <Input value={`${item?.photoKey} (Sequence: ${item?.sortOrder})`} disabled data-api-unique-id='photosmanagementview-skeleton-with-logic-r68662720c7abbdff-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />
              </div>

              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r29d08fd4c2a6e331-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='photosmanagementview-skeleton-with-logic-r1496dbafedf50d14-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Image URL</Label>
                <Input value={formData.imageUrl} onChange={e => handleFormFieldChange('imageUrl', e.target.value)} placeholder="https://example.com/image.jpg" data-api-unique-id='photosmanagementview-skeleton-with-logic-r29ee19d6ad11e432-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />
              </div>

              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r395e33ee2a9f4a1c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='photosmanagementview-skeleton-with-logic-rc534616e90a66e57-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Alt Text</Label>
                <Input value={formData.alt} onChange={e => handleFormFieldChange('alt', e.target.value)} placeholder="Descriptive text for accessibility" data-api-unique-id='photosmanagementview-skeleton-with-logic-rebbeebd849853ca9-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />
              </div>

              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r08eb61c9b4112e35-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='photosmanagementview-skeleton-with-logic-rfff37d4296b617e9-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Description</Label>
                <Textarea value={formData.description} onChange={e => handleFormFieldChange('description', e.target.value)} placeholder="Narrative caption" data-api-unique-id='photosmanagementview-skeleton-with-logic-rae9421d196ed6368-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />
              </div>
            </form>

            {!isFormValid && <Alert variant="destructive" data-api-unique-id='photosmanagementview-skeleton-with-logic-r35bfc31a83211fd5-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <AlertDescription data-api-unique-id='photosmanagementview-skeleton-with-logic-ra83f8f518f7fbe12-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                  All required fields (Image URL, Alt Text, Description) must be filled to save configuration.
                </AlertDescription>
              </Alert>}
          </div>}

        <SheetFooter data-api-unique-id='photosmanagementview-skeleton-with-logic-r899c56bfe8ae2709-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
          <Button variant="outline" onClick={onClose} disabled={isSaving} data-api-unique-id='photosmanagementview-skeleton-with-logic-r4cfd581fe52066a0-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid || isSaving || isLoading} data-api-unique-id='photosmanagementview-skeleton-with-logic-raa868c2370fc987f-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Save Configuration
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>;
}
function DeletePhotoDialog({
  isOpen,
  targetId,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  targetId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = async () => {
    if (!targetId) return;
    setIsDeleting(true);
    try {
      await deletePhoto({
        id: targetId
      });
      toast.success("Photo record deleted successfully.");
      onSuccess();
    } catch (error) {
      // Framework handles toast
    } finally {
      setIsDeleting(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={open => !open && onClose()} data-api-unique-id='photosmanagementview-skeleton-with-logic-r9f23312241b0bbba-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
      <DialogContent data-api-unique-id='photosmanagementview-skeleton-with-logic-rf046d62d43f66b63-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
        <DialogHeader data-api-unique-id='photosmanagementview-skeleton-with-logic-rac27b8c70f0df147-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
          <DialogTitle data-api-unique-id='photosmanagementview-skeleton-with-logic-r3eeba09580e7fe27-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Confirm Deletion</DialogTitle>
          <DialogDescription data-api-unique-id='photosmanagementview-skeleton-with-logic-r65d5b05090373ac2-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Warning: Removing this record will change its slot status to MISSING and instantly remove the image from the frontend homepage gallery. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter data-api-unique-id='photosmanagementview-skeleton-with-logic-r9cd46ca3e4103944-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
          <Button variant="outline" onClick={onClose} disabled={isDeleting} data-api-unique-id='photosmanagementview-skeleton-with-logic-r4c10e645fe398b09-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} data-api-unique-id='photosmanagementview-skeleton-with-logic-rc03d5f0454fe59e7-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
            Confirm Deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}

// ===== Main Page Component =====

export default function PhotosManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    restaurantphotoId
  } = PhotosManagement.getParams(searchParams);

  // ===== State =====
  const [listData, setListData] = useState<GetPhotosListOutput | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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

    // Check if it's an existing ID
    const byId = listData.items.find(i => i.id === restaurantphotoId);
    if (byId) return {
      mode: 'edit' as const,
      item: byId
    };

    // Check if it's a photoKey for missing items
    const byKey = listData.items.find(i => i.photoKey === restaurantphotoId && i.recordStatus === 'MISSING');
    if (byKey) return {
      mode: 'create' as const,
      item: byKey
    };
    return null;
  }, [listData, restaurantphotoId]);

  // ===== Handlers =====
  const handleOpenEdit = (id: string) => {
    PhotosManagement.navigateToDetail(router, {
      restaurantphotoId: id
    });
  };
  const handleOpenCreate = (photoKey: string) => {
    PhotosManagement.navigateToDetail(router, {
      restaurantphotoId: photoKey
    });
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

  // ===== Render =====
  return <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r2c82f6e85fd9d429-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
      <section data-api-unique-id='photosmanagementview-skeleton-with-logic-r1cc8c3bbfc4c3a36-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
        <header data-api-unique-id='photosmanagementview-skeleton-with-logic-r3e75c1d6fe1c42fb-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
          <h2 data-api-unique-id='photosmanagementview-skeleton-with-logic-r617f735b52ed1c1a-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Photos Management</h2>
          <p data-api-unique-id='photosmanagementview-skeleton-with-logic-rd2606ed3daba9ebc-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Manage the fixed 10-slot homepage gallery constraint.</p>
        </header>

        {isLoadingList && !listData && <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r5ac1ec616f6c47b1-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Loading verification table...</div>}

        {!isLoadingList && !listData && <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r755475d62f07ca10-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Failed to load data. Please refresh.</div>}

        {listData && <>
            <article data-api-unique-id='photosmanagementview-skeleton-with-logic-r6d8637461d699e07-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r49b7d2afe0563e6c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <span data-api-unique-id='photosmanagementview-skeleton-with-logic-r2ed0de6df1bc41b6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Total Slots</span>
                <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-r56fa92c8c7e173b3-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>{listData.totalSlots}</strong>
              </div>
              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r0b49dc8f106cb374-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <span data-api-unique-id='photosmanagementview-skeleton-with-logic-rd699f104084aea48-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Present / Missing</span>
                <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-r518b5204e86e0ec7-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>{listData.presentCount} / {listData.missingCount}</strong>
              </div>
              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r8fe6378177ab5ad4-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <span data-api-unique-id='photosmanagementview-skeleton-with-logic-re22ebedd7c54d72c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Matched / Mismatched</span>
                <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-r0e78a036ddda90d6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>{listData.matchedCount} / {listData.mismatchedCount}</strong>
              </div>
              <div data-api-unique-id='photosmanagementview-skeleton-with-logic-rabfdb759f13720e6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                {listData.items.map((item, index) => <span key={item.photoKey} data-api-unique-id='photosmanagementview-skeleton-with-logic-r3bf0d6e10a08f83c-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`listData.items-${index}-photoKey`} data-api-map-var-name='item'>
                    [{item.photoKey}: {item.recordStatus === 'PRESENT' ? '✓' : '✗'}]
                  </span>)}
              </div>
            </article>

            <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r27e59b0273b13fd1-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
              <Table data-api-unique-id='photosmanagementview-skeleton-with-logic-rd7f9153908e7f984-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                <TableHeader data-api-unique-id='photosmanagementview-skeleton-with-logic-r6692c356d70d713f-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                  <TableRow data-api-unique-id='photosmanagementview-skeleton-with-logic-r4e41634a9f35f8f8-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-r063813897623273b-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Slot ID / Seq</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-ra88b313715dc4f10-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Image Preview</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-rb16214d0c50d0d57-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Asset Metadata</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-r0f8b8385309a31c9-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Source (URL)</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-r3bab46bf4f105dd5-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Record Status</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-r7f1c079cee434f7f-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Match Status</TableHead>
                    <TableHead data-api-unique-id='photosmanagementview-skeleton-with-logic-rda35d9162f06d491-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-api-unique-id='photosmanagementview-skeleton-with-logic-rebbd9b4e676d86c6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic'>
                  {listData.items.map((item, index) => <TableRow key={item.photoKey} data-api-unique-id='photosmanagementview-skeleton-with-logic-r81665bd303705cb4-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r71fa2193e190ad7d-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-r7594ce787663d877-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`listData.items-${index}-photoKey`} data-api-map-var-name='item'>{item.photoKey}</strong>
                        <br data-api-unique-id='photosmanagementview-skeleton-with-logic-r672ac80e68f7a2af-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' />
                        <small data-api-unique-id='photosmanagementview-skeleton-with-logic-r3a13f5e67a7cdef1-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`listData.items-${index}-sortOrder`} data-api-map-var-name='item'>Seq: {item.sortOrder}</small>
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r6725a2af571ab77b-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {item.recordStatus === 'PRESENT' && item.imageUrl ? <img src={item.imageUrl} alt={item.alt || 'Preview'} data-api-unique-id='photosmanagementview-skeleton-with-logic-r74e7fd5e6edc78c5-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' /> : <div data-api-unique-id='photosmanagementview-skeleton-with-logic-r2b0925b3b38c85df-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>[MISSING SLOT]</div>}
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r51a80a17aa7cb968-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`listData.items-${index}-alt`} data-api-map-var-name='item'>
                        {item.recordStatus === 'PRESENT' ? <>
                            <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-r6b355df5175bdf97-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>Alt:</strong> {item.alt}
                            <br data-api-unique-id='photosmanagementview-skeleton-with-logic-r991aaf252ed61892-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1' />
                            <strong data-api-unique-id='photosmanagementview-skeleton-with-logic-rafd9edeb061faec6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>Desc:</strong> {item.description}
                          </> : <span data-api-unique-id='photosmanagementview-skeleton-with-logic-r4c11d4c3b57eefa6-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>-</span>}
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-rfacae7f5319525b4-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {item.imageUrl ? item.imageUrl : '-'}
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r2fae7ca77d2598bf-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        <Badge variant={item.recordStatus === 'PRESENT' ? 'default' : 'secondary'} data-api-unique-id='photosmanagementview-skeleton-with-logic-r838a8a5af9a57160-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                          {RECORD_STATUS_LABELS[item.recordStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r72aa241a85f96235-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {item.matchStatus ? <Badge variant={item.matchStatus === 'MATCHED' ? 'outline' : 'destructive'} data-api-unique-id='photosmanagementview-skeleton-with-logic-r19c8cd42b435cba5-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                            {MATCH_STATUS_LABELS[item.matchStatus]}
                          </Badge> : <span data-api-unique-id='photosmanagementview-skeleton-with-logic-r5307c19d9d503fec-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>-</span>}
                      </TableCell>
                      <TableCell data-api-unique-id='photosmanagementview-skeleton-with-logic-r7cd64409710a1a54-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {item.recordStatus === 'PRESENT' && item.id ? <div data-api-unique-id='photosmanagementview-skeleton-with-logic-rb06afd52efa71d0b-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                            <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(item.id!)} data-api-unique-id='photosmanagementview-skeleton-with-logic-r7d42879a3c239c6d-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(item.id!)} data-api-unique-id='photosmanagementview-skeleton-with-logic-re3fa801999039ebf-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                              Delete
                            </Button>
                          </div> : <Button size="sm" onClick={() => handleOpenCreate(item.photoKey)} data-api-unique-id='photosmanagementview-skeleton-with-logic-r616147d232856b1b-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' data-api-in-loop='1'>
                            Create Record
                          </Button>}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </>}
      </section>

      {/* Slide-out Panel Editor */}
      <PhotoEditorSheet isOpen={!!activeItemInfo && !deleteTargetId} mode={activeItemInfo?.mode || 'create'} item={activeItemInfo?.item || null} onClose={handleClosePanel} onSuccess={handlePanelSuccess} data-api-unique-id='photosmanagementview-skeleton-with-logic-rf8f44fd64787f5b2-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />

      {/* Deletion Confirmation Modal */}
      <DeletePhotoDialog isOpen={!!deleteTargetId} targetId={deleteTargetId} onClose={handleCloseDelete} onSuccess={handleDeleteSuccess} data-api-unique-id='photosmanagementview-skeleton-with-logic-r059ba7a5114d3bd9-s1800398420' data-api-unique-page-name='src/backend/components/PhotosManagementView_skeleton_with_logic' />
    </div>;
}