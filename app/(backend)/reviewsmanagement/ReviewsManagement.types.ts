'use server'

// ===== Enums =====
/** Review Match Status: Matched fixed source(MATCHED) | Mismatched fixed source(MISMATCHED) | Missing record(MISSING) */
export type ReviewMatchStatus = 'MATCHED' | 'MISMATCHED' | 'MISSING'

// ===== Data Structures =====
export interface ReviewSlotItem {
  review_id: string | null        // data-from: restaurantreview-id
  review_slot: number             // data-from: restaurantreview-reviewSlot
  author_name: string | null      // data-from: restaurantreview-authorName
  rating: number | null           // data-from: restaurantreview-rating
  relative_time: string | null    // data-from: restaurantreview-relativeTime
  content: string | null          // data-from: restaurantreview-content
  match_status: ReviewMatchStatus // aggregated
  is_present: boolean             // aggregated
}

// ===== Input / Output =====
export interface GetReviewsListInput {}

export interface GetReviewsListOutput {
  list: ReviewSlotItem[]
  present_count: number
  total_slots: number
}

export interface GetReviewDetailInput {
  review_slot: number
}

export interface GetReviewDetailOutput {
  review: ReviewSlotItem
}

export interface CreateReviewInput {
  review_slot: number
  author_name: string
  rating: number
  relative_time: string
  content: string
}

export interface CreateReviewOutput {
  review_id: string
}

export interface UpdateReviewInput {
  review_id: string
  author_name: string
  rating: number
  relative_time: string
  content: string
}

export interface UpdateReviewOutput {
  success: boolean
}

export interface DeleteReviewInput {
  review_id: string
}

export interface DeleteReviewOutput {
  success: boolean
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import {
  requireRole,
  withResult,
  UserRole
} from '@/backend/action_utils'

// ===== Fixed Application-Level Constants =====
/**
 * Fixed source for review verification.
 * The system strictly manages 5 fixed review slots.
 */
const REFERENCE_REVIEWS: Record<number, { authorName: string, rating: number, relativeTime: string, content: string }> = {
  1: {
    authorName: "Alex M.",
    rating: 5,
    relativeTime: "a month ago",
    content: "Absolutely fantastic Italian dining experience! The pizza was authentic, and the prefix lunch menu is a steal."
  },
  2: {
    authorName: "Sarah J.",
    rating: 5,
    relativeTime: "3 months ago",
    content: "Best sparkling juice I've ever had. The ambiance is perfect for a date night. Will definitely come back."
  },
  3: {
    authorName: "David L.",
    rating: 4,
    relativeTime: "2 weeks ago",
    content: "Great food and excellent service. The only downside was finding parking nearby, but the meal made up for it."
  },
  4: {
    authorName: "Emily C.",
    rating: 5,
    relativeTime: "4 months ago",
    content: "Tavola never disappoints. Every dish feels like it's made with love. Highly recommend the truffle pasta."
  },
  5: {
    authorName: "Michael R.",
    rating: 4,
    relativeTime: "a week ago",
    content: "Solid Italian place in the city. The staff was attentive and the desserts were to die for."
  }
}

// ===== Helper Functions =====
function checkMatchStatus(slot: number, record: { authorName: string, rating: number, relativeTime: string, content: string }): ReviewMatchStatus {
  const ref = REFERENCE_REVIEWS[slot]
  if (!ref) return 'MISMATCHED' // Should not happen for slots 1-5, but safe fallback

  const isMatched = 
    record.authorName === ref.authorName &&
    record.rating === ref.rating &&
    record.relativeTime === ref.relativeTime &&
    record.content === ref.content // verbatim check

  return isMatched ? 'MATCHED' : 'MISMATCHED'
}

async function getCanonicalRestaurantId(): Promise<string> {
  const restaurant = await prisma.restaurant.findFirst()
  if (!restaurant) {
    throw new Error("The canonical restaurant record does not exist. Please configure business information first.")
  }
  return restaurant.id
}

// ===== Actions =====

export const getReviewsList = requireRole([UserRole.ADMIN])(
  withResult(async (_input: GetReviewsListInput = {}): Promise<GetReviewsListOutput> => {
    const restaurantId = await getCanonicalRestaurantId()

    const dbReviews = await prisma.restaurantreview.findMany({
      where: { restaurantId }
    })

    const list: ReviewSlotItem[] = []
    let presentCount = 0

    // Strictly loop through the 5 fixed slots
    for (let i = 1; i <= 5; i++) {
      const review = dbReviews.find(r => r.reviewSlot === i)
      
      if (review) {
        presentCount++
        list.push({
          review_id: review.id,
          review_slot: review.reviewSlot,
          author_name: review.authorName,
          rating: review.rating,
          relative_time: review.relativeTime,
          content: review.content,
          match_status: checkMatchStatus(i, review),
          is_present: true
        })
      } else {
        list.push({
          review_id: null,
          review_slot: i,
          author_name: null,
          rating: null,
          relative_time: null,
          content: null,
          match_status: 'MISSING',
          is_present: false
        })
      }
    }

    return {
      list,
      present_count: presentCount,
      total_slots: 5
    }
  })
)

export const getReviewDetail = requireRole([UserRole.ADMIN])(
  withResult(async (input: GetReviewDetailInput): Promise<GetReviewDetailOutput> => {
    if (input.review_slot < 1 || input.review_slot > 5) {
      throw new Error("Invalid review slot. Allowed slots are 1 through 5.")
    }

    const restaurantId = await getCanonicalRestaurantId()

    const review = await prisma.restaurantreview.findUnique({
      where: { reviewSlot: input.review_slot }
    })

    if (!review || review.restaurantId !== restaurantId) {
      return {
        review: {
          review_id: null,
          review_slot: input.review_slot,
          author_name: null,
          rating: null,
          relative_time: null,
          content: null,
          match_status: 'MISSING',
          is_present: false
        }
      }
    }

    return {
      review: {
        review_id: review.id,
        review_slot: review.reviewSlot,
        author_name: review.authorName,
        rating: review.rating,
        relative_time: review.relativeTime,
        content: review.content,
        match_status: checkMatchStatus(review.reviewSlot, review),
        is_present: true
      }
    }
  })
)

export const createReview = requireRole([UserRole.ADMIN])(
  withResult(async (input: CreateReviewInput): Promise<CreateReviewOutput> => {
    if (input.review_slot < 1 || input.review_slot > 5) {
      throw new Error("Invalid review slot. Allowed slots are 1 through 5.")
    }

    if (!input.author_name || !input.relative_time || !input.content || input.rating == null) {
      throw new Error("All fields (author name, rating, relative time, content) are required.")
    }

    const restaurantId = await getCanonicalRestaurantId()

    // Check if it already exists
    const existing = await prisma.restaurantreview.findUnique({
      where: { reviewSlot: input.review_slot }
    })

    if (existing) {
      throw new Error("This review slot is already present. Please use the update function instead.")
    }

    const newReview = await prisma.restaurantreview.create({
      data: {
        restaurantId: restaurantId,
        reviewSlot: input.review_slot,
        authorName: input.author_name,
        rating: input.rating,
        relativeTime: input.relative_time,
        content: input.content,
        updatedAt: new Date() // Explicitly write updated time
      }
    })

    return { review_id: newReview.id }
  })
)

export const updateReview = requireRole([UserRole.ADMIN])(
  withResult(async (input: UpdateReviewInput): Promise<UpdateReviewOutput> => {
    if (!input.review_id) {
      throw new Error("Review ID is required for updating.")
    }
    
    if (!input.author_name || !input.relative_time || !input.content || input.rating == null) {
      throw new Error("All fields (author name, rating, relative time, content) are required.")
    }

    // Check existence
    const existing = await prisma.restaurantreview.findUnique({
      where: { id: input.review_id }
    })

    if (!existing) {
      throw new Error("The target review record does not exist.")
    }

    await prisma.restaurantreview.update({
      where: { id: input.review_id },
      data: {
        authorName: input.author_name,
        rating: input.rating,
        relativeTime: input.relative_time,
        content: input.content, // Verbatim save, no formatting/trimming
        updatedAt: new Date()   // Explicitly write updated time
      }
    })

    return { success: true }
  })
)

export const deleteReview = requireRole([UserRole.ADMIN])(
  withResult(async (input: DeleteReviewInput): Promise<DeleteReviewOutput> => {
    if (!input.review_id) {
      throw new Error("Review ID is required for deletion.")
    }

    const existing = await prisma.restaurantreview.findUnique({
      where: { id: input.review_id }
    })

    if (!existing) {
      throw new Error("The target review record does not exist.")
    }

    await prisma.restaurantreview.delete({
      where: { id: input.review_id }
    })

    // Note: domain_constraints dictate that restaurant.reviewCount is NOT updated when a review is deleted.
    
    return { success: true }
  })
)
