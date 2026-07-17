'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderPaymentResult } from '@/frontend/route-params';
import type { 
  PaymentStatus, 
  FoodOrderStatus, 
  PaymentOrderDetails 
} from '@/frontend/actions/OrderPaymentResult';
import { getPaymentOrderDetails } from '@/frontend/actions/OrderPaymentResult';
import { toast } from "sonner";

// ===== 枚举映射 =====
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
  /** 是否正在加载订单详情 */
  isLoading: boolean;
  /** 订单详细数据 */
  orderData: PaymentOrderDetails | null;
  /** 是否处于错误状态 */
  errorState: boolean;
  /** 格式化后的订单创建时间 */
  formattedDate: string;
  /** 支付是否成功 */
  isSuccess: boolean;
  /** 食物订单状态标签映射 */
  foodOrderStatusLabels: Record<FoodOrderStatus, string>;
}

export interface OrderPaymentResultHandlers {
  /** 重新尝试支付 */
  handleRetryPayment: () => void;
  /** 返回菜单页面 */
  handleReturnToMenu: () => void;
}

export function useOrderPaymentResult(): {
  state: OrderPaymentResultState;
  handlers: OrderPaymentResultHandlers;
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orderId, sessionId, status: routeStatus } = OrderPaymentResult.getParams(searchParams);

  // ===== State =====
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<PaymentOrderDetails | null>(null);
  const [errorState, setErrorState] = useState<boolean>(false);

  // ===== Actions =====
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

  // ===== Computed =====
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

  // ===== Handlers =====
  const handleRetryPayment = useCallback(() => {
    toast("Redirecting to payment gateway...");
  }, []);

  const handleReturnToMenu = useCallback(() => {
    toast("Returning to main menu...");
  }, []);

  return {
    state: {
      isLoading,
      orderData,
      errorState,
      formattedDate,
      isSuccess,
      foodOrderStatusLabels: FOOD_ORDER_STATUS_LABELS,
    },
    handlers: {
      handleRetryPayment,
      handleReturnToMenu,
    },
  };
}
