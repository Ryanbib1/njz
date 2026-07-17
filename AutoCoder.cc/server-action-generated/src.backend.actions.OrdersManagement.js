"use server";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// common-redirect:@/tools/prisma
var require_prisma = __commonJS({
  "common-redirect:@/tools/prisma"(exports2, module2) {
    module2.exports = require("./_common").prisma;
  }
});

// common-redirect:@/backend/action_utils
var require_action_utils = __commonJS({
  "common-redirect:@/backend/action_utils"(exports2, module2) {
    module2.exports = require("./_common").backendAuth;
  }
});

// src/backend/actions/OrdersManagement.ts
var OrdersManagement_exports = {};
__export(OrdersManagement_exports, {
  exportFoodOrdersList: () => exportFoodOrdersList,
  getFoodOrderDetail: () => getFoodOrderDetail,
  getFoodOrdersList: () => getFoodOrdersList,
  updateFoodOrderStatus: () => updateFoodOrderStatus
});
module.exports = __toCommonJS(OrdersManagement_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var ALLOWED_STATUS_TRANSITIONS = {
  PENDING_PAYMENT: ["CANCELLED"],
  PAID: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP"],
  READY_FOR_PICKUP: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: []
};
var prisma = import_prisma.default;
var getFoodOrdersList = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const page = input.page ?? 1;
    const pageSize = input.page_size ?? 20;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (input.search_keyword) {
      where.OR = [
        { orderNumber: { contains: input.search_keyword } },
        { pickupContactName: { contains: input.search_keyword } },
        { pickupPhone: { contains: input.search_keyword } }
      ];
    }
    if (input.foodOrder_statuses && input.foodOrder_statuses.length > 0) {
      where.orderStatus = { in: input.foodOrder_statuses };
    }
    if (input.payment_statuses && input.payment_statuses.length > 0) {
      where.paymentStatus = { in: input.payment_statuses };
    }
    if (input.created_at_start || input.created_at_end) {
      where.createdAt = {};
      if (input.created_at_start) {
        where.createdAt.gte = new Date(input.created_at_start);
      }
      if (input.created_at_end) {
        where.createdAt.lte = new Date(input.created_at_end);
      }
    }
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
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
        orderBy: { createdAt: "desc" }
      }),
      prisma.foodOrder.count({ where }),
      prisma.foodOrder.count({ where: { orderStatus: "PAID" } }),
      prisma.foodOrder.count({ where: { orderStatus: "READY_FOR_PICKUP" } }),
      prisma.foodOrder.count({ where: { orderStatus: "PENDING_PAYMENT" } }),
      prisma.foodOrder.count({
        where: {
          orderStatus: "COMPLETED",
          createdAt: { gte: todayStart }
        }
      })
    ]);
    return {
      foodOrder_list: list.map((item) => ({
        foodOrder_id: item.id,
        foodOrder_number: item.orderNumber,
        foodOrder_created_at: item.createdAt.toISOString(),
        pickup_contact_name: item.pickupContactName,
        customer_email: item.customerEmail,
        pickup_phone: item.pickupPhone,
        total_amount: item.totalAmount.toNumber(),
        payment_status: item.paymentStatus,
        foodOrder_status: item.orderStatus
      })),
      total_count: totalCount,
      metrics_pending_preparation: pendingPreparationCount,
      metrics_ready_for_pickup: readyForPickupCount,
      metrics_pending_payment: pendingPaymentCount,
      metrics_completed_today: completedTodayCount
    };
  })
);
var getFoodOrderDetail = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const order = await prisma.foodOrder.findUnique({
      where: { id: input.foodOrder_id },
      include: { food_order_item: true }
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return {
      foodOrder_id: order.id,
      foodOrder_number: order.orderNumber,
      foodOrder_created_at: order.createdAt.toISOString(),
      foodOrder_status: order.orderStatus,
      pickup_contact_name: order.pickupContactName,
      pickup_phone: order.pickupPhone,
      customer_email: order.customerEmail,
      fulfillment_method: order.fulfillmentMethod,
      subtotal_amount: order.subtotalAmount.toNumber(),
      total_amount: order.totalAmount.toNumber(),
      payment_status: order.paymentStatus,
      paid_at: order.paidAt?.toISOString() || null,
      payment_provider: order.paymentProvider,
      payment_out_trade_no: order.paymentOutTradeNo,
      payment_session_id: order.paymentSessionId,
      foodOrder_items: order.food_order_item.map((item) => ({
        item_id: item.id,
        item_name: item.itemName,
        unit_price: item.unitPrice.toNumber(),
        quantity: item.quantity,
        line_total: item.lineTotal.toNumber(),
        item_notes: item.notes
      }))
    };
  })
);
var updateFoodOrderStatus = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const order = await prisma.foodOrder.findUnique({
      where: { id: input.foodOrder_id }
    });
    if (!order) {
      throw new Error("Order not found");
    }
    const currentStatus = order.orderStatus;
    const targetStatus = input.target_order_status;
    if (order.fulfillmentMethod !== "PICKUP") {
      throw new Error("Only pickup food orders can be managed on this page");
    }
    if (!ALLOWED_STATUS_TRANSITIONS[currentStatus]?.includes(targetStatus)) {
      throw new Error(`Invalid order status transition: ${currentStatus} \u2192 ${targetStatus}`);
    }
    const nextPaymentStatus = targetStatus === "CANCELLED" ? currentStatus === "PENDING_PAYMENT" ? "CANCELLED" : order.paymentStatus : order.paymentStatus;
    const nextPaidAt = targetStatus === "CANCELLED" && currentStatus === "PENDING_PAYMENT" ? null : order.paidAt;
    await prisma.foodOrder.update({
      where: { id: input.foodOrder_id },
      data: {
        orderStatus: targetStatus,
        paymentStatus: nextPaymentStatus,
        paidAt: nextPaidAt,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { success: true };
  })
);
var exportFoodOrdersList = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const where = {};
    if (input.search_keyword) {
      where.OR = [
        { orderNumber: { contains: input.search_keyword } },
        { pickupContactName: { contains: input.search_keyword } },
        { pickupPhone: { contains: input.search_keyword } }
      ];
    }
    if (input.foodOrder_statuses && input.foodOrder_statuses.length > 0) {
      where.orderStatus = { in: input.foodOrder_statuses };
    }
    if (input.payment_statuses && input.payment_statuses.length > 0) {
      where.paymentStatus = { in: input.payment_statuses };
    }
    if (input.created_at_start || input.created_at_end) {
      where.createdAt = {};
      if (input.created_at_start) {
        where.createdAt.gte = new Date(input.created_at_start);
      }
      if (input.created_at_end) {
        where.createdAt.lte = new Date(input.created_at_end);
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
      orderBy: { createdAt: "desc" }
    });
    return {
      foodOrder_list: list.map((item) => ({
        foodOrder_id: item.id,
        foodOrder_number: item.orderNumber,
        foodOrder_created_at: item.createdAt.toISOString(),
        pickup_contact_name: item.pickupContactName,
        customer_email: item.customerEmail,
        pickup_phone: item.pickupPhone,
        total_amount: item.totalAmount.toNumber(),
        payment_status: item.paymentStatus,
        foodOrder_status: item.orderStatus
      }))
    };
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exportFoodOrdersList,
  getFoodOrderDetail,
  getFoodOrdersList,
  updateFoodOrderStatus
});
