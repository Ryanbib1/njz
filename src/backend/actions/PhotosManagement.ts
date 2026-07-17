'use server'

// ===== Enums =====
/** Record Status: Present (PRESENT) | Missing (MISSING) */
export type RecordStatus = 'PRESENT' | 'MISSING'

/** Match Status: Matched (MATCHED) | Mismatched (MISMATCHED) */
export type MatchStatus = 'MATCHED' | 'MISMATCHED'

// ===== Data Structures =====
export interface PhotoSlotItem {
  id: string | null              // data-from: restaurantphoto-id
  photoKey: string               // data-from: restaurantphoto-photoKey
  sortOrder: number              // data-from: restaurantphoto-sortOrder
  alt: string | null             // data-from: restaurantphoto-alt
  description: string | null     // data-from: restaurantphoto-description
  imageUrl: string | null        // data-from: restaurantphoto-imageUrl
  recordStatus: RecordStatus     // aggregated
  matchStatus: MatchStatus | null // aggregated
  targetAlt: string              // aggregated
  targetDescription: string      // aggregated
  targetImageUrl: string         // aggregated
}

// ===== Input / Output =====
export interface GetPhotosListOutput {
  items: PhotoSlotItem[]
  totalSlots: number
  presentCount: number
  missingCount: number
  matchedCount: number
  mismatchedCount: number
}

export interface GetPhotoDetailInput {
  id: string
}

export interface GetPhotoDetailOutput {
  id: string
  photoKey: string
  sortOrder: number
  alt: string
  description: string
  imageUrl: string
}

export interface CreatePhotoInput {
  photoKey: string
  alt: string
  description: string
  imageUrl: string
}

export interface CreatePhotoOutput {
  id: string
}

export interface UpdatePhotoInput {
  id: string
  alt: string
  description: string
  imageUrl: string
}

export interface UpdatePhotoOutput {
  success: boolean
}

export interface DeletePhotoInput {
  id: string
}

export interface DeletePhotoOutput {
  success: boolean
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import {
  requireRole,
  withResult,
  UserRole
} from '@/backend/action_utils'

// ===== Fixed Reference Source =====
const FIXED_PHOTOS: Record<string, { sortOrder: number; alt: string; description: string; imageUrl: string }> = {
  photo_01: { sortOrder: 1, alt: 'Tavola Italian Dining', description: 'Restaurant Front Entrance', imageUrl: '/images/photo_01.jpg' },
  photo_02: { sortOrder: 2, alt: 'Dining Area', description: 'Elegant Dining Area', imageUrl: '/images/photo_02.jpg' },
  photo_03: { sortOrder: 3, alt: 'Wood Fired Oven', description: 'Authentic Wood Fired Pizza Oven', imageUrl: '/images/photo_03.jpg' },
  photo_04: { sortOrder: 4, alt: 'Pizza Margherita', description: 'Freshly Baked Pizza Margherita', imageUrl: '/images/photo_04.jpg' },
  photo_05: { sortOrder: 5, alt: 'Fresh Pasta', description: 'Handmade Pasta Dish', imageUrl: '/images/photo_05.jpg' },
  photo_06: { sortOrder: 6, alt: 'Wine Collection', description: 'Extensive Italian Wine Selection', imageUrl: '/images/photo_06.jpg' },
  photo_07: { sortOrder: 7, alt: 'Chef Preparing', description: 'Executive Chef Preparing Meal', imageUrl: '/images/photo_07.jpg' },
  photo_08: { sortOrder: 8, alt: 'Seafood Special', description: 'Daily Fresh Seafood Special', imageUrl: '/images/photo_08.jpg' },
  photo_09: { sortOrder: 9, alt: 'Tiramisu', description: 'Classic Italian Tiramisu Dessert', imageUrl: '/images/photo_09.jpg' },
  photo_10: { sortOrder: 10, alt: 'Cocktail Bar', description: 'Signature Cocktail at the Bar', imageUrl: '/images/photo_10.jpg' },
}

// ===== Actions =====

export const getPhotosList = requireRole([UserRole.ADMIN])(
  withResult(async (): Promise<GetPhotosListOutput> => {
    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      throw new Error('Canonical restaurant not found. Please ensure the system has been initialized.')
    }

    const photos = await prisma.restaurantphoto.findMany({
      where: { restaurantId: restaurant.id }
    })
    
    const photosMap = new Map(photos.map(p => [p.photoKey, p]))

    const items: PhotoSlotItem[] = []
    let presentCount = 0
    let missingCount = 0
    let matchedCount = 0
    let mismatchedCount = 0

    for (let i = 1; i <= 10; i++) {
      const key = `photo_${i.toString().padStart(2, '0')}`
      const fixed = FIXED_PHOTOS[key]
      const record = photosMap.get(key)

      if (record) {
        presentCount++
        const isMatched = 
          record.alt === fixed.alt && 
          record.description === fixed.description && 
          record.imageUrl === fixed.imageUrl
        
        if (isMatched) {
          matchedCount++
        } else {
          mismatchedCount++
        }

        items.push({
          id: record.id,
          photoKey: key,
          sortOrder: record.sortOrder,
          alt: record.alt,
          description: record.description,
          imageUrl: record.imageUrl,
          recordStatus: 'PRESENT',
          matchStatus: isMatched ? 'MATCHED' : 'MISMATCHED',
          targetAlt: fixed.alt,
          targetDescription: fixed.description,
          targetImageUrl: fixed.imageUrl
        })
      } else {
        missingCount++
        items.push({
          id: null,
          photoKey: key,
          sortOrder: fixed.sortOrder,
          alt: null,
          description: null,
          imageUrl: null,
          recordStatus: 'MISSING',
          matchStatus: null,
          targetAlt: fixed.alt,
          targetDescription: fixed.description,
          targetImageUrl: fixed.imageUrl
        })
      }
    }

    return {
      items,
      totalSlots: 10,
      presentCount,
      missingCount,
      matchedCount,
      mismatchedCount
    }
  })
)

export const getPhotoDetail = requireRole([UserRole.ADMIN])(
  withResult(async (input: GetPhotoDetailInput): Promise<GetPhotoDetailOutput> => {
    const photo = await prisma.restaurantphoto.findUnique({
      where: { id: input.id }
    })
    if (!photo) {
      throw new Error('Photo record not found.')
    }
    return {
      id: photo.id,
      photoKey: photo.photoKey,
      sortOrder: photo.sortOrder,
      alt: photo.alt,
      description: photo.description,
      imageUrl: photo.imageUrl
    }
  })
)

export const createPhoto = requireRole([UserRole.ADMIN])(
  withResult(async (input: CreatePhotoInput): Promise<CreatePhotoOutput> => {
    const fixed = FIXED_PHOTOS[input.photoKey]
    if (!fixed) {
      throw new Error('Invalid photo slot. Creation is limited to the fixed slots photo_01 through photo_10.')
    }
    
    const { alt, description, imageUrl } = input
    if (!alt || !description || !imageUrl) {
      throw new Error('Alt text, description, and image URL are required to maintain structural completeness.')
    }

    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      throw new Error('Canonical restaurant not found.')
    }

    const existing = await prisma.restaurantphoto.findUnique({
      where: { photoKey: input.photoKey }
    })
    if (existing) {
      throw new Error(`The slot ${input.photoKey} already exists.`)
    }

    const created = await prisma.restaurantphoto.create({
      data: {
        restaurantId: restaurant.id,
        photoKey: input.photoKey,
        sortOrder: fixed.sortOrder,
        alt: input.alt,
        description: input.description,
        imageUrl: input.imageUrl,
        updatedAt: new Date()
      }
    })

    return { id: created.id }
  })
)

export const updatePhoto = requireRole([UserRole.ADMIN])(
  withResult(async (input: UpdatePhotoInput): Promise<UpdatePhotoOutput> => {
    const { id, alt, description, imageUrl } = input
    
    if (!id) {
      throw new Error('Photo ID is required for updating.')
    }
    if (!alt || !description || !imageUrl) {
      throw new Error('Alt text, description, and image URL are required to maintain structural completeness.')
    }

    const existing = await prisma.restaurantphoto.findUnique({
      where: { id }
    })
    if (!existing) {
      throw new Error('Target photo record not found.')
    }

    await prisma.restaurantphoto.update({
      where: { id },
      data: {
        alt,
        description,
        imageUrl,
        updatedAt: new Date()
      }
    })

    return { success: true }
  })
)

export const deletePhoto = requireRole([UserRole.ADMIN])(
  withResult(async (input: DeletePhotoInput): Promise<DeletePhotoOutput> => {
    if (!input.id) {
      throw new Error('Photo ID is required for deletion.')
    }

    const existing = await prisma.restaurantphoto.findUnique({
      where: { id: input.id }
    })
    if (!existing) {
      throw new Error('Target photo record not found.')
    }

    await prisma.restaurantphoto.delete({
      where: { id: input.id }
    })

    return { success: true }
  })
)