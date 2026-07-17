// {"router": "/businessinfomanagement", "id": "b06", "en_name": "BusinessInfoManagement"}
'use client';

import { useBusinessInfoManagement } from '@/backend/hooks/useBusinessInfoManagement';
import { BusinessInfoManagementView } from '@/backend/components/BusinessInfoManagementView';
export default function BusinessInfoManagementPage() {
  const {
    state,
    handlers
  } = useBusinessInfoManagement();
  return <BusinessInfoManagementView state={state} handlers={handlers} />;
}
