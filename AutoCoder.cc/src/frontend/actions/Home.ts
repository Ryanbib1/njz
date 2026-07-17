'use server'

import prisma from '@/tools/prisma'
import { withResult } from '@/frontend/action_utils'
import type {
  GetRestaurantProfileInput,
  GetRestaurantProfileOutput,
  WeekdayKey,
  HighlightsJson
} from '@/frontend/types/Home'

const WEEKDAY_ORDER: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const getRestaurantProfile = withResult(
  async (input: GetRestaurantProfileInput): Promise<GetRestaurantProfileOutput> => {
    // 1. 查询系统中的 canonical restaurant，并关联带出相关信息
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        photos: true,
        reviews: true,
        hours: true,
      },
    });

    // 2. 若不存在抛出异常
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // 3. 将 photos 按 sortOrder 升序排序
    const sortedPhotos = [...restaurant.photos].sort((a, b) => a.sortOrder - b.sortOrder);

    // 4. 将 hours 按照固定星期顺序排序
    const sortedHours = [...restaurant.hours].sort((a, b) => {
      const weightA = WEEKDAY_ORDER[a.weekday] || 99;
      const weightB = WEEKDAY_ORDER[b.weekday] || 99;
      return weightA - weightB;
    });

    // 安全处理 highlights JSON 数据
    const safeHighlights = Array.isArray(restaurant.highlights)
      ? (restaurant.highlights as unknown as HighlightsJson)
      : [];

    // 5 & 6. 数据转换并返回完整结构
    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      rating: restaurant.rating ? restaurant.rating.toNumber() : 0,
      reviewCount: restaurant.reviewCount,
      brandStory: restaurant.brandStory,
      highlights: safeHighlights,
      photos: sortedPhotos.map((photo) => ({
        id: photo.id,
        imageUrl: photo.imageUrl,
        alt: photo.alt,
        description: photo.description,
        sortOrder: photo.sortOrder,
      })),
      reviews: restaurant.reviews.map((review) => ({
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        relativeTime: review.relativeTime,
        content: review.content,
      })),
      hours: sortedHours.map((hour) => ({
        id: hour.id,
        weekday: hour.weekday as WeekdayKey,
        fullLine: hour.fullLine,
      })),
    };
  }
);