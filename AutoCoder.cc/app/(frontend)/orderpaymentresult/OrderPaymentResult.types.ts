'use server'

// ===== Enums =====
/** Payment Status: Pending(PENDING) | Success(SUCCESS) | Failed(FAILED) | Cancelled(CANCELLED) */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

/** Food Order Status: Pending Payment(PENDING_PAYMENT) | Paid(PAID) | Preparing(PREPARING) | Ready For Pickup(READY_FOR_PICKUP) | Completed(COMPLETED) | Cancelled(CANCELLED) */
export type FoodOrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED'

// ===== Data Structures =====
export interface OrderItemLedger {
  item_id: string          // data-from: food_order_item-id
  item_name: string        // data-from: food_order_item-itemName
  item_quantity: number    // data-from: food_order_item-quantity
  item_line_total: number  // data-from: food_order_item-lineTotal
  item_notes: string | null // data-from: food_order_item-notes
}

export interface PaymentOrderDetails {
  order_id: string                       // data-from: food_order-id
  order_number: string                   // data-from: food_order-orderNumber
  order_created_at: string               // data-from: food_order-createdAt
  order_payment_out_trade_no: string | null // data-from: food_order-paymentOutTradeNo
  order_pickup_contact_name: string      // data-from: food_order-pickupContactName
  order_pickup_phone: string             // data-from: food_order-pickupPhone
  order_food_status: FoodOrderStatus     // data-from: food_order-orderStatus
  order_payment_status: PaymentStatus    // data-from: food_order-paymentStatus
  order_subtotal_amount: number          // data-from: food_order-subtotalAmount
  order_total_amount: number             // data-from: food_order-totalAmount
  order_currency: string                 // data-from: food_order-currency
  order_items: OrderItemLedger[]         // aggregated
}

// ===== Input / Output =====
export interface GetPaymentOrderDetailsInput {
  order_id: string
  session_id?: string
}

export interface GetPaymentOrderDetailsOutput {
  order: PaymentOrderDetails
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import { withResult } from '@/frontend/action_utils'

// ===== Actions =====
export const getPaymentOrderDetails = withResult(
  async (input: GetPaymentOrderDetailsInput): Promise<GetPaymentOrderDetailsOutput> => {
    if (!input.order_id) {
      throw new Error('Order ID is required.')
    }

    const order = await prisma.food_order.findUnique({
      where: { id: input.order_id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!order) {
      throw new Error('The requested order could not be found.')
    }

    if (input.session_id && order.paymentSessionId && order.paymentSessionId !== input.session_id) {
      throw new Error('Invalid payment session identified.')
    }

    return {
      order: {
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
        order_items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.itemName,
          item_quantity: item.quantity,
          item_line_total: item.lineTotal.toNumber(),
          item_notes: item.notes
        }))
      }
    }
  }
)
