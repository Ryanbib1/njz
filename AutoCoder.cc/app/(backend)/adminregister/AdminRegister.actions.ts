'use server'

// ===== Enums =====
// (No page-specific enums needed, using UserRole from action_utils)

// ===== Data Structures =====
export interface MemberInfo {
  member_id: string      // data-from: member-id
  member_account: string // data-from: member-account
  member_email: string   // data-from: member-email
}

// ===== Input / Output =====
export interface RegisterAdminInput {
  member_account: string
  member_password: string
  member_email: string
}

export interface RegisterAdminOutput {
  member: MemberInfo
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import {
  withResult,
  hashPassword,
  UserRole
} from '@/backend/action_utils'

// ===== Actions =====

/**
 * Register a new ADMIN account
 * Public endpoint (GUEST access) for creating backend administrators.
 */
export const registerAdmin = withResult(async (input: RegisterAdminInput): Promise<RegisterAdminOutput> => {
  // 1. Validation & Uniqueness Checks
  if (!input.member_account?.trim()) {
    throw new Error('Account username is required.')
  }
  if (!input.member_email?.trim()) {
    throw new Error('Email address is required.')
  }
  if (!input.member_password) {
    throw new Error('Password is required.')
  }

  const existingAccount = await prisma.member.findUnique({
    where: { account: input.member_account.trim() }
  })
  if (existingAccount) {
    throw new Error('Account username already exists. Please choose a different one.')
  }

  const existingEmail = await prisma.member.findUnique({
    where: { email: input.member_email.trim() }
  })
  if (existingEmail) {
    throw new Error('Email address already exists. Please use a different email.')
  }

  // 2. Hash Password
  const hashedPassword = hashPassword(input.member_password)

  // 3. Create Admin Member (implicitly assigning ADMIN role and tracking creation time)
  const now = new Date()
  const newMember = await prisma.member.create({
    data: {
      account: input.member_account.trim(),
      email: input.member_email.trim(),
      password: hashedPassword,
      role: UserRole.ADMIN as any, // Cast to any to bypass strict Prisma Client enum typing, mapped correctly to DB ENUM 'ADMIN'
      createdAt: now,
      updatedAt: now
    }
  })

  // 4. Return Data Structure
  return {
    member: {
      member_id: newMember.id,
      member_account: newMember.account,
      member_email: newMember.email
    }
  }
})
