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

// src/frontend/actions/Home.ts
var Home_exports = {};
__export(Home_exports, {
  getRestaurantProfile: () => getRestaurantProfile
});
module.exports = __toCommonJS(Home_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var WEEKDAY_ORDER = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
};
var getRestaurantProfile = (0, import_action_utils.withResult)(
  async (input) => {
    const restaurant = await import_prisma.default.restaurant.findFirst({
      include: {
        photos: true,
        reviews: true,
        hours: true
      }
    });
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    const sortedPhotos = [...restaurant.photos].sort((a, b) => a.sortOrder - b.sortOrder);
    const sortedHours = [...restaurant.hours].sort((a, b) => {
      const weightA = WEEKDAY_ORDER[a.weekday] || 99;
      const weightB = WEEKDAY_ORDER[b.weekday] || 99;
      return weightA - weightB;
    });
    const safeHighlights = Array.isArray(restaurant.highlights) ? restaurant.highlights : [];
    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      rating: restaurant.rating ? restaurant.rating.toNumber() : 0,
      reviewCount: restaurant.reviewCount,
      brandStory: restaurant.brandStory,
      highlights: safeHighlights,
      photos: sortedPhotos.map((photo) => ({
        id: photo.id,
        imageUrl: photo.imageUrl,
        alt: photo.alt,
        description: photo.description,
        sortOrder: photo.sortOrder
      })),
      reviews: restaurant.reviews.map((review) => ({
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        relativeTime: review.relativeTime,
        content: review.content
      })),
      hours: sortedHours.map((hour) => ({
        id: hour.id,
        weekday: hour.weekday,
        fullLine: hour.fullLine
      }))
    };
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRestaurantProfile
});
