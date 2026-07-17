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

// src/backend/actions/ReviewsManagement.ts
var ReviewsManagement_exports = {};
__export(ReviewsManagement_exports, {
  createReview: () => createReview,
  deleteReview: () => deleteReview,
  getReviewDetail: () => getReviewDetail,
  getReviewsList: () => getReviewsList,
  updateReview: () => updateReview
});
module.exports = __toCommonJS(ReviewsManagement_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var REFERENCE_REVIEWS = {
  1: {
    authorName: "Alex M.",
    rating: 5,
    relativeTime: "a month ago",
    content: "Absolutely fantastic Italian dining experience! The pizza was authentic, and the prefix lunch menu is a steal."
  },
  2: {
    authorName: "Sarah J.",
    rating: 5,
    relativeTime: "3 months ago",
    content: "Best sparkling juice I've ever had. The ambiance is perfect for a date night. Will definitely come back."
  },
  3: {
    authorName: "David L.",
    rating: 4,
    relativeTime: "2 weeks ago",
    content: "Great food and excellent service. The only downside was finding parking nearby, but the meal made up for it."
  },
  4: {
    authorName: "Emily C.",
    rating: 5,
    relativeTime: "4 months ago",
    content: "Tavola never disappoints. Every dish feels like it's made with love. Highly recommend the truffle pasta."
  },
  5: {
    authorName: "Michael R.",
    rating: 4,
    relativeTime: "a week ago",
    content: "Solid Italian place in the city. The staff was attentive and the desserts were to die for."
  }
};
function checkMatchStatus(slot, record) {
  const ref = REFERENCE_REVIEWS[slot];
  if (!ref) return "MISMATCHED";
  const isMatched = record.authorName === ref.authorName && record.rating === ref.rating && record.relativeTime === ref.relativeTime && record.content === ref.content;
  return isMatched ? "MATCHED" : "MISMATCHED";
}
async function getCanonicalRestaurantId() {
  const restaurant = await import_prisma.default.restaurant.findFirst();
  if (!restaurant) {
    throw new Error("The canonical restaurant record does not exist. Please configure business information first.");
  }
  return restaurant.id;
}
var getReviewsList = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (_input = {}) => {
    const restaurantId = await getCanonicalRestaurantId();
    const dbReviews = await import_prisma.default.restaurantreview.findMany({
      where: { restaurantId }
    });
    const list = [];
    let presentCount = 0;
    for (let i = 1; i <= 5; i++) {
      const review = dbReviews.find((r) => r.reviewSlot === i);
      if (review) {
        presentCount++;
        list.push({
          review_id: review.id,
          review_slot: review.reviewSlot,
          author_name: review.authorName,
          rating: review.rating,
          relative_time: review.relativeTime,
          content: review.content,
          match_status: checkMatchStatus(i, review),
          is_present: true
        });
      } else {
        list.push({
          review_id: null,
          review_slot: i,
          author_name: null,
          rating: null,
          relative_time: null,
          content: null,
          match_status: "MISSING",
          is_present: false
        });
      }
    }
    return {
      list,
      present_count: presentCount,
      total_slots: 5
    };
  })
);
var getReviewDetail = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (input.review_slot < 1 || input.review_slot > 5) {
      throw new Error("Invalid review slot. Allowed slots are 1 through 5.");
    }
    const restaurantId = await getCanonicalRestaurantId();
    const review = await import_prisma.default.restaurantreview.findUnique({
      where: { reviewSlot: input.review_slot }
    });
    if (!review || review.restaurantId !== restaurantId) {
      return {
        review: {
          review_id: null,
          review_slot: input.review_slot,
          author_name: null,
          rating: null,
          relative_time: null,
          content: null,
          match_status: "MISSING",
          is_present: false
        }
      };
    }
    return {
      review: {
        review_id: review.id,
        review_slot: review.reviewSlot,
        author_name: review.authorName,
        rating: review.rating,
        relative_time: review.relativeTime,
        content: review.content,
        match_status: checkMatchStatus(review.reviewSlot, review),
        is_present: true
      }
    };
  })
);
var createReview = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (input.review_slot < 1 || input.review_slot > 5) {
      throw new Error("Invalid review slot. Allowed slots are 1 through 5.");
    }
    if (!input.author_name || !input.relative_time || !input.content || input.rating == null) {
      throw new Error("All fields (author name, rating, relative time, content) are required.");
    }
    const restaurantId = await getCanonicalRestaurantId();
    const existing = await import_prisma.default.restaurantreview.findUnique({
      where: { reviewSlot: input.review_slot }
    });
    if (existing) {
      throw new Error("This review slot is already present. Please use the update function instead.");
    }
    const newReview = await import_prisma.default.restaurantreview.create({
      data: {
        restaurantId,
        reviewSlot: input.review_slot,
        authorName: input.author_name,
        rating: input.rating,
        relativeTime: input.relative_time,
        content: input.content,
        updatedAt: /* @__PURE__ */ new Date()
        // Explicitly write updated time
      }
    });
    return { review_id: newReview.id };
  })
);
var updateReview = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.review_id) {
      throw new Error("Review ID is required for updating.");
    }
    if (!input.author_name || !input.relative_time || !input.content || input.rating == null) {
      throw new Error("All fields (author name, rating, relative time, content) are required.");
    }
    const existing = await import_prisma.default.restaurantreview.findUnique({
      where: { id: input.review_id }
    });
    if (!existing) {
      throw new Error("The target review record does not exist.");
    }
    await import_prisma.default.restaurantreview.update({
      where: { id: input.review_id },
      data: {
        authorName: input.author_name,
        rating: input.rating,
        relativeTime: input.relative_time,
        content: input.content,
        // Verbatim save, no formatting/trimming
        updatedAt: /* @__PURE__ */ new Date()
        // Explicitly write updated time
      }
    });
    return { success: true };
  })
);
var deleteReview = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.review_id) {
      throw new Error("Review ID is required for deletion.");
    }
    const existing = await import_prisma.default.restaurantreview.findUnique({
      where: { id: input.review_id }
    });
    if (!existing) {
      throw new Error("The target review record does not exist.");
    }
    await import_prisma.default.restaurantreview.delete({
      where: { id: input.review_id }
    });
    return { success: true };
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createReview,
  deleteReview,
  getReviewDetail,
  getReviewsList,
  updateReview
});
