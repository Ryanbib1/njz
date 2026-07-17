/**
 * Auth context type definition file
 * Platform: app
 * 
 * This project does not have a login page, so user authentication is not required.
 * Only the withResult wrapper is retained.
 */


/**
 * Standard response wrapper
 * Automatically handles try-catch and serves as the entry point for Server Actions.
 * 
 * @example
 * export const createRestaurant = withResult(async (input: { name: string; address: string; phone: string }) => {
 *   const restaurant = await prisma.restaurant.create({
 *     data: {
 *       name: input.name,
 *       address: input.address,
 *       phone: input.phone,
 *       website: "",
 *       rating: 0,
 *       reviewCount: 0,
 *       brandStory: "",
 *       highlights: [],
 *     }
 *   })
 *   return restaurant
 * })
 *
 * @example
 * export const addRestaurantReview = withResult(async (input: { restaurantId: string; authorName: string; rating: number; content: string }) => {
 *   const review = await prisma.restaurantreview.create({
 *     data: {
 *       restaurant: { connect: { id: input.restaurantId } },
 *       reviewSlot: 1, // Logic for slot determination goes here
 *       authorName: input.authorName,
 *       rating: input.rating,
 *       relativeTime: "Just now",
 *       content: input.content,
 *     }
 *   })
 *   return review
 * })
 */
export declare function withResult<TArgs extends any[], TData>(
  fn: (...args: TArgs) => Promise<TData>
): (...args: TArgs) => Promise<TData>