'use server'

// ===== Enums =====
/** Payment Status: Pending(PENDING) | Success(SUCCESS) | Failed(FAILED) | Cancelled(CANCELLED) */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

/** Food Order Status: Pending Payment(PENDING_PAYMENT) | Paid(PAID) | Preparing(PREPARING) | Ready For Pickup(READY_FOR_PICKUP) | Completed(COMPLETED) | Cancelled(CANCELLED) */
export type FoodOrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED'

// ===== Data Structures =====
export interface OrderItemLedger {
  item_id: string
  item_name: string
  item_quantity: number
  item_line_total: number
  item_notes: string | null
}

export interface PaymentOrderDetails {
  order_id: string
  order_number: string
  order_created_at: string
  order_payment_out_trade_no: string | null
  order_pickup_contact_name: string
  order_pickup_phone: string
  order_food_status: FoodOrderStatus
  order_payment_status: PaymentStatus
  order_subtotal_amount: number
  order_total_amount: number
  order_currency: string
  order_items: OrderItemLedger[]
}

// ===== Input / Output =====
export interface GetPaymentOrderDetailsInput {
  order_id: string
  session_id?: string
}

export interface GetPaymentOrderDetailsOutput {
  order: PaymentOrderDetails
}

export interface VerifyFoodOrderPaymentInput {
  order_id: string
  session_id: string
}

export interface VerifyFoodOrderPaymentOutput {
  order: PaymentOrderDetails
  payment_status: PaymentStatus
  should_retry: boolean
}

export interface ReconcileFoodOrderPaymentInput {
  order_id: string
  session_id?: string
  status?: PaymentStatus | string
}

export interface ReconcileFoodOrderPaymentOutput {
  order: PaymentOrderDetails
  payment_status: PaymentStatus
  should_retry: boolean
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import { withResult } from '@/frontend/action_utils'
import { getPaymentProvider } from '@/thirdparty/payment/clink'

const db = prisma as any

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case 'SUCCESS':
      return 'SUCCESS'
    case 'FAILED':
      return 'FAILED'
    case 'CANCELLED':
      return 'CANCELLED'
    default:
      return 'PENDING'
  }
}

function toFoodOrderStatus(status: PaymentStatus): FoodOrderStatus {
  return status === 'SUCCESS' ? 'PAID' : status === 'CANCELLED' ? 'CANCELLED' : 'PENDING_PAYMENT'
}

function normalizeProviderPaymentStatus(status: string | null | undefined): PaymentStatus {
  const normalizedStatus = String(status || '').toLowerCase()

  if (normalizedStatus === 'paid') {
    return 'SUCCESS'
  }
  if (normalizedStatus === 'failed') {
    return 'FAILED'
  }
  if (normalizedStatus === 'canceled' || normalizedStatus === 'cancelled') {
    return 'CANCELLED'
  }

  return 'PENDING'
}

function resolveTrustedSessionId(order: any, requestedSessionId?: string): string {
  const routeSessionId = requestedSessionId?.trim()
  const storedSessionId = typeof order.paymentSessionId === 'string' ? order.paymentSessionId.trim() : ''

  if (routeSessionId && storedSessionId && routeSessionId !== storedSessionId) {
    throw new Error('Invalid payment session identified.')
  }

  if (storedSessionId) {
    return storedSessionId
  }

  if (routeSessionId) {
    throw new Error('Invalid payment session identified.')
  }

  return ''
}

async function fetchOrderWithItems(orderId: string) {
  return db.foodOrder.findUnique({
    where: { id: orderId },
    include: {
      food_order_item: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

async function persistResolvedPaymentStatus(orderId: string, paymentStatus: PaymentStatus, sessionId?: string) {
  return db.foodOrder.update({
    where: { id: orderId },
    data: {
      ...(sessionId ? { paymentSessionId: sessionId } : {}),
      paymentStatus,
      orderStatus: toFoodOrderStatus(paymentStatus),
      paidAt: paymentStatus === 'SUCCESS' ? new Date() : null,
    },
    include: {
      food_order_item: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

function mapOrderDetails(order: any): PaymentOrderDetails {
  return {
    order_id: order.id,
    order_number: order.orderNumber,
    order_created_at: order.createdAt.toISOString(),
    order_payment_out_trade_no: order.paymentOutTradeNo,
    order_pickup_contact_name: order.pickupContactName,
    order_pickup_phone: order.pickupPhone,
    order_food_status: order.orderStatus as FoodOrderStatus,
    order_payment_status: order.paymentStatus as PaymentStatus,
    order_subtotal_amount: order.subtotalAmount.toNumber(),
    order_total_amount: order.totalAmount.toNumber(),
    order_currency: order.currency,
    order_items: order.food_order_item.map((item: any) => ({
      item_id: item.id,
      item_name: item.itemName,
      item_quantity: item.quantity,
      item_line_total: item.lineTotal.toNumber(),
      item_notes: item.notes,
    })),
  }
}

// ===== Actions =====
export const getPaymentOrderDetails = withResult(
  async (input: GetPaymentOrderDetailsInput): Promise<GetPaymentOrderDetailsOutput> => {
    if (!input.order_id) {
      throw new Error('Order ID is required.')
    }

    const order = await fetchOrderWithItems(input.order_id)

    if (!order) {
      throw new Error('The requested order could not be found.')
    }

    resolveTrustedSessionId(order, input.session_id)

    return {
      order: mapOrderDetails(order),
    }
  }
)

export const verifyFoodOrderPayment = withResult(
  async (input: VerifyFoodOrderPaymentInput): Promise<VerifyFoodOrderPaymentOutput> => {
    if (!input.order_id) {
      throw new Error('Order ID is required.')
    }
    if (!input.session_id) {
      throw new Error('Payment session ID is required.')
    }

    const order = await fetchOrderWithItems(input.order_id)

    if (!order) {
      throw new Error('The requested order could not be found.')
    }

    const resolvedSessionId = resolveTrustedSessionId(order, input.session_id)

    if (!resolvedSessionId) {
      throw new Error('Payment session ID is required.')
    }

    const provider = getPaymentProvider()
    let latestInfo = null as Awaited<ReturnType<typeof provider.getPaymentSession>>

    for (let attempt = 0; attempt < 4; attempt += 1) {
      latestInfo = await provider.getPaymentSession(resolvedSessionId)
      const normalized = String(latestInfo?.status || '').toLowerCase()
      if (normalized === 'paid' || normalized === 'failed' || normalized === 'canceled' || normalized === 'cancelled') {
        break
      }
      if (attempt < 3) {
        await delay(1200)
      }
    }

    const paymentStatus = normalizeProviderPaymentStatus(latestInfo?.status)

    const updatedOrder = await persistResolvedPaymentStatus(input.order_id, paymentStatus, resolvedSessionId)

    return {
      order: mapOrderDetails(updatedOrder),
      payment_status: toPaymentStatus(updatedOrder.paymentStatus),
      should_retry: paymentStatus === 'PENDING',
    }
  }
)

export const reconcileFoodOrderPayment = withResult(
  async (input: ReconcileFoodOrderPaymentInput): Promise<ReconcileFoodOrderPaymentOutput> => {
    if (!input.order_id) {
      throw new Error('Order ID is required.')
    }

    const order = await fetchOrderWithItems(input.order_id)

    if (!order) {
      throw new Error('The requested order could not be found.')
    }

    const resolvedSessionId = resolveTrustedSessionId(order, input.session_id)

    if (resolvedSessionId) {
      return verifyFoodOrderPayment({
        order_id: input.order_id,
        session_id: resolvedSessionId,
      })
    }

    const normalizedStatus = String(input.status || '').toUpperCase()
    if (normalizedStatus === 'SUCCESS') {
      throw new Error('Unable to confirm payment success because no payment session is available.')
    }

    const paymentStatus: PaymentStatus = normalizedStatus === 'CANCELLED'
      ? 'CANCELLED'
      : normalizedStatus === 'FAILED'
        ? 'FAILED'
        : normalizedStatus === 'SUCCESS'
          ? 'SUCCESS'
          : toPaymentStatus(order.paymentStatus)

    const updatedOrder = await db.foodOrder.update({
      where: { id: input.order_id },
      data: {
        paymentStatus,
        orderStatus: toFoodOrderStatus(paymentStatus),
        paidAt: paymentStatus === 'SUCCESS' ? order.paidAt || new Date() : null,
      },
      include: {
        food_order_item: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return {
      order: mapOrderDetails(updatedOrder),
      payment_status: toPaymentStatus(updatedOrder.paymentStatus),
      should_retry: paymentStatus === 'PENDING',
    }
  }
)
