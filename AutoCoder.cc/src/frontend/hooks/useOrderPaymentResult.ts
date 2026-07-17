'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FoodOrder, OrderPaymentResult } from '@/frontend/route-params';
import type {
  PaymentStatus,
  FoodOrderStatus,
  PaymentOrderDetails,
} from '@/frontend/actions/OrderPaymentResult';
import { getPaymentOrderDetails, reconcileFoodOrderPayment } from '@/frontend/actions/OrderPaymentResult';
import { createFoodOrderPaymentSession } from '@/frontend/actions/FoodOrder';
import { closeExternalLinkPopup, isExternalLinkPopup, onExternalLinkMessage, openExternalLinkAsync } from '@/lib/utils';
import { toast } from 'sonner';

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending Processing',
  SUCCESS: 'Transaction Successful',
  FAILED: 'Transaction Declined',
  CANCELLED: 'Transaction Cancelled',
};

const FOOD_ORDER_STATUS_LABELS: Record<FoodOrderStatus, string> = {
  PENDING_PAYMENT: 'Awaiting Settlement',
  PAID: 'Confirmed & Paid',
  PREPARING: 'Currently Preparing',
  READY_FOR_PICKUP: 'Ready for Collection',
  COMPLETED: 'Order Fulfilled',
  CANCELLED: 'Order Cancelled',
};

export interface OrderPaymentResultState {
  isLoading: boolean;
  orderData: PaymentOrderDetails | null;
  errorState: boolean;
  formattedDate: string;
  isSuccess: boolean;
  paymentStatusLabel: string;
  paymentOpening: boolean;
  foodOrderStatusLabels: Record<FoodOrderStatus, string>;
}

export interface OrderPaymentResultHandlers {
  handleRetryPayment: () => void;
  handleReturnToMenu: () => void;
}

export function useOrderPaymentResult(): {
  state: OrderPaymentResultState;
  handlers: OrderPaymentResultHandlers;
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orderId, sessionId, status: routeStatus } = OrderPaymentResult.getParams(searchParams);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<PaymentOrderDetails | null>(null);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [paymentOpening, setPaymentOpening] = useState<boolean>(false);
  const normalizedRouteStatus = routeStatus.toUpperCase();

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
        session_id: sessionId || undefined,
      });
      setOrderData(data.order);
      setErrorState(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to retrieve order details.');
      setErrorState(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, sessionId]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  useEffect(() => {
    if (!orderId || (normalizedRouteStatus !== 'SUCCESS' && normalizedRouteStatus !== 'CANCELLED')) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('status');
    window.history.replaceState({}, '', currentUrl.toString());

    let cancelled = false;

    reconcileFoodOrderPayment({
      order_id: orderId,
      session_id: sessionId || undefined,
      status: normalizedRouteStatus,
    }).then((result) => {
      if (cancelled) {
        return;
      }

      setOrderData(result.order);
      setErrorState(false);

      if (result.payment_status === 'SUCCESS') {
        if (isExternalLinkPopup()) {
          closeExternalLinkPopup({
            type: 'payment-success',
            orderId,
            sessionId,
            status: 'SUCCESS',
          });
          return;
        }
        toast.success('Payment completed successfully.');
        return;
      }

      if (result.payment_status === 'CANCELLED') {
        if (isExternalLinkPopup()) {
          closeExternalLinkPopup({
            type: 'payment-cancel',
            orderId,
            sessionId,
            status: 'CANCELLED',
          });
          return;
        }
        toast.info('Payment was cancelled.');
        return;
      }

      if (result.payment_status === 'FAILED') {
        if (isExternalLinkPopup()) {
          closeExternalLinkPopup({
            type: 'payment-failed',
            orderId,
            sessionId,
            status: 'FAILED',
          });
          return;
        }
        toast.error('Payment failed. Please try again.');
        return;
      }

      toast.info('Payment result is still syncing. Please refresh this order status shortly.');
    }).catch((error) => {
      if (cancelled) {
        return;
      }

      setPaymentOpening(false);
      setErrorState(true);

      if (isExternalLinkPopup()) {
        closeExternalLinkPopup({
          type: 'payment-failed',
          orderId,
          sessionId,
          status: 'FAILED',
        });
        return;
      }

      toast.error(error instanceof Error ? error.message : 'Payment verification failed.');
    });

    return () => {
      cancelled = true;
    };
  }, [normalizedRouteStatus, orderId, sessionId]);

  useEffect(() => {
    return onExternalLinkMessage((data) => {
      if (data.type === 'payment-success') {
        setPaymentOpening(false);
        loadOrderDetails();
        toast.success('Payment completed successfully.');
      } else if (data.type === 'payment-cancel') {
        setPaymentOpening(false);
        loadOrderDetails();
        toast.info('Payment was cancelled.');
      } else if (data.type === 'payment-failed') {
        setPaymentOpening(false);
        loadOrderDetails();
        toast.error('Payment failed. Please try again.');
      }
    });
  }, [loadOrderDetails]);

  const formattedDate = useMemo(() => {
    if (!orderData?.order_created_at) return '';
    try {
      const date = new Date(orderData.order_created_at);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch {
      return orderData.order_created_at;
    }
  }, [orderData?.order_created_at]);

  const isSuccess = useMemo(() => {
    if (orderData?.order_payment_status) {
      return orderData.order_payment_status === 'SUCCESS';
    }
    return routeStatus === 'SUCCESS';
  }, [orderData?.order_payment_status, routeStatus]);

  const paymentStatusLabel = useMemo(() => {
    if (orderData?.order_payment_status) {
      return PAYMENT_STATUS_LABELS[orderData.order_payment_status];
    }
    const fallback = routeStatus.toUpperCase() as PaymentStatus;
    return PAYMENT_STATUS_LABELS[fallback] || 'Pending Processing';
  }, [orderData?.order_payment_status, routeStatus]);

  const handleRetryPayment = useCallback(() => {
    if (!orderId) {
      toast.error('Order ID is missing.');
      return;
    }

    setPaymentOpening(true);
    openExternalLinkAsync(async () => {
      const result = await createFoodOrderPaymentSession({ order_id: orderId });
      OrderPaymentResult.navigateToWithParams(router, {
        orderId: result.order_id,
        sessionId: result.session_id,
        status: result.status,
      });
      return result.payment_url;
    }, {
      onNavigate: () => {
        setPaymentOpening(false);
        toast.info('Redirecting to payment gateway...');
      },
      onError: (error) => {
        setPaymentOpening(false);
        toast.error(error instanceof Error ? error.message : 'Unable to reopen the payment gateway.');
      },
    });
  }, [orderId, router]);

  const handleReturnToMenu = useCallback(() => {
    FoodOrder.navigateTo(router);
  }, [router]);

  return {
    state: {
      isLoading,
      orderData,
      errorState,
      formattedDate,
      isSuccess,
      paymentStatusLabel,
      paymentOpening,
      foodOrderStatusLabels: FOOD_ORDER_STATUS_LABELS,
    },
    handlers: {
      handleRetryPayment,
      handleReturnToMenu,
    },
  };
}
