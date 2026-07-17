/* 后端真实 Prisma Client */
/* 支持 Runtime 注入模式：优先使用 globalThis.__runtimePrisma */
import { PrismaClient } from '../../prisma-generated/client'

declare global {
  var __runtimePrisma: any
}

// 使用 Proxy 延迟获取，每次访问时检查 globalThis
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // 运行时检查，而不是打包时
    const client = globalThis.__runtimePrisma || (globalThis.__runtimePrisma = new PrismaClient())
    return (client as any)[prop]
  }
})

export default prisma
export { prisma }
