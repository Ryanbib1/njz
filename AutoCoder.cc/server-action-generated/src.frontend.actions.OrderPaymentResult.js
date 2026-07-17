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

// src/frontend/actions/OrderPaymentResult.ts
var OrderPaymentResult_exports = {};
__export(OrderPaymentResult_exports, {
  getPaymentOrderDetails: () => getPaymentOrderDetails,
  reconcileFoodOrderPayment: () => reconcileFoodOrderPayment,
  verifyFoodOrderPayment: () => verifyFoodOrderPayment
});
module.exports = __toCommonJS(OrderPaymentResult_exports);
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

// src/frontend/actions/OrderPaymentResult.ts
var db = import_prisma.default;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function toPaymentStatus(status) {
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
function toFoodOrderStatus(status) {
  return status === "SUCCESS" ? "PAID" : status === "CANCELLED" ? "CANCELLED" : "PENDING_PAYMENT";
}
function normalizeProviderPaymentStatus(status) {
  const normalizedStatus = String(status || "").toLowerCase();
  if (normalizedStatus === "paid") {
    return "SUCCESS";
  }
  if (normalizedStatus === "failed") {
    return "FAILED";
  }
  if (normalizedStatus === "canceled" || normalizedStatus === "cancelled") {
    return "CANCELLED";
  }
  return "PENDING";
}
function resolveTrustedSessionId(order, requestedSessionId) {
  const routeSessionId = requestedSessionId?.trim();
  const storedSessionId = typeof order.paymentSessionId === "string" ? order.paymentSessionId.trim() : "";
  if (routeSessionId && storedSessionId && routeSessionId !== storedSessionId) {
    throw new Error("Invalid payment session identified.");
  }
  if (storedSessionId) {
    return storedSessionId;
  }
  if (routeSessionId) {
    throw new Error("Invalid payment session identified.");
  }
  return "";
}
async function fetchOrderWithItems(orderId) {
  return db.foodOrder.findUnique({
    where: { id: orderId },
    include: {
      food_order_item: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
}
async function persistResolvedPaymentStatus(orderId, paymentStatus, sessionId) {
  return db.foodOrder.update({
    where: { id: orderId },
    data: {
      ...sessionId ? { paymentSessionId: sessionId } : {},
      paymentStatus,
      orderStatus: toFoodOrderStatus(paymentStatus),
      paidAt: paymentStatus === "SUCCESS" ? /* @__PURE__ */ new Date() : null
    },
    include: {
      food_order_item: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
}
function mapOrderDetails(order) {
  return {
    order_id: order.id,
    order_number: order.orderNumber,
    order_created_at: order.createdAt.toISOString(),
    order_payment_out_trade_no: order.paymentOutTradeNo,
    order_pickup_contact_name: order.pickupContactName,
    order_pickup_phone: order.pickupPhone,
    order_food_status: order.orderStatus,
    order_payment_status: order.paymentStatus,
    order_subtotal_amount: order.subtotalAmount.toNumber(),
    order_total_amount: order.totalAmount.toNumber(),
    order_currency: order.currency,
    order_items: order.food_order_item.map((item) => ({
      item_id: item.id,
      item_name: item.itemName,
      item_quantity: item.quantity,
      item_line_total: item.lineTotal.toNumber(),
      item_notes: item.notes
    }))
  };
}
var getPaymentOrderDetails = (0, import_action_utils.withResult)(
  async (input) => {
    if (!input.order_id) {
      throw new Error("Order ID is required.");
    }
    const order = await fetchOrderWithItems(input.order_id);
    if (!order) {
      throw new Error("The requested order could not be found.");
    }
    resolveTrustedSessionId(order, input.session_id);
    return {
      order: mapOrderDetails(order)
    };
  }
);
var verifyFoodOrderPayment = (0, import_action_utils.withResult)(
  async (input) => {
    if (!input.order_id) {
      throw new Error("Order ID is required.");
    }
    if (!input.session_id) {
      throw new Error("Payment session ID is required.");
    }
    const order = await fetchOrderWithItems(input.order_id);
    if (!order) {
      throw new Error("The requested order could not be found.");
    }
    const resolvedSessionId = resolveTrustedSessionId(order, input.session_id);
    if (!resolvedSessionId) {
      throw new Error("Payment session ID is required.");
    }
    const provider2 = getPaymentProvider();
    let latestInfo = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      latestInfo = await provider2.getPaymentSession(resolvedSessionId);
      const normalized = String(latestInfo?.status || "").toLowerCase();
      if (normalized === "paid" || normalized === "failed" || normalized === "canceled" || normalized === "cancelled") {
        break;
      }
      if (attempt < 3) {
        await delay(1200);
      }
    }
    const paymentStatus = normalizeProviderPaymentStatus(latestInfo?.status);
    const updatedOrder = await persistResolvedPaymentStatus(input.order_id, paymentStatus, resolvedSessionId);
    return {
      order: mapOrderDetails(updatedOrder),
      payment_status: toPaymentStatus(updatedOrder.paymentStatus),
      should_retry: paymentStatus === "PENDING"
    };
  }
);
var reconcileFoodOrderPayment = (0, import_action_utils.withResult)(
  async (input) => {
    if (!input.order_id) {
      throw new Error("Order ID is required.");
    }
    const order = await fetchOrderWithItems(input.order_id);
    if (!order) {
      throw new Error("The requested order could not be found.");
    }
    const resolvedSessionId = resolveTrustedSessionId(order, input.session_id);
    if (resolvedSessionId) {
      return verifyFoodOrderPayment({
        order_id: input.order_id,
        session_id: resolvedSessionId
      });
    }
    const normalizedStatus = String(input.status || "").toUpperCase();
    if (normalizedStatus === "SUCCESS") {
      throw new Error("Unable to confirm payment success because no payment session is available.");
    }
    const paymentStatus = normalizedStatus === "CANCELLED" ? "CANCELLED" : normalizedStatus === "FAILED" ? "FAILED" : normalizedStatus === "SUCCESS" ? "SUCCESS" : toPaymentStatus(order.paymentStatus);
    const updatedOrder = await db.foodOrder.update({
      where: { id: input.order_id },
      data: {
        paymentStatus,
        orderStatus: toFoodOrderStatus(paymentStatus),
        paidAt: paymentStatus === "SUCCESS" ? order.paidAt || /* @__PURE__ */ new Date() : null
      },
      include: {
        food_order_item: {
          orderBy: { createdAt: "asc" }
        }
      }
    });
    return {
      order: mapOrderDetails(updatedOrder),
      payment_status: toPaymentStatus(updatedOrder.paymentStatus),
      should_retry: paymentStatus === "PENDING"
    };
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPaymentOrderDetails,
  reconcileFoodOrderPayment,
  verifyFoodOrderPayment
});
