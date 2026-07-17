'use server'

// ===== Enums =====
// (No specific page-level enums required)

// ===== Data Structures =====
// (No shared data structures required for this login page)

// ===== Input / Output =====
export interface AdminLoginInput {
  member_account: string
  member_password: string
}

export interface AdminLoginOutput {
  token: string
  member_id: string      // data-from: member-id
  member_account: string // data-from: member-account
  member_role: string    // data-from: member-role
}

export interface CheckSessionOutput {
  is_logged_in: boolean
  member_role: string | null // data-from: member-role
}

// ===== Imports =====
import prisma from '@/tools/prisma'
import {
  tryGetAuthContext,
  withResult,
  hashPassword,
  signToken,
  UserRole
} from '@/backend/action_utils'

// ===== Actions =====

/**
 * Handle admin login, verify credentials and return token
 */
export const adminLogin = withResult(async (input: AdminLoginInput): Promise<AdminLoginOutput> => {
  if (!input.member_account || !input.member_password) {
    throw new Error('Account and password are required.')
  }

  const member = await prisma.member.findUnique({
    where: { account: input.member_account }
  })

  if (!member) {
    throw new Error('Invalid account or password.')
  }

  const hashedPassword = hashPassword(input.member_password)
  if (member.password !== hashedPassword) {
    throw new Error('Invalid account or password.')
  }

  if (member.role !== UserRole.ADMIN) {
    throw new Error('Insufficient permissions. Admin access required.')
  }

  const token = await signToken(member.id, member.role)

  return {
    token,
    member_id: member.id,
    member_account: member.account,
    member_role: member.role
  }
})

/**
 * Check if current user already has an active session
 * Used for redirecting to dashboard if already logged in
 */
export const checkCurrentSession = withResult(async (): Promise<CheckSessionOutput> => {
  const context = tryGetAuthContext()
  
  if (context) {
    return {
      is_logged_in: true,
      member_role: context.role
    }
  }

  return {
    is_logged_in: false,
    member_role: null
  }
})
