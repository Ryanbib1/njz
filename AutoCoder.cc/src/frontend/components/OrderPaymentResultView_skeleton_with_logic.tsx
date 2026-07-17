'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderPaymentResult } from '@/frontend/route-params';
import type { PaymentStatus, FoodOrderStatus, PaymentOrderDetails } from '@/frontend/actions/OrderPaymentResult';
import { getPaymentOrderDetails } from '@/frontend/actions/OrderPaymentResult';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ===== 枚举映射 =====
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending Processing',
  SUCCESS: 'Transaction Successful',
  FAILED: 'Transaction Declined',
  CANCELLED: 'Transaction Cancelled'
};
const FOOD_ORDER_STATUS_LABELS: Record<FoodOrderStatus, string> = {
  PENDING_PAYMENT: 'Awaiting Settlement',
  PAID: 'Confirmed & Paid',
  PREPARING: 'Currently Preparing',
  READY_FOR_PICKUP: 'Ready for Collection',
  COMPLETED: 'Order Fulfilled',
  CANCELLED: 'Order Cancelled'
};
export default function OrderPaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    orderId,
    sessionId,
    status: routeStatus
  } = OrderPaymentResult.getParams(searchParams);

  // ===== State =====
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<PaymentOrderDetails | null>(null);
  const [errorState, setErrorState] = useState<boolean>(false);

  // ===== Effects =====
  const loadOrderDetails = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      setErrorState(true);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getPaymentOrderDetails({
        order_id: orderId,
        session_id: sessionId || undefined
      });
      setOrderData(data.order);
      setErrorState(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to retrieve order details.");
      setErrorState(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, sessionId]);
  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  // ===== Memos =====
  const formattedDate = useMemo(() => {
    if (!orderData?.order_created_at) return '';
    try {
      const date = new Date(orderData.order_created_at);
      // Ensure stable string serialization without timezone shifts if possible, 
      // utilizing UTC methods or standard locale formats.
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch {
      return orderData.order_created_at;
    }
  }, [orderData?.order_created_at]);
  const isSuccess = useMemo(() => {
    // Prefer database truth, fallback to route param if DB still pending
    if (orderData?.order_payment_status) {
      return orderData.order_payment_status === 'SUCCESS';
    }
    return routeStatus === 'SUCCESS';
  }, [orderData?.order_payment_status, routeStatus]);

  // ===== Handlers =====
  const handleRetryPayment = useCallback(() => {
    toast("Redirecting to payment gateway...");
  }, []);
  const handleReturnToMenu = useCallback(() => {
    toast("Returning to main menu...");
  }, []);

  // ===== Render =====
  if (isLoading) {
    return <main data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r735c5573a5217381-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
        <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rd363f126e8fa8da4-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>Loading transaction details...</div>
      </main>;
  }
  if (errorState || !orderData) {
    return <main data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rb83a8018c48de3c5-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
        <header data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r1b77cca6ab92f83b-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
          <h1 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r3813982e77e1c177-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>TRANSACTION RECORD UNAVAILABLE</h1>
          <p data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r2826fc3f13e9e762-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>We could not locate the details for this transaction.</p>
        </header>
      </main>;
  }
  return <main data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r2a0236cfc827e939-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
      {/* Section 1: The Result Hero */}
      <header data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r7c93ade9a49076b2-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
        <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rbcd43640e134d15e-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
          {/* Status Indicator logic inherently structural here, downstream UI assigns colors */}
          <div aria-hidden="true" data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r3620470cd7bfdfee-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' /> 
        </div>
        
        {isSuccess ? <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rd3b8856110d161ac-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <h1 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r058620d781a9086a-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>GRAZIE.</h1>
            <p data-api-unique-id='orderpaymentresultview-skeleton-with-logic-ree4f590873aeeecf-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>Your culinary experience is confirmed and currently being prepared.</p>
          </div> : <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r9292b4fd4fc9a0ad-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <h1 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rdb34f8b89a3e9d8c-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>TRANSACTION DECLINED.</h1>
            <p data-api-unique-id='orderpaymentresultview-skeleton-with-logic-raf0fde8ad604a02e-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>We were unable to process your payment. Please review your details and attempt the transaction again.</p>
          </div>}
        <Separator data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r737a67440b015e33-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' />
      </header>

      {/* Section 2: The Order Dossier */}
      <section data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rde307431ae245972-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
        {/* Left Column: The Ledger */}
        <article data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r9787c10586cd2a1f-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
          <h2 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r5616373d17f168f5-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>PURCHASE LEDGER</h2>
          <Table data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rf8c1f524f4ee1190-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <TableHeader data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r9651ba3b97a86ca5-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <TableRow data-api-unique-id='orderpaymentresultview-skeleton-with-logic-re0e23d6abaa587b2-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                <TableHead data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r71dc662806e6af4a-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>QTY</TableHead>
                <TableHead data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rf0bd38c49e3cba08-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>ITEM</TableHead>
                <TableHead data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r869d566cc91e41a6-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>TOTAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r3106e33616374b83-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              {orderData.order_items.map((item, index) => <TableRow key={item.item_id} data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r8c0ef1ba90a554d3-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1'>
                  <TableCell data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r3a61d26457c54178-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderData.order_items-${index}-item_quantity`} data-api-map-var-name='item'>{item.item_quantity}</TableCell>
                  <TableCell data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r7eb804b3d69783c9-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1'>
                    <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r3d657f54ec75dab6-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderData.order_items-${index}-item_name`} data-api-map-var-name='item'>{item.item_name}</div>
                    {item.item_notes && <p data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r901a0b7e8f400ae3-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderData.order_items-${index}-item_notes`} data-api-map-var-name='item'>{item.item_notes}</p>}
                  </TableCell>
                  <TableCell data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r76b64f9b0052a3f2-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' data-api-in-loop='1'>
                    {orderData.order_currency} {item.item_line_total.toFixed(2)}
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </article>

        {/* Right Column: The Manifesto */}
        <aside data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r02e9562a41c4b17c-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
          <h2 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r026b5489962d6dc7-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>ORDER DETAILS</h2>
          <dl data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r19794cffa7591120-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r0d0f8eb82c1b4c39-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-re4088c059132ff8a-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>ORDER NO.</dt>
              <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rb43536092183f5cf-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_number}</dd>
            </div>
            <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-ra5773df50e94f412-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rb0593501347f4729-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>DATE</dt>
              <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rc92a745481666fbb-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{formattedDate}</dd>
            </div>
            <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r38fa79fc6dd26069-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r17344ff4967bbc61-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>PAYMENT REF</dt>
              <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r6117a535dd9ad0d1-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_payment_out_trade_no || 'N/A'}</dd>
            </div>
          </dl>

          <Separator data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rf72dd10f5e886ea4-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' />

          {isSuccess ? <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r2026160024ccdb44-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <h3 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r14bbc4a97aa64332-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>PICKUP DIRECTIVE</h3>
              <dl data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r609040c636ad2124-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r1e07c1bcfd118071-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                  <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r8ec5ce1c2c2edee7-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>CONTACT</dt>
                  <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rd6932f906dd6411e-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_pickup_contact_name}</dd>
                </div>
                <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r5b78f65981928dc4-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                  <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-ra2a710ea96d15fab-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>TELEPHONE</dt>
                  <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rcac1e44f46d0833a-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_pickup_phone}</dd>
                </div>
                <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r8af55a17e54e4031-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                  <dt data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r92d16c8ba05d0423-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>STATUS</dt>
                  <dd data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r946020162f52e6c0-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{FOOD_ORDER_STATUS_LABELS[orderData.order_food_status]}</dd>
                </div>
              </dl>
              <p data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rc81b1179c54d6956-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>Please present this order number to the maître d&apos; upon arrival.</p>
            </div> : <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r8e87427de9f9ff1c-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
              <h3 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r4f6dc0a02934e3af-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>RESOLUTION</h3>
              <Button variant="default" onClick={handleRetryPayment} data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r8528ff89eeb986f4-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                RETRY PAYMENT
              </Button>
              <Button variant="outline" onClick={handleReturnToMenu} data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r408a7205beaa180d-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
                RETURN TO MENU
              </Button>
            </div>}
        </aside>

        {/* Section 3: The Financial Summary */}
        <footer data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r95f10c9e62d8cced-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
          <Separator data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r2abaea45ac6d5e04-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic' />
          <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r49068595b80414af-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <span data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r968f73f12e06e5b8-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>SUBTOTAL</span>
            <span data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rd0de4347723152b5-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_currency} {orderData.order_subtotal_amount.toFixed(2)}</span>
          </div>
          <div data-api-unique-id='orderpaymentresultview-skeleton-with-logic-rac45e2f6fd2a69e4-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>
            <h2 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r6423022fde8aa5f7-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>TOTAL SETTLEMENT</h2>
            <h2 data-api-unique-id='orderpaymentresultview-skeleton-with-logic-r7092c7b3bddb7d7f-s4096068270' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView_skeleton_with_logic'>{orderData.order_currency} {orderData.order_total_amount.toFixed(2)}</h2>
          </div>
        </footer>
      </section>
    </main>;
}