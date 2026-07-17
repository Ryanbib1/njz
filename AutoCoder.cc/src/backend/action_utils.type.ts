/**
 * Authentication Type Definitions
 * Platform: backend
 */

// ===== Enum Definitions =====
export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN'
}

// ===== Type Definitions =====
export interface AuthContext {
  userId: string // Based on member.id (UUID)
  account: string
  email: string
  role: UserRole
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends Error {
  readonly statusCode = 401
  constructor(message = 'Unauthorized: Please log in to continue.') {
    super(message)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends Error {
  readonly statusCode = 403
  constructor(message = 'Forbidden: You do not have sufficient permissions to perform this action.') {
    super(message)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

// ===== Authentication Method Signatures =====

/**
 * Wrapper to enforce authentication
 */
export declare function requireAuth(): <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) => (...args: TArgs) => Promise<TReturn>;

/**
 * Wrapper to enforce specific roles
 * @param roles Supports enum values, arrays, or strings
 */
export declare function requireRole(
  roles: UserRole | UserRole[] | string | string[]
): <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) => (...args: TArgs) => Promise<TReturn>;

/**
 * Get current request's authentication context
 */
export declare function getAuthContext(): AuthContext

/**
 * Get current logged-in user ID
 */
export declare function getUserId(): string

/**
 * Get current logged-in user role
 */
export declare function getRole(): UserRole

/**
 * Sign JWT Token
 * @param userId User ID (UUID)
 * @param role User Role string
 * @param expiresIn Expiration time, defaults to '7d'
 */
export declare function signToken(
  userId: string,
  role: string,
  expiresIn?: string
): Promise<string>

/**
 * Password Hashing
 * @param password Plain text password
 * @returns Hashed password string
 */
export declare function hashPassword(password: string): string

/**
 * Attempt to get current authentication context without throwing
 * @returns AuthContext if logged in, null otherwise
 */
export declare function tryGetAuthContext(): AuthContext | null

/**
 * Standard Response Wrapper
 * Handles try-catch automatically and provides consistent return types.
 * 
 * @example
 * export const deleteRestaurant = requireRole(UserRole.ADMIN)(
 *   withResult(async (id: string) => {
 *     await prisma.restaurant.delete({ where: { id } })
 *     return { success: true }
 *   })
 * )
 *
 * @example
 * export const createReview = requireAuth()(
 *   withResult(async (input: { restaurantId: string, authorName: string, rating: number, content: string }) => {
 *     const review = await prisma.restaurantreview.create({
 *       data: {
 *         restaurant: { connect: { id: input.restaurantId } },
 *         reviewSlot: Math.floor(Math.random() * 1000), // Example logic
 *         authorName: input.authorName,
 *         rating: input.rating,
 *         relativeTime: 'Just now',
 *         content: input.content,
 *       }
 *     })
 *     return { id: review.id }
 *   })
 * )
 */
export declare function withResult<TArgs extends any[], TData>(
  fn: (...args: TArgs) => Promise<TData>
): (
  ...args: TArgs
) => Promise<TData>