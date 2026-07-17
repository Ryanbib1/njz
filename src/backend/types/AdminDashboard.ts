// ===== Enums =====
export type WeekdayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// ===== Data Structures =====
export interface RestaurantBaseInfo {
  // data-from: restaurant-id
  id: string;
  // data-from: restaurant-name
  name: string;
  // data-from: restaurant-address
  address: string;
  // data-from: restaurant-phone
  phone: string;
  // data-from: restaurant-website
  website: string;
  // data-from: restaurant-rating
  rating: number;
  // data-from: restaurant-reviewCount
  reviewCount: number;
  // data-from: restaurant-brandStory
  brandStory: string;
}

export interface DashboardPhotoItem {
  // data-from: restaurantphoto-id
  id: string;
  // data-from: restaurantphoto-photoKey
  photoKey: string;
  // data-from: restaurantphoto-sortOrder
  sortOrder: number;
  // data-from: restaurantphoto-imageUrl
  imageUrl: string;
  // data-from: restaurantphoto-description
  description: string;
  // data-from: restaurantphoto-alt
  alt: string;
}

export interface DashboardReviewItem {
  // data-from: restaurantreview-id
  id: string;
  // data-from: restaurantreview-reviewSlot
  reviewSlot: number;
  // data-from: restaurantreview-authorName
  authorName: string;
  // data-from: restaurantreview-rating
  rating: number;
  // data-from: restaurantreview-relativeTime
  relativeTime: string;
  // data-from: restaurantreview-content
  content: string;
}

export interface DashboardHourItem {
  // data-from: restauranthour-id
  id: string;
  // data-from: restauranthour-weekday
  weekday: WeekdayKey;
  // data-from: restauranthour-sortOrder
  sortOrder: number;
  // data-from: restauranthour-fullLine
  fullLine: string;
}

export interface DashboardCounts {
  // 实时统计的照片记录数量
  activePhotosCount: number;
  // 实时统计的营业时间记录数量
  activeHoursCount: number;
  // 实时统计的评论记录数量
  activeReviewsCount: number;
}

// ===== Input =====
export interface UpdateRestaurantProfileInput {
  name: string;
  brandStory: string;
  phone: string;
  website: string;
  address: string;
}

export interface RemoveDashboardItemInput {
  id: string;
}

// ===== Output =====
export interface GetAdminDashboardDataOutput {
  restaurant: RestaurantBaseInfo | null;
  counts: DashboardCounts;
  photos: DashboardPhotoItem[];
  reviews: DashboardReviewItem[];
  hours: DashboardHourItem[];
}

// ===== Actions（declare function 签名 + JSDoc）=====

/**
 * @requires: ADMIN
 * @Prisma_Model: restaurant, restaurantphoto, restaurantreview, restauranthour
 * @Description: 获取后台仪表盘全景概览数据，包括餐厅基本信息、动态统计数量及展示列表（照片、评论、营业时间）。
 * @Steps:
 *   1. [前置查询]: 查询 canonical restaurant（通常为表中的唯一/第一条记录）。若不存在则返回 null 及空数据。
 *   2. [并发统计]: 并发查询 restaurantphoto, restaurantreview, restauranthour 的 count。
 *   3. [并发查询]: 获取最多10张根据 sortOrder 排序的照片，获取全部5个固定 reviewSlot 的评论，获取全部营业时间记录。
 *   4. [数据处理]: 对营业时间记录按 Monday-to-Sunday 固定顺序进行内存排序，禁止使用字母排序。
 *   5. [返回结果]: 组装并返回 GetAdminDashboardDataOutput 结构。
 */
export declare function getAdminDashboardData(): Promise<GetAdminDashboardDataOutput>;

/**
 * @requires: ADMIN
 * @Prisma_Model: restaurant
 * @Description: 更新规范餐厅（canonical restaurant）的基础资料信息。
 * @Steps:
 *   1. [前置校验]: 校验入参 name, brandStory, phone, website, address 均非空。
 *   2. [核心操作]: 使用 prisma.restaurant.findFirst 找到 canonical 记录，随后使用 update 更新对应字段，并强制更新 updatedAt 为当前时间。
 *   3. [返回结果]: 操作成功则直接返回。
 */
export declare function updateRestaurantProfile(input: UpdateRestaurantProfileInput): Promise<void>;

/**
 * @requires: ADMIN
 * @Prisma_Model: restaurantphoto
 * @Description: 从仪表盘快捷移除（物理删除）指定照片记录，删除后将变为缺失槽位状态。
 * @Steps:
 *   1. [核心操作]: 使用 prisma.restaurantphoto.delete 根据传入的 id 物理删除照片。
 *   2. [返回结果]: 操作成功则直接返回。
 */
export declare function removeDashboardPhoto(input: RemoveDashboardItemInput): Promise<void>;

/**
 * @requires: ADMIN
 * @Prisma_Model: restaurantreview
 * @Description: 从仪表盘快捷移除（物理删除）指定精选评论记录，删除后将变为缺失槽位状态。
 * @Steps:
 *   1. [核心操作]: 使用 prisma.restaurantreview.delete 根据传入的 id 物理删除评论。
 *   2. [返回结果]: 操作成功则直接返回。
 */
export declare function removeDashboardReview(input: RemoveDashboardItemInput): Promise<void>;