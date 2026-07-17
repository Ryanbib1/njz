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

// src/backend/actions/BusinessInfoManagement.ts
var BusinessInfoManagement_exports = {};
__export(BusinessInfoManagement_exports, {
  createHourRecord: () => createHourRecord,
  deleteHourRecord: () => deleteHourRecord,
  getBusinessProfile: () => getBusinessProfile,
  updateBusinessIdentity: () => updateBusinessIdentity,
  updateHourRecord: () => updateHourRecord
});
module.exports = __toCommonJS(BusinessInfoManagement_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY"
];
var FIXED_IDENTITY_SOURCE = {
  source_name: "Tavola Italian Dining",
  source_address: "2nd Floor, The Grand Summit, Section B, 19 Dongfang East Road, Chaoyang District, Beijing",
  source_phone: "010-8532 5068",
  source_website: "http://www.tavola.cn/",
  source_rating: 4.8,
  source_reviewCount: 59
};
var FIXED_HOURS_SOURCE = {
  MONDAY: "Monday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  TUESDAY: "Tuesday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  WEDNESDAY: "Wednesday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  THURSDAY: "Thursday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  FRIDAY: "Friday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  SATURDAY: "Saturday: 11:30 AM - 10:00 PM",
  SUNDAY: "Sunday: 11:30 AM - 10:00 PM"
};
var getBusinessProfile = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async () => {
    const restaurant = await import_prisma.default.restaurant.findFirst({
      include: {
        hours: true
      }
    });
    if (!restaurant) {
      throw new Error("Canonical restaurant record not found in the database.");
    }
    const currentRating = restaurant.rating?.toNumber() || 0;
    const identity_info = {
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      restaurant_address: restaurant.address,
      restaurant_phone: restaurant.phone,
      restaurant_website: restaurant.website,
      restaurant_rating: currentRating,
      restaurant_reviewCount: restaurant.reviewCount
    };
    const identity_validation = {
      name_status: identity_info.restaurant_name === FIXED_IDENTITY_SOURCE.source_name ? "MATCHED" : "MISMATCHED",
      address_status: identity_info.restaurant_address === FIXED_IDENTITY_SOURCE.source_address ? "MATCHED" : "MISMATCHED",
      phone_status: identity_info.restaurant_phone === FIXED_IDENTITY_SOURCE.source_phone ? "MATCHED" : "MISMATCHED",
      website_status: identity_info.restaurant_website === FIXED_IDENTITY_SOURCE.source_website ? "MATCHED" : "MISMATCHED",
      rating_status: identity_info.restaurant_rating === FIXED_IDENTITY_SOURCE.source_rating ? "MATCHED" : "MISMATCHED",
      reviewCount_status: identity_info.restaurant_reviewCount === FIXED_IDENTITY_SOURCE.source_reviewCount ? "MATCHED" : "MISMATCHED"
    };
    const hours_records = WEEKDAYS.map((weekday) => {
      const dbHour = restaurant.hours.find((h) => h.weekday.toUpperCase() === weekday);
      const sourceLine = FIXED_HOURS_SOURCE[weekday];
      if (dbHour) {
        return {
          hour_id: dbHour.id,
          hour_weekday: weekday,
          hour_fullLine: dbHour.fullLine,
          hour_recordStatus: "PRESENT",
          hour_matchStatus: dbHour.fullLine === sourceLine ? "MATCHED" : "MISMATCHED",
          hour_sourceFullLine: sourceLine
        };
      } else {
        return {
          hour_id: null,
          hour_weekday: weekday,
          hour_fullLine: null,
          hour_recordStatus: "MISSING",
          hour_matchStatus: null,
          hour_sourceFullLine: sourceLine
        };
      }
    });
    const is_dataset_complete = hours_records.every((h) => h.hour_recordStatus === "PRESENT");
    const allUpdateDates = [
      restaurant.updatedAt.getTime(),
      ...restaurant.hours.map((h) => h.updatedAt.getTime())
    ];
    const last_system_update = new Date(Math.max(...allUpdateDates)).toISOString();
    return {
      identity_info,
      identity_source: FIXED_IDENTITY_SOURCE,
      identity_validation,
      hours_records,
      is_dataset_complete,
      last_system_update
    };
  })
);
var updateBusinessIdentity = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const {
      restaurant_id,
      restaurant_name,
      restaurant_address,
      restaurant_phone,
      restaurant_website,
      restaurant_rating,
      restaurant_reviewCount
    } = input;
    if (!restaurant_id || !restaurant_name || !restaurant_address || !restaurant_phone || !restaurant_website || restaurant_rating === void 0 || restaurant_reviewCount === void 0) {
      throw new Error("All business identity fields are required.");
    }
    await import_prisma.default.restaurant.update({
      where: { id: restaurant_id },
      data: {
        name: restaurant_name,
        address: restaurant_address,
        phone: restaurant_phone,
        website: restaurant_website,
        rating: restaurant_rating,
        reviewCount: restaurant_reviewCount,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { success: true };
  })
);
var createHourRecord = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.restaurant_id || !input.hour_weekday || !input.hour_fullLine) {
      throw new Error("Restaurant ID, weekday, and full line are required.");
    }
    const safeWeekday = input.hour_weekday.toUpperCase();
    if (!WEEKDAYS.includes(safeWeekday)) {
      throw new Error("Invalid weekday provided.");
    }
    const existing = await import_prisma.default.restauranthour.findFirst({
      where: {
        restaurantId: input.restaurant_id,
        weekday: safeWeekday
      }
    });
    if (existing) {
      throw new Error("An hours record for this weekday already exists.");
    }
    const sortOrder = WEEKDAYS.indexOf(safeWeekday) + 1;
    const newRecord = await import_prisma.default.restauranthour.create({
      data: {
        restaurantId: input.restaurant_id,
        weekday: safeWeekday,
        sortOrder,
        fullLine: input.hour_fullLine,
        updatedAt: /* @__PURE__ */ new Date(),
        createdAt: /* @__PURE__ */ new Date()
      }
    });
    return { hour_id: newRecord.id };
  })
);
var updateHourRecord = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.hour_id || !input.hour_fullLine) {
      throw new Error("Hour ID and full line are required.");
    }
    await import_prisma.default.restauranthour.update({
      where: { id: input.hour_id },
      data: {
        fullLine: input.hour_fullLine,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { success: true };
  })
);
var deleteHourRecord = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.hour_id) {
      throw new Error("Hour ID is required.");
    }
    await import_prisma.default.restauranthour.delete({
      where: { id: input.hour_id }
    });
    return { success: true };
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createHourRecord,
  deleteHourRecord,
  getBusinessProfile,
  updateBusinessIdentity,
  updateHourRecord
});
