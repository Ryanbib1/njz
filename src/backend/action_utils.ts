import prisma from '@/tools/prisma'
// 导入导出 Part 1: 
// ===== 【必须】从 BaseActionFun 导入并 re-export，照抄不要改 =====
import {
  UnauthorizedError,
  ForbiddenError,
  authStorage,
  parseTokenBase,
  runWithAuth,
  signToken,
  hashPassword,
  withResult,
} from '@/@base/BaseActionFun'

export {
  UnauthorizedError,
  ForbiddenError,
  runWithAuth,
  authStorage,
  signToken,
  hashPassword,
  withResult,
}
// ===== 【必须】导入导出结束 =====

// 导入导出 Part 2: 
// 从 action_utils.type 导入 AuthContext + 所有定义的枚举类 并 re-export
import {
  UserRole,
  type AuthContext,
} from './action_utils.type'

export { UserRole }
export type { AuthContext }
// 导入导出 Part 2 end

// ===== 内部方法 =====

/**
 * Parse token and fetch user from database
 * COT Inference:
 * 1. UserRole enum (GUEST, ADMIN) matches the platform_role enum in the 'member' table.
 * 2. Querying 'member' table as it contains the necessary role-based access control.
 * 3. Selecting fields matching AuthContext: id, account, email, role.
 */
export async function parseToken(token: string): Promise<AuthContext | null> {
  const payload = await parseTokenBase(token)
  if (!payload) return null
  
  const user = await prisma.member.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      account: true,
      email: true,
      role: true,
    },
  })

  if (!user) return null

  return {
    userId: user.id,
    account: user.account,
    email: user.email,
    role: user.role as unknown as UserRole,
  }
}

// ===== 公共 API =====

/**
 * Wrapper to enforce authentication
 */
export function requireAuth() {
  return <TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>
  ) => {
    return async (...args: TArgs): Promise<TReturn> => {
      const ctx = authStorage.getStore() as AuthContext | undefined
      if (!ctx) throw new UnauthorizedError('Unauthorized: Please log in to continue.')
      return fn(...args)
    }
  }
}

/**
 * Wrapper to enforce specific roles
 */
export function requireRole(
  roles: UserRole | UserRole[] | string | string[]
) {
  return <TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>
  ) => {
    return async (...args: TArgs): Promise<TReturn> => {
      const ctx = authStorage.getStore() as AuthContext | undefined
      if (!ctx) throw new UnauthorizedError('Unauthorized: Please log in to continue.')

      const allowedRoles = Array.isArray(roles) ? roles : [roles]
      if (!allowedRoles.map(String).includes(String(ctx.role))) {
        throw new ForbiddenError('Forbidden: You do not have sufficient permissions to perform this action.')
      }

      return fn(...args)
    }
  }
}

/**
 * Get current request's authentication context
 */
export function getAuthContext(): AuthContext {
  const ctx = authStorage.getStore() as AuthContext | undefined
  if (!ctx) throw new UnauthorizedError('Unauthorized: Please log in to continue.')
  return ctx
}

/**
 * Get current logged-in user ID
 */
export function getUserId(): string {
  return getAuthContext().userId
}

/**
 * Get current logged-in user role
 */
export function getRole(): UserRole {
  return getAuthContext().role
}

/**
 * Attempt to get current authentication context without throwing
 */
export function tryGetAuthContext(): AuthContext | null {
  return (authStorage.getStore() as AuthContext | undefined) ?? null
}