'use client'

/**
 * This project does not have a login page, so no authentication dialog is needed.
 * 本项目无登录页，不需要鉴权弹窗。
 */

/**
 * Gets the current user token.
 * Returns null as no authentication is implemented.
 */
export function getToken(): string | null {
  return null
}

/**
 * Clears authentication state.
 * No-op as no authentication is implemented.
 */
export function clearAuth(): void {}

/**
 * Handles unauthorized (401) responses.
 * No-op as no authentication is implemented.
 */
export function handleUnauthorized(): void {
  // No implementation needed for projects without login
}

/**
 * AuthExpiredDialog Component.
 * Returns null as no authentication dialog is required for this project.
 */
export function AuthExpiredDialog() {
  return null
}