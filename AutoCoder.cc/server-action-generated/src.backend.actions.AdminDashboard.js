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

// src/backend/actions/AdminDashboard.ts
var AdminDashboard_exports = {};
__export(AdminDashboard_exports, {
  getAdminDashboardData: () => getAdminDashboardData,
  removeDashboardPhoto: () => removeDashboardPhoto,
  removeDashboardReview: () => removeDashboardReview,
  updateRestaurantProfile: () => updateRestaurantProfile
});
module.exports = __toCommonJS(AdminDashboard_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var getAdminDashboardData = (0, import_action_utils.requireRole)(import_action_utils.UserRole.ADMIN)(
  (0, import_action_utils.withResult)(async () => {
    const restaurant = await import_prisma.default.restaurant.findFirst();
    if (!restaurant) {
      return {
        restaurant: null,
        counts: {
          activePhotosCount: 0,
          activeHoursCount: 0,
          activeReviewsCount: 0
        },
        photos: [],
        reviews: [],
        hours: []
      };
    }
    const [
      activePhotosCount,
      activeHoursCount,
      activeReviewsCount,
      photosList,
      reviewsList,
      hoursList
    ] = await Promise.all([
      import_prisma.default.restaurantphoto.count({ where: { restaurantId: restaurant.id } }),
      import_prisma.default.restauranthour.count({ where: { restaurantId: restaurant.id } }),
      import_prisma.default.restaurantreview.count({ where: { restaurantId: restaurant.id } }),
      import_prisma.default.restaurantphoto.findMany({
        where: { restaurantId: restaurant.id },
        orderBy: { sortOrder: "asc" },
        take: 10
      }),
      import_prisma.default.restaurantreview.findMany({
        where: { restaurantId: restaurant.id, reviewSlot: { in: [1, 2, 3, 4, 5] } },
        orderBy: { reviewSlot: "asc" }
      }),
      import_prisma.default.restauranthour.findMany({
        where: { restaurantId: restaurant.id }
      })
    ]);
    const weekdayOrder = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7
    };
    const sortedHours = hoursList.map((h) => ({
      id: h.id,
      weekday: h.weekday,
      sortOrder: h.sortOrder,
      fullLine: h.fullLine
    })).sort((a, b) => (weekdayOrder[a.weekday.toUpperCase()] || 99) - (weekdayOrder[b.weekday.toUpperCase()] || 99));
    return {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        website: restaurant.website,
        rating: restaurant.rating.toNumber(),
        // Decimal 安全转换
        reviewCount: restaurant.reviewCount,
        brandStory: restaurant.brandStory
      },
      counts: {
        activePhotosCount,
        activeHoursCount,
        activeReviewsCount
      },
      photos: photosList.map((p) => ({
        id: p.id,
        photoKey: p.photoKey,
        sortOrder: p.sortOrder,
        imageUrl: p.imageUrl,
        description: p.description,
        alt: p.alt
      })),
      reviews: reviewsList.map((r) => ({
        id: r.id,
        reviewSlot: r.reviewSlot,
        authorName: r.authorName,
        rating: r.rating,
        relativeTime: r.relativeTime,
        content: r.content
      })),
      hours: sortedHours
    };
  })
);
var updateRestaurantProfile = (0, import_action_utils.requireRole)(import_action_utils.UserRole.ADMIN)(
  (0, import_action_utils.withResult)(async (input) => {
    const { name, brandStory, phone, website, address } = input;
    if (!name?.trim() || !brandStory?.trim() || !phone?.trim() || !website?.trim() || !address?.trim()) {
      throw new Error("All required fields must be non-empty");
    }
    const restaurant = await import_prisma.default.restaurant.findFirst();
    if (!restaurant) {
      throw new Error("Canonical restaurant not found");
    }
    await import_prisma.default.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: name.trim(),
        brandStory: brandStory.trim(),
        phone: phone.trim(),
        website: website.trim(),
        address: address.trim(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  })
);
var removeDashboardPhoto = (0, import_action_utils.requireRole)(import_action_utils.UserRole.ADMIN)(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.id) {
      throw new Error("Photo ID is required");
    }
    const photo = await import_prisma.default.restaurantphoto.findUnique({
      where: { id: input.id }
    });
    if (!photo) {
      throw new Error("Photo record not found");
    }
    await import_prisma.default.restaurantphoto.delete({
      where: { id: input.id }
    });
  })
);
var removeDashboardReview = (0, import_action_utils.requireRole)(import_action_utils.UserRole.ADMIN)(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.id) {
      throw new Error("Review ID is required");
    }
    const review = await import_prisma.default.restaurantreview.findUnique({
      where: { id: input.id }
    });
    if (!review) {
      throw new Error("Review record not found");
    }
    await import_prisma.default.restaurantreview.delete({
      where: { id: input.id }
    });
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAdminDashboardData,
  removeDashboardPhoto,
  removeDashboardReview,
  updateRestaurantProfile
});
