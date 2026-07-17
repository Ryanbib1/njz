// {"router": "/admindashboard", "id": "b03", "en_name": "AdminDashboard"}
'use client';

import { useAdminDashboard } from '@/backend/hooks/useAdminDashboard';
import AdminDashboardView from '@/backend/components/AdminDashboardView';
export default function AdminDashboardPage() {
  const {
    state,
    handlers
  } = useAdminDashboard();
  return <AdminDashboardView state={state} handlers={handlers} />;
}
