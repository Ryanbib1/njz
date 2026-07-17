// ===== Enums =====
export type WeekdayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// ===== Data Structures =====
export type HighlightsJson = string[];

export interface RestaurantPhoto {
  id: string; // data-from: restaurantphoto-id
  imageUrl: string; // data-from: restaurantphoto-imageUrl
  alt: string; // data-from: restaurantphoto-alt
  description: string; // data-from: restaurantphoto-description
  sortOrder: number; // data-from: restaurantphoto-sortOrder
}

export interface RestaurantReview {
  id: string; // data-from: restaurantreview-id
  authorName: string; // data-from: restaurantreview-authorName
  rating: number; // data-from: restaurantreview-rating
  relativeTime: string; // data-from: restaurantreview-relativeTime
  content: string; // data-from: restaurantreview-content
}

export interface RestaurantHour {
  id: string; // data-from: restauranthour-id
  weekday: WeekdayKey; // data-from: restauranthour-weekday
  fullLine: string; // data-from: restauranthour-fullLine
}

// ===== Input =====
export interface GetRestaurantProfileInput {}

// ===== Output =====
export interface GetRestaurantProfileOutput {
  id: string; // data-from: restaurant-id
  name: string; // data-from: restaurant-name
  address: string; // data-from: restaurant-address
  phone: string; // data-from: restaurant-phone
  website: string; // data-from: restaurant-website
  rating: number; // data-from: restaurant-rating
  reviewCount: number; // data-from: restaurant-reviewCount
  brandStory: string; // data-from: restaurant-brandStory
  highlights: HighlightsJson; // data-from: restaurant-highlights | data-comment: {亮点列表，格式: ["prefix lunch menu","pizza","sparkling juice"]}
  photos: RestaurantPhoto[];
  reviews: RestaurantReview[];
  hours: RestaurantHour[];
}

// ===== Actions（declare function 签名 + JSDoc）=====
/**
 * @requires: GUEST
 * @Prisma_Model: restaurant
 * @Description: 获取前台展示的餐厅主页全部聚合信息
 * @Steps:
 *   1. 使用 prisma.restaurant.findFirst 查询系统中的 canonical restaurant 记录（使用 include 连表带出关联的 photos, reviews, hours）。
 *   2. 如果不存在餐厅记录，抛出异常。
 *   3. 若存在，将关联的 photos 按照 sortOrder 进行升序排序。
 *   4. 将关联的 hours 在应用层按照 'MONDAY' -> 'TUESDAY' -> 'WEDNESDAY' -> 'THURSDAY' -> 'FRIDAY' -> 'SATURDAY' -> 'SUNDAY' 的固定星期顺序进行排序。
 *   5. 将 Decimal 类型的 rating 转换为 number 类型。
 *   6. 返回组装符合 GetRestaurantProfileOutput 类型结构的完整数据。
 */
export declare function getRestaurantProfile(input: GetRestaurantProfileInput): Promise<GetRestaurantProfileOutput>;