// {"router": "/ordersmanagement", "id": "b07", "en_name": "OrdersManagement"}
'use client'
import { useOrdersManagement } from '@/backend/hooks/useOrdersManagement';
import { OrdersManagementView } from '@/backend/components/OrdersManagementView';

export default function OrdersManagementPage() {
    const { state, handlers } = useOrdersManagement();
    return <OrdersManagementView state={state} handlers={handlers} />;
}
