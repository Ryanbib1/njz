'use server'

import prisma from '@/tools/prisma'
import { withResult } from '@/frontend/action_utils'
import { getPaymentProvider } from '@/thirdparty/payment/clink'
import { OrderPaymentResult } from '@/frontend/route-params'

const db = prisma as any

// ===== Enums =====
export type OrderPaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

// ===== Data Structures =====
export interface DishItem {
  dish_id: string
  category: string
  name: string
  description: string
  price: number
  image_url: string
}

export interface CartItemPayload {
  dish_id: string
  quantity: number
}

interface MenuCatalogEntry extends DishItem {
  sortOrder: number
}

// ===== Input / Output =====
export interface GetMenuOutput {
  categories: string[]
  dishes: DishItem[]
}

export interface CreateFoodOrderInput {
  pickup_name: string
  pickup_phone: string
  customer_email: string
  items: CartItemPayload[]
}

export interface CreateFoodOrderOutput {
  order_id: string
  order_number: string
  session_id: string
  status: OrderPaymentStatus
  total_amount: number
  currency: string
  payment_url: string
}

export interface CreateFoodOrderPaymentSessionInput {
  order_id: string
}

export interface CreateFoodOrderPaymentSessionOutput {
  order_id: string
  order_number: string
  session_id: string
  status: OrderPaymentStatus
  total_amount: number
  currency: string
  payment_url: string
}

const MENU_CATALOG: MenuCatalogEntry[] = [
  {
    dish_id: 'starter-truffle-arancini',
    category: 'Starters',
    name: 'Truffle Mushroom Arancini',
    description: 'Crisp risotto croquettes with roasted mushrooms, black truffle cream, and aged parmesan.',
    price: 46,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 10,
  },
  {
    dish_id: 'starter-burrata-caprese',
    category: 'Starters',
    name: 'Burrata Caprese',
    description: 'Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic reduction.',
    price: 52,
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 20,
  },
  {
    dish_id: 'pizza-burrata-woodfired',
    category: 'Wood-Fired Pizza',
    name: 'Wood-Fired Burrata Pizza',
    description: 'San Marzano tomato, basil pesto, creamy burrata, and charred crust from the stone oven.',
    price: 72,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 30,
  },
  {
    dish_id: 'pizza-prosciutto-fig',
    category: 'Wood-Fired Pizza',
    name: 'Prosciutto & Fig Pizza',
    description: 'Prosciutto di Parma, mozzarella, roasted fig compote, arugula, and cracked black pepper.',
    price: 78,
    image_url: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 40,
  },
  {
    dish_id: 'pasta-ragu-tagliatelle',
    category: 'Pasta',
    name: 'Tagliatelle al Ragù',
    description: 'Slow-braised beef ragù tossed with fresh egg tagliatelle and pecorino.',
    price: 88,
    image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 50,
  },
  {
    dish_id: 'pasta-lobster-linguine',
    category: 'Pasta',
    name: 'Lobster Linguine',
    description: 'Linguine with lobster medallions, cherry tomato sauce, lemon zest, and parsley.',
    price: 108,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 60,
  },
  {
    dish_id: 'dessert-tiramisu',
    category: 'Desserts',
    name: 'Classic Tiramisu',
    description: 'Mascarpone cream, espresso-soaked savoiardi, cocoa, and dark chocolate shavings.',
    price: 36,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 70,
  },
  {
    dish_id: 'drink-sparkling-citrus',
    category: 'Beverages',
    name: 'Sparkling Citrus Juice',
    description: 'House sparkling juice with Sicilian citrus, tonic bubbles, and chilled rosemary.',
    price: 24,
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 80,
  },
]

function getMenuCatalog(): MenuCatalogEntry[] {
  return [...MENU_CATALOG].sort((a, b) => a.sortOrder - b.sortOrder)
}

function buildOrderNumber(): string {
  const now = new Date()
  const compactDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const compactTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `FO-${compactDate}-${compactTime}-${suffix}`
}

function normalizePhone(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function buildPaymentResultUrl(orderId: string, status: 'SUCCESS' | 'CANCELLED', sessionId?: string | null): string {
  const params = new URLSearchParams({
    orderId,
    status,
  })

  if (sessionId) {
    params.set('sessionId', sessionId)
  }

  return `${OrderPaymentResult.path}?${params.toString()}`
}

function mapPaymentStatus(status: string): OrderPaymentStatus {
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

function toPlainDishItem(entry: MenuCatalogEntry): DishItem {
  return {
    dish_id: entry.dish_id,
    category: entry.category,
    name: entry.name,
    description: entry.description,
    price: entry.price,
    image_url: entry.image_url,
  }
}

// ===== Actions =====

/**
 * Retrieves the full pickup menu and dynamically extracts available categories.
 */
export const getMenu = withResult(async (): Promise<GetMenuOutput> => {
  const dishes = getMenuCatalog()
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)))
  return {
    categories,
    dishes: dishes.map(toPlainDishItem)
  }
})

/**
 * Creates a pickup food order and initializes a payment session.
 */
export const createFoodOrder = withResult(async (input: CreateFoodOrderInput): Promise<CreateFoodOrderOutput> => {
  const pickupName = input.pickup_name.trim()
  const pickupPhone = normalizePhone(input.pickup_phone)
  const customerEmail = input.customer_email.trim().toLowerCase()

  if (!pickupName || !pickupPhone || !customerEmail) {
    throw new Error('Please provide your name, phone number, and email for pickup.')
  }
  if (!customerEmail.includes('@')) {
    throw new Error('Please provide a valid email address for pickup updates.')
  }
  if (!input.items || input.items.length === 0) {
    throw new Error('Your cart is empty.')
  }

  const menuById = new Map(getMenuCatalog().map((dish) => [dish.dish_id, dish]))
  const quantityByDishId = new Map<string, number>()

  for (const item of input.items) {
    const qty = Number(item.quantity)
    if (!item.dish_id || !Number.isInteger(qty) || qty <= 0) {
      throw new Error('One or more cart items are invalid.')
    }
    if (!menuById.has(item.dish_id)) {
      throw new Error('One or more selected menu items are no longer available.')
    }
    quantityByDishId.set(item.dish_id, (quantityByDishId.get(item.dish_id) || 0) + qty)
  }

  const orderItemsData = Array.from(quantityByDishId.entries()).map(([dishId, quantity]) => {
    const dish = menuById.get(dishId)
    if (!dish) {
      throw new Error('One or more selected menu items are invalid.')
    }
    const unitPrice = dish.price
    const lineTotal = Number((unitPrice * quantity).toFixed(2))

    return {
      itemName: dish.name,
      unitPrice,
      quantity,
      lineTotal,
      notes: null as string | null,
    }
  })

  const subtotalAmount = Number(
    orderItemsData.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
  )
  const totalAmount = subtotalAmount
  const orderNumber = buildOrderNumber()

  const order = await db.foodOrder.create({
    data: {
      orderNumber,
      fulfillmentMethod: 'PICKUP',
      pickupContactName: pickupName,
      pickupPhone,
      customerEmail,
      subtotalAmount,
      totalAmount,
      currency: 'CNY',
      paymentProvider: 'CLINK',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING_PAYMENT',
      food_order_item: {
        create: orderItemsData,
      },
    },
  })

  const provider = getPaymentProvider()
  const paymentSession = await provider.createPaymentSession({
    amount: totalAmount,
    userId: order.id,
    customerEmail,
    productName: `Pickup Order ${order.orderNumber}`,
    currency: order.currency.toLowerCase(),
    orderId: order.id,
    successUrl: buildPaymentResultUrl(order.id, 'SUCCESS'),
    cancelUrl: buildPaymentResultUrl(order.id, 'CANCELLED'),
  })

  if (!paymentSession.url) {
    throw new Error('Clink payment session did not return a checkout URL.')
  }

  await db.foodOrder.update({
    where: { id: order.id },
    data: {
      paymentSessionId: paymentSession.sessionId,
      paymentOutTradeNo: paymentSession.outTradeNo,
    },
  })

  return {
    order_id: order.id,
    order_number: order.orderNumber,
    session_id: paymentSession.sessionId || '',
    status: 'PENDING',
    total_amount: totalAmount,
    currency: order.currency,
    payment_url: paymentSession.url,
  }
})

export const createFoodOrderPaymentSession = withResult(async (input: CreateFoodOrderPaymentSessionInput): Promise<CreateFoodOrderPaymentSessionOutput> => {
  if (!input.order_id) {
    throw new Error('Order ID is required.')
  }

  const order = await db.foodOrder.findUnique({
    where: { id: input.order_id },
  })

  if (!order) {
    throw new Error('The requested order could not be found.')
  }

  if (order.paymentStatus === 'SUCCESS') {
    throw new Error('This order has already been paid.')
  }

  const provider = getPaymentProvider()
  const paymentSession = await provider.createPaymentSession({
    amount: Number(order.totalAmount),
    userId: order.id,
    customerEmail: order.customerEmail,
    productName: `Pickup Order ${order.orderNumber}`,
    currency: order.currency.toLowerCase(),
    orderId: order.id,
    successUrl: buildPaymentResultUrl(order.id, 'SUCCESS'),
    cancelUrl: buildPaymentResultUrl(order.id, 'CANCELLED'),
  })

  if (!paymentSession.url) {
    throw new Error('Clink payment session did not return a checkout URL.')
  }

  const updatedOrder = await db.foodOrder.update({
    where: { id: order.id },
    data: {
      paymentSessionId: paymentSession.sessionId,
      paymentOutTradeNo: paymentSession.outTradeNo,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING_PAYMENT',
      paidAt: null,
    },
  })

  return {
    order_id: updatedOrder.id,
    order_number: updatedOrder.orderNumber,
    session_id: paymentSession.sessionId || '',
    status: mapPaymentStatus(updatedOrder.paymentStatus),
    total_amount: Number(updatedOrder.totalAmount),
    currency: updatedOrder.currency,
    payment_url: paymentSession.url,
  }
})