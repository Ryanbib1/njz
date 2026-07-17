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

// src/backend/actions/AdminRegister.ts
var AdminRegister_exports = {};
__export(AdminRegister_exports, {
  registerAdmin: () => registerAdmin
});
module.exports = __toCommonJS(AdminRegister_exports);
var import_prisma = __toESM(require_prisma());
var import_action_utils = __toESM(require_action_utils());
var registerAdmin = (0, import_action_utils.withResult)(async (input) => {
  if (!input.member_account?.trim()) {
    throw new Error("Account username is required.");
  }
  if (!input.member_email?.trim()) {
    throw new Error("Email address is required.");
  }
  if (!input.member_password) {
    throw new Error("Password is required.");
  }
  const existingAccount = await import_prisma.default.member.findUnique({
    where: { account: input.member_account.trim() }
  });
  if (existingAccount) {
    throw new Error("Account username already exists. Please choose a different one.");
  }
  const existingEmail = await import_prisma.default.member.findUnique({
    where: { email: input.member_email.trim() }
  });
  if (existingEmail) {
    throw new Error("Email address already exists. Please use a different email.");
  }
  const hashedPassword = (0, import_action_utils.hashPassword)(input.member_password);
  const now = /* @__PURE__ */ new Date();
  const newMember = await import_prisma.default.member.create({
    data: {
      account: input.member_account.trim(),
      email: input.member_email.trim(),
      password: hashedPassword,
      role: import_action_utils.UserRole.ADMIN,
      // Cast to any to bypass strict Prisma Client enum typing, mapped correctly to DB ENUM 'ADMIN'
      createdAt: now,
      updatedAt: now
    }
  });
  return {
    member: {
      member_id: newMember.id,
      member_account: newMember.account,
      member_email: newMember.email
    }
  };
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerAdmin
});
