'use server'

import prisma from '@/tools/prisma'
import { requireRole, withResult, UserRole } from '@/backend/action_utils'
import type {
  GetAdminDashboardDataOutput,
  UpdateRestaurantProfileInput,
  RemoveDashboardItemInput,
  WeekdayKey
} from '@/backend/types/AdminDashboard'

/**
 * 获取后台仪表盘全景概览数据
 */
export const getAdminDashboardData = requireRole(UserRole.ADMIN)(
  withResult(async (): Promise<GetAdminDashboardDataOutput> => {
    // 1. [前置查询] 查询 canonical restaurant
    const restaurant = await prisma.restaurant.findFirst()

    if (!restaurant) {
      return {
        restaurant: null,
        counts: {
          activePhotosCount: 0,
          activeHoursCount: 0,
          activeReviewsCount: 0
        },
        photos: [],
        reviews: [],
        hours: []
      }
    }

    // 2 & 3. [并发统计]与[并发查询]
    const [
      activePhotosCount,
      activeHoursCount,
      activeReviewsCount,
      photosList,
      reviewsList,
      hoursList
    ] = await Promise.all([
      prisma.restaurantphoto.count({ where: { restaurantId: restaurant.id } }),
      prisma.restauranthour.count({ where: { restaurantId: restaurant.id } }),
      prisma.restaurantreview.count({ where: { restaurantId: restaurant.id } }),
      prisma.restaurantphoto.findMany({
        where: { restaurantId: restaurant.id },
        orderBy: { sortOrder: 'asc' },
        take: 10
      }),
      prisma.restaurantreview.findMany({
        where: { restaurantId: restaurant.id, reviewSlot: { in: [1, 2, 3, 4, 5] } },
        orderBy: { reviewSlot: 'asc' }
      }),
      prisma.restauranthour.findMany({
        where: { restaurantId: restaurant.id }
      })
    ])

    // 4. [数据处理] 营业时间按照 Monday-to-Sunday 顺序内存排序
    const weekdayOrder: Record<string, number> = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7
    }

    const sortedHours = hoursList
      .map(h => ({
        id: h.id,
        weekday: h.weekday as WeekdayKey,
        sortOrder: h.sortOrder,
        fullLine: h.fullLine
      }))
      .sort((a, b) => (weekdayOrder[a.weekday.toUpperCase()] || 99) - (weekdayOrder[b.weekday.toUpperCase()] || 99))

    // 5. [返回结果]
    return {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        website: restaurant.website,
        rating: restaurant.rating.toNumber(), // Decimal 安全转换
        reviewCount: restaurant.reviewCount,
        brandStory: restaurant.brandStory
      },
      counts: {
        activePhotosCount,
        activeHoursCount,
        activeReviewsCount
      },
      photos: photosList.map(p => ({
        id: p.id,
        photoKey: p.photoKey,
        sortOrder: p.sortOrder,
        imageUrl: p.imageUrl,
        description: p.description,
        alt: p.alt
      })),
      reviews: reviewsList.map(r => ({
        id: r.id,
        reviewSlot: r.reviewSlot,
        authorName: r.authorName,
        rating: r.rating,
        relativeTime: r.relativeTime,
        content: r.content
      })),
      hours: sortedHours
    }
  })
)

/**
 * 更新规范餐厅（canonical restaurant）的基础资料信息
 */
export const updateRestaurantProfile = requireRole(UserRole.ADMIN)(
  withResult(async (input: UpdateRestaurantProfileInput): Promise<void> => {
    const { name, brandStory, phone, website, address } = input

    // 1. [前置校验]
    if (!name?.trim() || !brandStory?.trim() || !phone?.trim() || !website?.trim() || !address?.trim()) {
      throw new Error('All required fields must be non-empty')
    }

    // 2. [核心操作] 查找 canonical 记录
    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      throw new Error('Canonical restaurant not found')
    }

    // 3. 更新对应字段，并强制更新 updatedAt
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: name.trim(),
        brandStory: brandStory.trim(),
        phone: phone.trim(),
        website: website.trim(),
        address: address.trim(),
        updatedAt: new Date()
      }
    })
  })
)

/**
 * 移除（物理删除）指定照片记录
 */
export const removeDashboardPhoto = requireRole(UserRole.ADMIN)(
  withResult(async (input: RemoveDashboardItemInput): Promise<void> => {
    if (!input.id) {
      throw new Error('Photo ID is required')
    }

    const photo = await prisma.restaurantphoto.findUnique({
      where: { id: input.id }
    })

    if (!photo) {
      throw new Error('Photo record not found')
    }

    await prisma.restaurantphoto.delete({
      where: { id: input.id }
    })
  })
)

/**
 * 移除（物理删除）指定精选评论记录
 */
export const removeDashboardReview = requireRole(UserRole.ADMIN)(
  withResult(async (input: RemoveDashboardItemInput): Promise<void> => {
    if (!input.id) {
      throw new Error('Review ID is required')
    }

    const review = await prisma.restaurantreview.findUnique({
      where: { id: input.id }
    })

    if (!review) {
      throw new Error('Review record not found')
    }

    await prisma.restaurantreview.delete({
      where: { id: input.id }
    })
  })
)