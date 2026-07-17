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

// common-redirect:@/frontend/action_utils
var require_action_utils = __commonJS({
  "common-redirect:@/frontend/action_utils"(exports2, module2) {
    module2.exports = require("./_common").frontendAuth;
  }
});

// src/frontend/actions/FoodOrder.ts
var FoodOrder_exports = {};
__export(FoodOrder_exports, {
  createFoodOrder: () => createFoodOrder,
  createFoodOrderPaymentSession: () => createFoodOrderPaymentSession,
  getMenu: () => getMenu
});
module.exports = __toCommonJS(FoodOrder_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());

// server/thirdparty/common.ts
var PROJECT_ID = "PROJ_43bb5105_snap_20260716_073319_373";
var FRONTEND_URL = "https://project.autocoder.cc";
var BACKEND_URL = "https://www.autocoder.cc/rpc";
function canonicalStatsProjectId(projectId = PROJECT_ID) {
  const match = projectId.match(/^(PROJ_[a-f0-9]+)_snap_\d{8}_\d{6}_\d+$/i);
  return match ? match[1] : projectId;
}
var THIRD_PARTY_GOOGLE_CALLBACK_URL = `${BACKEND_URL}/api/auth/google/callback`;
var THIRD_PARTY_CLINK_API_KEY = "";
var THIRD_PARTY_CLINK_API_BASE_URL = "";
var THIRD_PARTY_CLINK_PUBLISHABLE_KEY = "";
var THIRD_PARTY_CLINK_WEBHOOK_SIGNING_KEY = "";
var THIRD_PARTY_CLINK_API_KEY_DEPLOY = "";
var THIRD_PARTY_CLINK_API_BASE_URL_DEPLOY = "";
var THIRD_PARTY_CLINK_PUBLISHABLE_KEY_DEPLOY = "";
var THIRD_PARTY_CLINK_WEBHOOK_SIGNING_KEY_DEPLOY = "";

// server/thirdparty/context.ts
var import_async_hooks = require("async_hooks");
var authContext = new import_async_hooks.AsyncLocalStorage();

// server/thirdparty/secret-resolver.ts
function getRequestHeaders() {
  const runtimeHeaders = globalThis.__runtimeRequestHeaders;
  if (runtimeHeaders && typeof runtimeHeaders === "object" && Object.keys(runtimeHeaders).length > 0) {
    return runtimeHeaders;
  }
  const ctx = authContext?.getStore?.();
  if (ctx?.headers && Object.keys(ctx.headers).length > 0) {
    return ctx.headers;
  }
  return void 0;
}
function isDeployedRequest() {
  return getRequestHeaders()?.["x-is-deployed"] === "1";
}
function isUnsetSecretValue(value) {
  const v = (value || "").trim();
  return !v || /^\{\{[A-Z0-9_]+\}\}$/.test(v) || /^\$\{[A-Z0-9_]+\}$/.test(v);
}
function normalizeSecret(value) {
  return isUnsetSecretValue(value) ? "" : value.trim();
}
function assertConfiguredSecret(value, secretName) {
  const normalized = normalizeSecret(value);
  if (!normalized) {
    throw new Error(`${secretName} \u672A\u914D\u7F6E\uFF1A\u8BF7\u5728\u5E73\u53F0\u914D\u7F6E\u652F\u4ED8 Secret \u540E\u91CD\u65B0\u90E8\u7F72\u3002`);
  }
  return normalized;
}
function resolvePaymentSecret(previewValue, deployValue, secretName) {
  if (!isDeployedRequest()) {
    const preview = normalizeSecret(previewValue);
    if (!preview) {
      throw new Error(`${secretName} \u672A\u914D\u7F6E\uFF1A\u9884\u89C8\u73AF\u5883\u7F3A\u5C11\u5E73\u53F0\u6D4B\u8BD5 Secret\u3002`);
    }
    return preview;
  }
  return assertConfiguredSecret(deployValue, secretName);
}
function resolveOptionalPaymentSecret(previewValue, deployValue) {
  if (!isDeployedRequest()) {
    return normalizeSecret(previewValue);
  }
  return normalizeSecret(deployValue);
}
function resolveClinkSecrets() {
  return {
    apiKey: resolvePaymentSecret(
      THIRD_PARTY_CLINK_API_KEY,
      THIRD_PARTY_CLINK_API_KEY_DEPLOY,
      "THIRD_PARTY_CLINK_API_KEY"
    ),
    apiBaseUrl: resolveOptionalPaymentSecret(
      THIRD_PARTY_CLINK_API_BASE_URL,
      THIRD_PARTY_CLINK_API_BASE_URL_DEPLOY
    ),
    publishableKey: resolveOptionalPaymentSecret(
      THIRD_PARTY_CLINK_PUBLISHABLE_KEY,
      THIRD_PARTY_CLINK_PUBLISHABLE_KEY_DEPLOY
    ),
    webhookSigningKey: resolveOptionalPaymentSecret(
      THIRD_PARTY_CLINK_WEBHOOK_SIGNING_KEY,
      THIRD_PARTY_CLINK_WEBHOOK_SIGNING_KEY_DEPLOY
    )
  };
}

// server/thirdparty/payment/clink.ts
var DEFAULT_THIRD_PARTY_CLINK_API_BASE_URL = "https://api.clinkbill.com";
function getClinkApiBaseUrl() {
  const configured = resolveClinkSecrets().apiBaseUrl;
  if (!configured || isUnsetSecretValue(configured)) {
    return DEFAULT_THIRD_PARTY_CLINK_API_BASE_URL;
  }
  return configured.replace(/\/+$/, "");
}
function getClinkAuthHeaders() {
  const { apiKey, publishableKey } = resolveClinkSecrets();
  if (!apiKey || isUnsetSecretValue(apiKey)) {
    throw new Error("Clink API key is not configured. Please set THIRD_PARTY_CLINK_API_KEY in project secrets.");
  }
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
    "X-Timestamp": Date.now().toString()
  };
  if (publishableKey && !isUnsetSecretValue(publishableKey)) {
    headers["X-Publishable-Key"] = publishableKey;
  }
  return headers;
}
function buildProjectUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${FRONTEND_URL}/${PROJECT_ID}${normalizedPath}`;
}
function stripClinkHostedSessionPlaceholder(successUrl) {
  if (!successUrl.includes("{CHECKOUT_SESSION_ID}")) {
    return successUrl;
  }
  const isAbsoluteUrl = /^https?:\/\//i.test(successUrl);
  const parsed = new URL(successUrl, isAbsoluteUrl ? void 0 : "https://placeholder.local");
  for (const [key, value] of Array.from(parsed.searchParams.entries())) {
    if (value === "{CHECKOUT_SESSION_ID}") {
      parsed.searchParams.delete(key);
    }
  }
  if (isAbsoluteUrl) {
    return parsed.toString();
  }
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
async function clinkRequest(path, init = {}) {
  const response = await fetch(`${getClinkApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...getClinkAuthHeaders(),
      ...init.headers || {}
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const message = data && (data.message || data.error) || response.statusText;
    throw new Error(`Clink API request failed: ${message}`);
  }
  if (data && typeof data === "object" && "code" in data && data.code !== 200) {
    const message = data.msg || data.message || data.error || "Unknown Clink business error";
    throw new Error(`Clink API request failed: ${message}`);
  }
  return data;
}
function extractValue(data, keys) {
  for (const key of keys) {
    if (data && data[key] != null) {
      return data[key];
    }
  }
  if (data?.data) {
    return extractValue(data.data, keys);
  }
  return void 0;
}
function normalizeClinkStatus(rawStatus) {
  const status = String(rawStatus || "").trim().toLowerCase();
  if (["paid", "succeeded", "success", "completed", "complete"].includes(status)) {
    return "paid";
  }
  if (["canceled", "cancelled", "expired", "closed"].includes(status)) {
    return "canceled";
  }
  if (["failed", "failure", "declined", "error"].includes(status)) {
    return "failed";
  }
  return "unpaid";
}
function extractClinkSessionStatus(result) {
  const paymentStatus = normalizeClinkStatus(extractValue(result, ["paymentStatus", "payment_status"]));
  if (paymentStatus !== "unpaid") {
    return paymentStatus;
  }
  const status = normalizeClinkStatus(extractValue(result, ["status", "orderStatus", "order_status"]));
  if (status !== "unpaid") {
    return status;
  }
  const paidFlag = extractValue(result, ["paid", "isPaid", "paymentSucceeded", "paymentSuccess"]);
  if (paidFlag === true || paidFlag === "true" || paidFlag === 1 || paidFlag === "1") {
    return "paid";
  }
  return "unpaid";
}
var provider = {
  createPaymentSession: createClinkCheckoutSession,
  getPaymentSession: getClinkPaymentSession
};
async function createClinkCheckoutSession(params) {
  const {
    amount,
    userId,
    successUrl,
    cancelUrl,
    productName = "Account Balance Recharge",
    currency = "usd",
    customerEmail
  } = params;
  const numericAmount = Number.parseFloat(amount.toString());
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Clink amount must be a positive number.");
  }
  const normalizedCustomerEmail = String(customerEmail || "").trim();
  if (!normalizedCustomerEmail) {
    throw new Error("Clink customerEmail is required to create a hosted checkout session.");
  }
  const outTradeNo = `CLINK_${Date.now()}_${Math.floor(Math.random() * 1e3)}`;
  const finalSuccessUrl = stripClinkHostedSessionPlaceholder(successUrl);
  const statsProjectId = canonicalStatsProjectId();
  const body = {
    customerEmail: normalizedCustomerEmail,
    uiMode: "hostedPage",
    originalAmount: numericAmount,
    originalCurrency: currency.toUpperCase(),
    successUrl: buildProjectUrl(finalSuccessUrl),
    cancelUrl: buildProjectUrl(cancelUrl),
    merchantReferenceId: outTradeNo,
    priceDataList: [
      {
        name: productName,
        description: `Recharge for User ${userId} | Project ${statsProjectId}`,
        unitAmount: numericAmount,
        currency: currency.toUpperCase(),
        quantity: 1
      }
    ],
    metadata: {
      projectId: statsProjectId,
      userId: userId.toString(),
      outTradeNo
    }
  };
  const result = await clinkRequest("/api/checkout/session", {
    method: "POST",
    body: JSON.stringify(body)
  });
  const sessionId = String(extractValue(result, ["id", "sessionId", "checkoutSessionId"]) || outTradeNo);
  const checkoutUrl = extractValue(result, ["url", "checkoutUrl", "hostedUrl", "hostedPageUrl"]);
  return {
    url: checkoutUrl || null,
    sessionId,
    outTradeNo,
    raw: result
  };
}
async function getClinkPaymentSession(sessionId) {
  try {
    let result;
    try {
      result = await clinkRequest(`/api/checkout/session/${encodeURIComponent(sessionId)}`, {
        method: "GET"
      });
    } catch (_sessionError) {
      result = await clinkRequest(`/api/order/${encodeURIComponent(sessionId)}`, {
        method: "GET"
      });
    }
    const status = extractClinkSessionStatus(result);
    const amount = extractValue(result, ["originalAmount", "amount", "amountTotal", "totalAmount"]);
    const currency = extractValue(result, ["originalCurrency", "currency"]);
    return {
      sessionId,
      status,
      amountTotal: amount == null ? void 0 : Number(amount),
      currency: currency ? String(currency).toLowerCase() : "",
      metadata: extractValue(result, ["metadata"]) || {},
      raw: result
    };
  } catch (error) {
    console.error("Clink Query Error:", error);
    return null;
  }
}
function getPaymentProvider(_name) {
  return provider;
}

// src/frontend/route-params.ts
function buildUrl(path, params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, v);
  });
  const query = sp.toString();
  return query ? `${path}?${query}` : path;
}
var OrderPaymentResult = {
  id: "F03",
  path: "/orderpaymentresult",
  paramsMeta: {
    orderId: {
      source_table: "food_order",
      source_column: "id",
      description: "Source is the food_order primary key id for resolving the order shown on the payment result page."
    },
    status: {
      source_table: "food_order",
      source_column: "paymentStatus",
      description: "Source is the payment status used to branch the payment result state after CLINK redirect."
    },
    sessionId: {
      source_table: "food_order",
      source_column: "paymentSessionId",
      description: "Source is the CLINK payment session identifier used to reconcile redirect result details."
    }
  },
  getParams: /* @__PURE__ */ (() => {
    const cache = /* @__PURE__ */ new WeakMap();
    return (sp) => {
      if (cache.has(sp)) return cache.get(sp);
      const result = {
        orderId: sp.get("orderId") || "",
        status: sp.get("status") || "",
        sessionId: sp.get("sessionId") || ""
      };
      cache.set(sp, result);
      return result;
    };
  })(),
  navigateToStandard: (router) => router.push(OrderPaymentResult.path),
  navigateToWithParams: (router, params) => router.push(buildUrl(OrderPaymentResult.path, params))
};

// src/frontend/actions/FoodOrder.ts
var db = import_prisma.default;
var MENU_CATALOG = [
  {
    dish_id: "starter-truffle-arancini",
    category: "Starters",
    name: "Truffle Mushroom Arancini",
    description: "Crisp risotto croquettes with roasted mushrooms, black truffle cream, and aged parmesan.",
    price: 46,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 10
  },
  {
    dish_id: "starter-burrata-caprese",
    category: "Starters",
    name: "Burrata Caprese",
    description: "Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic reduction.",
    price: 52,
    image_url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 20
  },
  {
    dish_id: "pizza-burrata-woodfired",
    category: "Wood-Fired Pizza",
    name: "Wood-Fired Burrata Pizza",
    description: "San Marzano tomato, basil pesto, creamy burrata, and charred crust from the stone oven.",
    price: 72,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 30
  },
  {
    dish_id: "pizza-prosciutto-fig",
    category: "Wood-Fired Pizza",
    name: "Prosciutto & Fig Pizza",
    description: "Prosciutto di Parma, mozzarella, roasted fig compote, arugula, and cracked black pepper.",
    price: 78,
    image_url: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 40
  },
  {
    dish_id: "pasta-ragu-tagliatelle",
    category: "Pasta",
    name: "Tagliatelle al Rag\xF9",
    description: "Slow-braised beef rag\xF9 tossed with fresh egg tagliatelle and pecorino.",
    price: 88,
    image_url: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 50
  },
  {
    dish_id: "pasta-lobster-linguine",
    category: "Pasta",
    name: "Lobster Linguine",
    description: "Linguine with lobster medallions, cherry tomato sauce, lemon zest, and parsley.",
    price: 108,
    image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 60
  },
  {
    dish_id: "dessert-tiramisu",
    category: "Desserts",
    name: "Classic Tiramisu",
    description: "Mascarpone cream, espresso-soaked savoiardi, cocoa, and dark chocolate shavings.",
    price: 36,
    image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 70
  },
  {
    dish_id: "drink-sparkling-citrus",
    category: "Beverages",
    name: "Sparkling Citrus Juice",
    description: "House sparkling juice with Sicilian citrus, tonic bubbles, and chilled rosemary.",
    price: 24,
    image_url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 80
  }
];
function getMenuCatalog() {
  return [...MENU_CATALOG].sort((a, b) => a.sortOrder - b.sortOrder);
}
function buildOrderNumber() {
  const now = /* @__PURE__ */ new Date();
  const compactDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const compactTime = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FO-${compactDate}-${compactTime}-${suffix}`;
}
function normalizePhone(value) {
  return value.replace(/\s+/g, " ").trim();
}
function buildPaymentResultUrl(orderId, status, sessionId) {
  const params = new URLSearchParams({
    orderId,
    status
  });
  if (sessionId) {
    params.set("sessionId", sessionId);
  }
  return `${OrderPaymentResult.path}?${params.toString()}`;
}
function mapPaymentStatus(status) {
  switch (status) {
    case "SUCCESS":
      return "SUCCESS";
    case "FAILED":
      return "FAILED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}
function toPlainDishItem(entry) {
  return {
    dish_id: entry.dish_id,
    category: entry.category,
    name: entry.name,
    description: entry.description,
    price: entry.price,
    image_url: entry.image_url
  };
}
var getMenu = (0, import_action_utils.withResult)(async () => {
  const dishes = getMenuCatalog();
  const categories = Array.from(new Set(dishes.map((dish) => dish.category)));
  return {
    categories,
    dishes: dishes.map(toPlainDishItem)
  };
});
var createFoodOrder = (0, import_action_utils.withResult)(async (input) => {
  const pickupName = input.pickup_name.trim();
  const pickupPhone = normalizePhone(input.pickup_phone);
  const customerEmail = input.customer_email.trim().toLowerCase();
  if (!pickupName || !pickupPhone || !customerEmail) {
    throw new Error("Please provide your name, phone number, and email for pickup.");
  }
  if (!customerEmail.includes("@")) {
    throw new Error("Please provide a valid email address for pickup updates.");
  }
  if (!input.items || input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }
  const menuById = new Map(getMenuCatalog().map((dish) => [dish.dish_id, dish]));
  const quantityByDishId = /* @__PURE__ */ new Map();
  for (const item of input.items) {
    const qty = Number(item.quantity);
    if (!item.dish_id || !Number.isInteger(qty) || qty <= 0) {
      throw new Error("One or more cart items are invalid.");
    }
    if (!menuById.has(item.dish_id)) {
      throw new Error("One or more selected menu items are no longer available.");
    }
    quantityByDishId.set(item.dish_id, (quantityByDishId.get(item.dish_id) || 0) + qty);
  }
  const orderItemsData = Array.from(quantityByDishId.entries()).map(([dishId, quantity]) => {
    const dish = menuById.get(dishId);
    if (!dish) {
      throw new Error("One or more selected menu items are invalid.");
    }
    const unitPrice = dish.price;
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    return {
      itemName: dish.name,
      unitPrice,
      quantity,
      lineTotal,
      notes: null
    };
  });
  const subtotalAmount = Number(
    orderItemsData.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
  );
  const totalAmount = subtotalAmount;
  const orderNumber = buildOrderNumber();
  const order = await db.foodOrder.create({
    data: {
      orderNumber,
      fulfillmentMethod: "PICKUP",
      pickupContactName: pickupName,
      pickupPhone,
      customerEmail,
      subtotalAmount,
      totalAmount,
      currency: "CNY",
      paymentProvider: "CLINK",
      paymentStatus: "PENDING",
      orderStatus: "PENDING_PAYMENT",
      food_order_item: {
        create: orderItemsData
      }
    }
  });
  const provider2 = getPaymentProvider();
  const paymentSession = await provider2.createPaymentSession({
    amount: totalAmount,
    userId: order.id,
    customerEmail,
    productName: `Pickup Order ${order.orderNumber}`,
    currency: order.currency.toLowerCase(),
    orderId: order.id,
    successUrl: buildPaymentResultUrl(order.id, "SUCCESS"),
    cancelUrl: buildPaymentResultUrl(order.id, "CANCELLED")
  });
  if (!paymentSession.url) {
    throw new Error("Clink payment session did not return a checkout URL.");
  }
  await db.foodOrder.update({
    where: { id: order.id },
    data: {
      paymentSessionId: paymentSession.sessionId,
      paymentOutTradeNo: paymentSession.outTradeNo
    }
  });
  return {
    order_id: order.id,
    order_number: order.orderNumber,
    session_id: paymentSession.sessionId || "",
    status: "PENDING",
    total_amount: totalAmount,
    currency: order.currency,
    payment_url: paymentSession.url
  };
});
var createFoodOrderPaymentSession = (0, import_action_utils.withResult)(async (input) => {
  if (!input.order_id) {
    throw new Error("Order ID is required.");
  }
  const order = await db.foodOrder.findUnique({
    where: { id: input.order_id }
  });
  if (!order) {
    throw new Error("The requested order could not be found.");
  }
  if (order.paymentStatus === "SUCCESS") {
    throw new Error("This order has already been paid.");
  }
  const provider2 = getPaymentProvider();
  const paymentSession = await provider2.createPaymentSession({
    amount: Number(order.totalAmount),
    userId: order.id,
    customerEmail: order.customerEmail,
    productName: `Pickup Order ${order.orderNumber}`,
    currency: order.currency.toLowerCase(),
    orderId: order.id,
    successUrl: buildPaymentResultUrl(order.id, "SUCCESS"),
    cancelUrl: buildPaymentResultUrl(order.id, "CANCELLED")
  });
  if (!paymentSession.url) {
    throw new Error("Clink payment session did not return a checkout URL.");
  }
  const updatedOrder = await db.foodOrder.update({
    where: { id: order.id },
    data: {
      paymentSessionId: paymentSession.sessionId,
      paymentOutTradeNo: paymentSession.outTradeNo,
      paymentStatus: "PENDING",
      orderStatus: "PENDING_PAYMENT",
      paidAt: null
    }
  });
  return {
    order_id: updatedOrder.id,
    order_number: updatedOrder.orderNumber,
    session_id: paymentSession.sessionId || "",
    status: mapPaymentStatus(updatedOrder.paymentStatus),
    total_amount: Number(updatedOrder.totalAmount),
    currency: updatedOrder.currency,
    payment_url: paymentSession.url
  };
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFoodOrder,
  createFoodOrderPaymentSession,
  getMenu
});
