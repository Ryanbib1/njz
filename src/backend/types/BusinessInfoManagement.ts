'use server'

// ===== Enums =====
/** Match Status: MATCHED | MISMATCHED */
export type MatchStatus = 'MATCHED' | 'MISMATCHED'

/** Record Status: PRESENT | MISSING */
export type RecordStatus = 'PRESENT' | 'MISSING'

/** Weekday Key: MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY | SATURDAY | SUNDAY */
export type WeekdayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'


// ===== Data Structures =====
export interface BusinessIdentityInfo {
  restaurant_id: string          // data-from: restaurant-id
  restaurant_name: string        // data-from: restaurant-name
  restaurant_address: string     // data-from: restaurant-address
  restaurant_phone: string       // data-from: restaurant-phone
  restaurant_website: string     // data-from: restaurant-website
  restaurant_rating: number      // data-from: restaurant-rating
  restaurant_reviewCount: number // data-from: restaurant-reviewCount
}

export interface BusinessIdentitySource {
  source_name: string            // aggregated
  source_address: string         // aggregated
  source_phone: string           // aggregated
  source_website: string         // aggregated
  source_rating: number          // aggregated
  source_reviewCount: number     // aggregated
}

export interface BusinessIdentityValidation {
  name_status: MatchStatus       // aggregated
  address_status: MatchStatus    // aggregated
  phone_status: MatchStatus      // aggregated
  website_status: MatchStatus    // aggregated
  rating_status: MatchStatus     // aggregated
  reviewCount_status: MatchStatus// aggregated
}

export interface HoursRecord {
  hour_id: string | null               // data-from: restauranthour-id
  hour_weekday: WeekdayKey             // data-from: restauranthour-weekday
  hour_fullLine: string | null         // data-from: restauranthour-fullLine
  hour_recordStatus: RecordStatus      // aggregated
  hour_matchStatus: MatchStatus | null // aggregated
  hour_sourceFullLine: string          // aggregated
}


// ===== Input / Output =====
export interface GetBusinessProfileOutput {
  identity_info: BusinessIdentityInfo
  identity_source: BusinessIdentitySource
  identity_validation: BusinessIdentityValidation
  hours_records: HoursRecord[]
  is_dataset_complete: boolean     // aggregated
  last_system_update: string       // aggregated
}

export interface UpdateBusinessIdentityInput {
  restaurant_id: string
  restaurant_name: string
  restaurant_address: string
  restaurant_phone: string
  restaurant_website: string
  restaurant_rating: number
  restaurant_reviewCount: number
}

export interface UpdateBusinessIdentityOutput {
  success: boolean
}

export interface CreateHourRecordInput {
  restaurant_id: string
  hour_weekday: string
  hour_fullLine: string
}

export interface CreateHourRecordOutput {
  hour_id: string
}

export interface UpdateHourRecordInput {
  hour_id: string
  hour_fullLine: string
}

export interface UpdateHourRecordOutput {
  success: boolean
}

export interface DeleteHourRecordInput {
  hour_id: string
}

export interface DeleteHourRecordOutput {
  success: boolean
}


// ===== Imports =====
import prisma from '@/tools/prisma'
import {
  requireRole,
  withResult,
  UserRole
} from '@/backend/action_utils'


// ===== Constants (Fixed Data Sources for Comparison) =====
const WEEKDAYS: WeekdayKey[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
]

const FIXED_IDENTITY_SOURCE: BusinessIdentitySource = {
  source_name: "Tavola Italian Dining",
  source_address: "2nd Floor, The Grand Summit, Section B, 19 Dongfang East Road, Chaoyang District, Beijing",
  source_phone: "010-8532 5068",
  source_website: "http://www.tavola.cn/",
  source_rating: 4.8,
  source_reviewCount: 59,
}

const FIXED_HOURS_SOURCE: Record<WeekdayKey, string> = {
  MONDAY: "Monday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  TUESDAY: "Tuesday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  WEDNESDAY: "Wednesday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  THURSDAY: "Thursday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  FRIDAY: "Friday: 11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM",
  SATURDAY: "Saturday: 11:30 AM - 10:00 PM",
  SUNDAY: "Sunday: 11:30 AM - 10:00 PM",
}


// ===== Actions =====

/**
 * Retrieves the complete business profile, hours, and validates against the fixed source.
 */
export const getBusinessProfile = requireRole([UserRole.ADMIN])(
  withResult(async (): Promise<GetBusinessProfileOutput> => {
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        hours: true
      }
    })

    if (!restaurant) {
      throw new Error('Canonical restaurant record not found in the database.')
    }

    const currentRating = restaurant.rating?.toNumber() || 0

    // Identity Info
    const identity_info: BusinessIdentityInfo = {
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      restaurant_address: restaurant.address,
      restaurant_phone: restaurant.phone,
      restaurant_website: restaurant.website,
      restaurant_rating: currentRating,
      restaurant_reviewCount: restaurant.reviewCount,
    }

    // Identity Validation
    const identity_validation: BusinessIdentityValidation = {
      name_status: identity_info.restaurant_name === FIXED_IDENTITY_SOURCE.source_name ? 'MATCHED' : 'MISMATCHED',
      address_status: identity_info.restaurant_address === FIXED_IDENTITY_SOURCE.source_address ? 'MATCHED' : 'MISMATCHED',
      phone_status: identity_info.restaurant_phone === FIXED_IDENTITY_SOURCE.source_phone ? 'MATCHED' : 'MISMATCHED',
      website_status: identity_info.restaurant_website === FIXED_IDENTITY_SOURCE.source_website ? 'MATCHED' : 'MISMATCHED',
      rating_status: identity_info.restaurant_rating === FIXED_IDENTITY_SOURCE.source_rating ? 'MATCHED' : 'MISMATCHED',
      reviewCount_status: identity_info.restaurant_reviewCount === FIXED_IDENTITY_SOURCE.source_reviewCount ? 'MATCHED' : 'MISMATCHED',
    }

    // Hours Records (Mapped strictly in Monday-to-Sunday order)
    const hours_records: HoursRecord[] = WEEKDAYS.map(weekday => {
      const dbHour = restaurant.hours.find(h => (h.weekday as string).toUpperCase() === weekday)
      const sourceLine = FIXED_HOURS_SOURCE[weekday]

      if (dbHour) {
        return {
          hour_id: dbHour.id,
          hour_weekday: weekday,
          hour_fullLine: dbHour.fullLine,
          hour_recordStatus: 'PRESENT',
          hour_matchStatus: dbHour.fullLine === sourceLine ? 'MATCHED' : 'MISMATCHED',
          hour_sourceFullLine: sourceLine
        }
      } else {
        return {
          hour_id: null,
          hour_weekday: weekday,
          hour_fullLine: null,
          hour_recordStatus: 'MISSING',
          hour_matchStatus: null,
          hour_sourceFullLine: sourceLine
        }
      }
    })

    const is_dataset_complete = hours_records.every(h => h.hour_recordStatus === 'PRESENT')

    // Find the latest update timestamp across the restaurant and its hours
    const allUpdateDates = [
      restaurant.updatedAt.getTime(),
      ...restaurant.hours.map(h => h.updatedAt.getTime())
    ]
    const last_system_update = new Date(Math.max(...allUpdateDates)).toISOString()

    return {
      identity_info,
      identity_source: FIXED_IDENTITY_SOURCE,
      identity_validation,
      hours_records,
      is_dataset_complete,
      last_system_update
    }
  })
)


/**
 * Updates the canonical business identity fields.
 */
export const updateBusinessIdentity = requireRole([UserRole.ADMIN])(
  withResult(async (input: UpdateBusinessIdentityInput): Promise<UpdateBusinessIdentityOutput> => {
    const {
      restaurant_id,
      restaurant_name,
      restaurant_address,
      restaurant_phone,
      restaurant_website,
      restaurant_rating,
      restaurant_reviewCount
    } = input

    if (
      !restaurant_id || !restaurant_name || !restaurant_address || 
      !restaurant_phone || !restaurant_website || 
      restaurant_rating === undefined || restaurant_reviewCount === undefined
    ) {
      throw new Error('All business identity fields are required.')
    }

    await prisma.restaurant.update({
      where: { id: restaurant_id },
      data: {
        name: restaurant_name,
        address: restaurant_address,
        phone: restaurant_phone,
        website: restaurant_website,
        rating: restaurant_rating,
        reviewCount: restaurant_reviewCount,
        updatedAt: new Date()
      }
    })

    return { success: true }
  })
)


/**
 * Creates a missing fixed weekday hours record.
 */
export const createHourRecord = requireRole([UserRole.ADMIN])(
  withResult(async (input: CreateHourRecordInput): Promise<CreateHourRecordOutput> => {
    if (!input.restaurant_id || !input.hour_weekday || !input.hour_fullLine) {
      throw new Error('Restaurant ID, weekday, and full line are required.')
    }

    const safeWeekday = input.hour_weekday.toUpperCase()
    
    if (!WEEKDAYS.includes(safeWeekday as WeekdayKey)) {
      throw new Error('Invalid weekday provided.')
    }

    const existing = await prisma.restauranthour.findFirst({
      where: { 
        restaurantId: input.restaurant_id,
        weekday: safeWeekday as any
      }
    })

    if (existing) {
      throw new Error('An hours record for this weekday already exists.')
    }

    const sortOrder = WEEKDAYS.indexOf(safeWeekday as WeekdayKey) + 1

    const newRecord = await prisma.restauranthour.create({
      data: {
        restaurantId: input.restaurant_id,
        weekday: safeWeekday as any,
        sortOrder,
        fullLine: input.hour_fullLine,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    })

    return { hour_id: newRecord.id }
  })
)


/**
 * Updates an existing hours record.
 */
export const updateHourRecord = requireRole([UserRole.ADMIN])(
  withResult(async (input: UpdateHourRecordInput): Promise<UpdateHourRecordOutput> => {
    if (!input.hour_id || !input.hour_fullLine) {
      throw new Error('Hour ID and full line are required.')
    }

    await prisma.restauranthour.update({
      where: { id: input.hour_id },
      data: {
        fullLine: input.hour_fullLine,
        updatedAt: new Date()
      }
    })

    return { success: true }
  })
)


/**
 * Deletes an existing hours record, returning its status to MISSING.
 */
export const deleteHourRecord = requireRole([UserRole.ADMIN])(
  withResult(async (input: DeleteHourRecordInput): Promise<DeleteHourRecordOutput> => {
    if (!input.hour_id) {
      throw new Error('Hour ID is required.')
    }

    await prisma.restauranthour.delete({
      where: { id: input.hour_id }
    })

    return { success: true }
  })
)