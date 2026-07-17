/**
 * Authentication type definition file
 * Platform: frontend
 * 
 * This project has no login page, so user authentication is not required.
 * Only the withResult wrapper is retained for standardizing response handling.
 */

/**
 * Standard response wrapper
 * Automatically handles try-catch for Server Actions and standardizes the result.
 * 
 * @example
 * export const deleteRestaurant = withResult(async (id: string) => {
 *   await prisma.restaurant.delete({
 *     where: { id }
 *   })
 * })
 *
 * @example
 * // Note: In create/update data, if the Schema has a @relation definition for a FK,
 * // you must use the relationship syntax `xxx: { connect: { id } }` instead of assigning the scalar FK directly.
 * // Scalar FKs are acceptable in 'where' clauses.
 * export const addRestaurantPhoto = withResult(async (input: { restaurantId: string, imageUrl: string, photoKey: string, sortOrder: number, alt: string, description: string }) => {
 *   const photo = await prisma.restaurantphoto.create({
 *     data: {
 *       restaurant: { connect: { id: input.restaurantId } },
 *       imageUrl: input.imageUrl,
 *       photoKey: input.photoKey,
 *       sortOrder: input.sortOrder,
 *       alt: input.alt,
 *       description: input.description,
 *     }
 *   })
 *   return { id: photo.id }
 * })
 */
export declare function withResult<TArgs extends any[], TData>(
  fn: (...args: TArgs) => Promise<TData>
): (...args: TArgs) => Promise<TData>