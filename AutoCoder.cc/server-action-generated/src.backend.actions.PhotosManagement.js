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

// src/backend/actions/PhotosManagement.ts
var PhotosManagement_exports = {};
__export(PhotosManagement_exports, {
  createPhoto: () => createPhoto,
  deletePhoto: () => deletePhoto,
  getPhotoDetail: () => getPhotoDetail,
  getPhotosList: () => getPhotosList,
  updatePhoto: () => updatePhoto
});
module.exports = __toCommonJS(PhotosManagement_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var FIXED_PHOTOS = {
  photo_01: { sortOrder: 1, alt: "Tavola Italian Dining", description: "Restaurant Front Entrance", imageUrl: "/images/photo_01.jpg" },
  photo_02: { sortOrder: 2, alt: "Dining Area", description: "Elegant Dining Area", imageUrl: "/images/photo_02.jpg" },
  photo_03: { sortOrder: 3, alt: "Wood Fired Oven", description: "Authentic Wood Fired Pizza Oven", imageUrl: "/images/photo_03.jpg" },
  photo_04: { sortOrder: 4, alt: "Pizza Margherita", description: "Freshly Baked Pizza Margherita", imageUrl: "/images/photo_04.jpg" },
  photo_05: { sortOrder: 5, alt: "Fresh Pasta", description: "Handmade Pasta Dish", imageUrl: "/images/photo_05.jpg" },
  photo_06: { sortOrder: 6, alt: "Wine Collection", description: "Extensive Italian Wine Selection", imageUrl: "/images/photo_06.jpg" },
  photo_07: { sortOrder: 7, alt: "Chef Preparing", description: "Executive Chef Preparing Meal", imageUrl: "/images/photo_07.jpg" },
  photo_08: { sortOrder: 8, alt: "Seafood Special", description: "Daily Fresh Seafood Special", imageUrl: "/images/photo_08.jpg" },
  photo_09: { sortOrder: 9, alt: "Tiramisu", description: "Classic Italian Tiramisu Dessert", imageUrl: "/images/photo_09.jpg" },
  photo_10: { sortOrder: 10, alt: "Cocktail Bar", description: "Signature Cocktail at the Bar", imageUrl: "/images/photo_10.jpg" }
};
var getPhotosList = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async () => {
    const restaurant = await import_prisma.default.restaurant.findFirst();
    if (!restaurant) {
      throw new Error("Canonical restaurant not found. Please ensure the system has been initialized.");
    }
    const photos = await import_prisma.default.restaurantphoto.findMany({
      where: { restaurantId: restaurant.id }
    });
    const photosMap = new Map(photos.map((p) => [p.photoKey, p]));
    const items = [];
    let presentCount = 0;
    let missingCount = 0;
    let matchedCount = 0;
    let mismatchedCount = 0;
    for (let i = 1; i <= 10; i++) {
      const key = `photo_${i.toString().padStart(2, "0")}`;
      const fixed = FIXED_PHOTOS[key];
      const record = photosMap.get(key);
      if (record) {
        presentCount++;
        const isMatched = record.alt === fixed.alt && record.description === fixed.description && record.imageUrl === fixed.imageUrl;
        if (isMatched) {
          matchedCount++;
        } else {
          mismatchedCount++;
        }
        items.push({
          id: record.id,
          photoKey: key,
          sortOrder: record.sortOrder,
          alt: record.alt,
          description: record.description,
          imageUrl: record.imageUrl,
          recordStatus: "PRESENT",
          matchStatus: isMatched ? "MATCHED" : "MISMATCHED",
          targetAlt: fixed.alt,
          targetDescription: fixed.description,
          targetImageUrl: fixed.imageUrl
        });
      } else {
        missingCount++;
        items.push({
          id: null,
          photoKey: key,
          sortOrder: fixed.sortOrder,
          alt: null,
          description: null,
          imageUrl: null,
          recordStatus: "MISSING",
          matchStatus: null,
          targetAlt: fixed.alt,
          targetDescription: fixed.description,
          targetImageUrl: fixed.imageUrl
        });
      }
    }
    return {
      items,
      totalSlots: 10,
      presentCount,
      missingCount,
      matchedCount,
      mismatchedCount
    };
  })
);
var getPhotoDetail = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const photo = await import_prisma.default.restaurantphoto.findUnique({
      where: { id: input.id }
    });
    if (!photo) {
      throw new Error("Photo record not found.");
    }
    return {
      id: photo.id,
      photoKey: photo.photoKey,
      sortOrder: photo.sortOrder,
      alt: photo.alt,
      description: photo.description,
      imageUrl: photo.imageUrl
    };
  })
);
var createPhoto = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const fixed = FIXED_PHOTOS[input.photoKey];
    if (!fixed) {
      throw new Error("Invalid photo slot. Creation is limited to the fixed slots photo_01 through photo_10.");
    }
    const { alt, description, imageUrl } = input;
    if (!alt || !description || !imageUrl) {
      throw new Error("Alt text, description, and image URL are required to maintain structural completeness.");
    }
    const restaurant = await import_prisma.default.restaurant.findFirst();
    if (!restaurant) {
      throw new Error("Canonical restaurant not found.");
    }
    const existing = await import_prisma.default.restaurantphoto.findUnique({
      where: { photoKey: input.photoKey }
    });
    if (existing) {
      throw new Error(`The slot ${input.photoKey} already exists.`);
    }
    const created = await import_prisma.default.restaurantphoto.create({
      data: {
        restaurantId: restaurant.id,
        photoKey: input.photoKey,
        sortOrder: fixed.sortOrder,
        alt: input.alt,
        description: input.description,
        imageUrl: input.imageUrl,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { id: created.id };
  })
);
var updatePhoto = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    const { id, alt, description, imageUrl } = input;
    if (!id) {
      throw new Error("Photo ID is required for updating.");
    }
    if (!alt || !description || !imageUrl) {
      throw new Error("Alt text, description, and image URL are required to maintain structural completeness.");
    }
    const existing = await import_prisma.default.restaurantphoto.findUnique({
      where: { id }
    });
    if (!existing) {
      throw new Error("Target photo record not found.");
    }
    await import_prisma.default.restaurantphoto.update({
      where: { id },
      data: {
        alt,
        description,
        imageUrl,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { success: true };
  })
);
var deletePhoto = (0, import_action_utils.requireRole)([import_action_utils.UserRole.ADMIN])(
  (0, import_action_utils.withResult)(async (input) => {
    if (!input.id) {
      throw new Error("Photo ID is required for deletion.");
    }
    const existing = await import_prisma.default.restaurantphoto.findUnique({
      where: { id: input.id }
    });
    if (!existing) {
      throw new Error("Target photo record not found.");
    }
    await import_prisma.default.restaurantphoto.delete({
      where: { id: input.id }
    });
    return { success: true };
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPhoto,
  deletePhoto,
  getPhotoDetail,
  getPhotosList,
  updatePhoto
});
