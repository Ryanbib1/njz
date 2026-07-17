// {"router": "/orderpaymentresult?orderId=xxx&status=xxx&sessionId=xxx", "id": "f03", "en_name": "OrderPaymentResult"}
'use client'
import { useOrderPaymentResult } from '@/frontend/hooks/useOrderPaymentResult';
import { OrderPaymentResultView } from '@/frontend/components/OrderPaymentResultView';

export default function OrderPaymentResultPage() {
    const { state, handlers } = useOrderPaymentResult();
    return <OrderPaymentResultView state={state} handlers={handlers} />;
}
