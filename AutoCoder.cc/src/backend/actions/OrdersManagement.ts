'use server'

// ===== Enums =====
/** 支付提供商：CLINK(CLINK) */
export type PaymentProvider = 'CLINK'

/** 支付状态：待支付(PENDING) | 支付成功(SUCCESS) | 支付失败(FAILED) | 已取消(CANCELLED) */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

/** 订单状态：待支付(PENDING_PAYMENT) | 已支付/待准备(PAID) | 准备中(PREPARING) | 待取餐(READY_FOR_PICKUP) | 已完成(COMPLETED) | 已取消(CANCELLED) */
export type FoodOrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED'

// ===== Data Structures =====
export interface FoodOrderItemData {
  item_id: string              // data-from: foodOrder_item-id
  item_name: string            // data-from: foodOrder_item-itemName
  unit_price: number           // data-from: foodOrder_item-unitPrice
  quantity: number             // data-from: foodOrder_item-quantity
  line_total: number           // data-from: foodOrder_item-lineTotal
  item_notes: string | null    // data-from: foodOrder_item-notes
}

export interface FoodOrderListItem {
  foodOrder_id: string                       // data-from: foodOrder-id
  foodOrder_number: string                   // data-from: foodOrder-orderNumber
  foodOrder_created_at: string               // data-from: foodOrder-createdAt
  pickup_contact_name: string                 // data-from: foodOrder-pickupContactName
  customer_email: string                      // data-from: foodOrder-customerEmail
  pickup_phone: string                        // data-from: foodOrder-pickupPhone
  total_amount: number                        // data-from: foodOrder-totalAmount
  payment_status: PaymentStatus               // data-from: foodOrder-paymentStatus
  foodOrder_status: FoodOrderStatus          // data-from: foodOrder-orderStatus
}

export interface FoodOrderDetail {
  foodOrder_id: string                       // data-from: foodOrder-id
  foodOrder_number: string                   // data-from: foodOrder-orderNumber
  foodOrder_created_at: string               // data-from: foodOrder-createdAt
  foodOrder_status: FoodOrderStatus          // data-from: foodOrder-orderStatus
  pickup_contact_name: string                 // data-from: foodOrder-pickupContactName
  pickup_phone: string                        // data-from: foodOrder-pickupPhone
  customer_email: string                      // data-from: foodOrder-customerEmail
  fulfillment_method: string                  // data-from: foodOrder-fulfillmentMethod
  subtotal_amount: number                     // data-from: foodOrder-subtotalAmount
  total_amount: number                        // data-from: foodOrder-totalAmount
  payment_status: PaymentStatus               // data-from: foodOrder-paymentStatus
  paid_at: string | null                      // data-from: foodOrder-paidAt
  payment_provider: PaymentProvider           // data-from: foodOrder-paymentProvider
  payment_out_trade_no: string | null         // data-from: foodOrder-paymentOutTradeNo
  payment_session_id: string | null           // data-from: foodOrder-paymentSessionId
  foodOrder_items: FoodOrderItemData[]       // data-from: foodOrder_item-*
}

// ===== Input / Output =====
export interface GetFoodOrdersListInput {
  search_keyword?: string
  foodOrder_statuses?: FoodOrderStatus[]
  payment_statuses?: PaymentStatus[]
  created_at_start?: string
  created_at_end?: string
  page?: number
  page_size?: number
}

export interface GetFoodOrdersListOutput {
  foodOrder_list: FoodOrderListItem[]
  total_count: number
  metrics_pending_preparation: number // aggregated
  metrics_ready_for_pickup: number    // aggregated
  metrics_pending_payment: number     // aggregated
  metrics_completed_today: number     // aggregated
}

export interface GetFoodOrderDetailInput {
  foodOrder_id: string
}

export interface UpdateFoodOrderStatusInput {
  foodOrder_id: string
  target_order_status: FoodOrderStatus
}

export interface UpdateFoodOrderStatusOutput {
  success: boolean
}

const ALLOWED_STATUS_TRANSITIONS: Record<FoodOrderStatus, FoodOrderStatus[]> = {
  PENDING_PAYMENT: ['CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP'],
  READY_FOR_PICKUP: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
}

export interface ExportFoodOrdersListInput {
  search_keyword?: string
  foodOrder_statuses?: FoodOrderStatus[]
  payment_statuses?: PaymentStatus[]
  created_at_start?: string
  created_at_end?: string
}

export interface ExportFoodOrdersListOutput {
  foodOrder_list: FoodOrderListItem[]
}

// ===== Imports =====
import prismaClient from '@/tools/prisma'
import {
  requireRole,
  withResult,
  UserRole
} from '@/backend/action_utils'

const prisma = prismaClient as any

// ===== Actions =====

export const getFoodOrdersList = requireRole([UserRole.ADMIN])(
  withResult(async (input: GetFoodOrdersListInput): Promise<GetFoodOrdersListOutput> => {
    const page = input.page ?? 1
    const pageSize = input.page_size ?? 20
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (input.search_keyword) {
      where.OR = [
        { orderNumber: { contains: input.search_keyword } },
        { pickupContactName: { contains: input.search_keyword } },
        { pickupPhone: { contains: input.search_keyword } }
      ]
    }
    if (input.foodOrder_statuses && input.foodOrder_statuses.length > 0) {
      where.orderStatus = { in: input.foodOrder_statuses }
    }
    if (input.payment_statuses && input.payment_statuses.length > 0) {
      where.paymentStatus = { in: input.payment_statuses }
    }
    if (input.created_at_start || input.created_at_end) {
      where.createdAt = {}
      if (input.created_at_start) {
        where.createdAt.gte = new Date(input.created_at_start)
      }
      if (input.created_at_end) {
        where.createdAt.lte = new Date(input.created_at_end)
      }
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [
      list,
      totalCount,
      pendingPreparationCount,
      readyForPickupCount,
      pendingPaymentCount,
      completedTodayCount
    ] = await Promise.all([
      prisma.foodOrder.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          pickupContactName: true,
          customerEmail: true,
          pickupPhone: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.foodOrder.count({ where }),
      prisma.foodOrder.count({ where: { orderStatus: 'PAID' } }),
      prisma.foodOrder.count({ where: { orderStatus: 'READY_FOR_PICKUP' } }),
      prisma.foodOrder.count({ where: { orderStatus: 'PENDING_PAYMENT' } }),
      prisma.foodOrder.count({
        where: {
          orderStatus: 'COMPLETED',
          createdAt: { gte: todayStart }
        }
      })
    ])

    return {
      foodOrder_list: list.map((item: any) => ({
        foodOrder_id: item.id,
        foodOrder_number: item.orderNumber,
        foodOrder_created_at: item.createdAt.toISOString(),
        pickup_contact_name: item.pickupContactName,
        customer_email: item.customerEmail,
        pickup_phone: item.pickupPhone,
        total_amount: item.totalAmount.toNumber(),
        payment_status: item.paymentStatus as PaymentStatus,
        foodOrder_status: item.orderStatus as FoodOrderStatus
      })),
      total_count: totalCount,
      metrics_pending_preparation: pendingPreparationCount,
      metrics_ready_for_pickup: readyForPickupCount,
      metrics_pending_payment: pendingPaymentCount,
      metrics_completed_today: completedTodayCount
    }
  })
)

export const getFoodOrderDetail = requireRole([UserRole.ADMIN])(
  withResult(async (input: GetFoodOrderDetailInput): Promise<FoodOrderDetail> => {
    const order = await prisma.foodOrder.findUnique({
      where: { id: input.foodOrder_id },
      include: { food_order_item: true }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    return {
      foodOrder_id: order.id,
      foodOrder_number: order.orderNumber,
      foodOrder_created_at: order.createdAt.toISOString(),
      foodOrder_status: order.orderStatus as FoodOrderStatus,
      pickup_contact_name: order.pickupContactName,
      pickup_phone: order.pickupPhone,
      customer_email: order.customerEmail,
      fulfillment_method: order.fulfillmentMethod,
      subtotal_amount: order.subtotalAmount.toNumber(),
      total_amount: order.totalAmount.toNumber(),
      payment_status: order.paymentStatus as PaymentStatus,
      paid_at: order.paidAt?.toISOString() || null,
      payment_provider: order.paymentProvider as PaymentProvider,
      payment_out_trade_no: order.paymentOutTradeNo,
      payment_session_id: order.paymentSessionId,
      foodOrder_items: order.food_order_item.map((item: any) => ({
        item_id: item.id,
        item_name: item.itemName,
        unit_price: item.unitPrice.toNumber(),
        quantity: item.quantity,
        line_total: item.lineTotal.toNumber(),
        item_notes: item.notes
      }))
    }
  })
)

export const updateFoodOrderStatus = requireRole([UserRole.ADMIN])(
  withResult(async (input: UpdateFoodOrderStatusInput): Promise<UpdateFoodOrderStatusOutput> => {
    const order = await prisma.foodOrder.findUnique({
      where: { id: input.foodOrder_id }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const currentStatus = order.orderStatus as FoodOrderStatus
    const targetStatus = input.target_order_status

    if (order.fulfillmentMethod !== 'PICKUP') {
      throw new Error('Only pickup food orders can be managed on this page')
    }

    if (!ALLOWED_STATUS_TRANSITIONS[currentStatus]?.includes(targetStatus)) {
      throw new Error(`Invalid order status transition: ${currentStatus} → ${targetStatus}`)
    }

    const nextPaymentStatus: PaymentStatus = targetStatus === 'CANCELLED'
      ? currentStatus === 'PENDING_PAYMENT'
        ? 'CANCELLED'
        : (order.paymentStatus as PaymentStatus)
      : (order.paymentStatus as PaymentStatus)

    const nextPaidAt = targetStatus === 'CANCELLED' && currentStatus === 'PENDING_PAYMENT'
      ? null
      : order.paidAt

    await prisma.foodOrder.update({
      where: { id: input.foodOrder_id },
      data: {
        orderStatus: targetStatus,
        paymentStatus: nextPaymentStatus,
        paidAt: nextPaidAt,
        updatedAt: new Date()
      }
    })

    return { success: true }
  })
)

export const exportFoodOrdersList = requireRole([UserRole.ADMIN])(
  withResult(async (input: ExportFoodOrdersListInput): Promise<ExportFoodOrdersListOutput> => {
    const where: any = {}
    if (input.search_keyword) {
      where.OR = [
        { orderNumber: { contains: input.search_keyword } },
        { pickupContactName: { contains: input.search_keyword } },
        { pickupPhone: { contains: input.search_keyword } }
      ]
    }
    if (input.foodOrder_statuses && input.foodOrder_statuses.length > 0) {
      where.orderStatus = { in: input.foodOrder_statuses }
    }
    if (input.payment_statuses && input.payment_statuses.length > 0) {
      where.paymentStatus = { in: input.payment_statuses }
    }
    if (input.created_at_start || input.created_at_end) {
      where.createdAt = {}
      if (input.created_at_start) {
        where.createdAt.gte = new Date(input.created_at_start)
      }
      if (input.created_at_end) {
        where.createdAt.lte = new Date(input.created_at_end)
      }
    }

    const list = await prisma.foodOrder.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        pickupContactName: true,
        customerEmail: true,
        pickupPhone: true,
        totalAmount: true,
        paymentStatus: true,
        orderStatus: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      foodOrder_list: list.map((item: any) => ({
        foodOrder_id: item.id,
        foodOrder_number: item.orderNumber,
        foodOrder_created_at: item.createdAt.toISOString(),
        pickup_contact_name: item.pickupContactName,
        customer_email: item.customerEmail,
        pickup_phone: item.pickupPhone,
        total_amount: item.totalAmount.toNumber(),
        payment_status: item.paymentStatus as PaymentStatus,
        foodOrder_status: item.orderStatus as FoodOrderStatus
      }))
    }
  })
)