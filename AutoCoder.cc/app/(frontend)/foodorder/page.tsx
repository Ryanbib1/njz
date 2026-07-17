// {"router": "/foodorder", "id": "f02", "en_name": "FoodOrder"}
'use client'
import { useFoodOrder } from '@/frontend/hooks/useFoodOrder';
import { FoodOrderView } from '@/frontend/components/FoodOrderView';

export default function FoodOrderPage() {
    const { state, handlers } = useFoodOrder();
    return <FoodOrderView state={state} handlers={handlers} />;
}
