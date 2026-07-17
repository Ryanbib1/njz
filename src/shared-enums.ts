/**
 * 枚举中心 — 从 prisma/schema.prisma 自动生成
 * 运行: npx tsx scripts/generate-schema-meta.ts
 * ⚠️ 请勿手动修改，schema 变更后重新生成
 */

export const platform_role = {
  GUEST: 'GUEST',
  ADMIN: 'ADMIN',
} as const
export type platform_roleType = typeof platform_role[keyof typeof platform_role]

export const weekday_key = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
} as const
export type weekday_keyType = typeof weekday_key[keyof typeof weekday_key]

/** 所有枚举名称列表 */
export const ALL_ENUMS = ['platform_role', 'weekday_key'] as const
