// {"router": "/photosmanagement", "id": "b04", "en_name": "PhotosManagement"}
'use client';

import { usePhotosManagement } from '@/backend/hooks/usePhotosManagement';
import { PhotosManagementView } from '@/backend/components/PhotosManagementView';
export default function PhotosManagementPage() {
  const {
    state,
    handlers
  } = usePhotosManagement();
  return <PhotosManagementView state={state} handlers={handlers} />;
}
