'use client'

import { useRouter } from 'next/navigation'
import { useAdminSession } from '@/tools/BackendSession'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { create } from 'zustand'

/**
 * Admin Authentication Configuration
 * Adapted for: en-US
 * Style: Vintage Elegant (Cormorant Garamond / Inter / Playfair Display)
 */

// Login Route
const LOGIN_ROUTE = '/adminlogin'

// Auth Dialog State Management
interface AuthDialogState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useAuthDialog = create<AuthDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))

/**
 * Get current Token from session
 */
export function getToken(): string | null {
  const session = useAdminSession.getState()
  return session.token || null
}

/**
 * Clear authentication state (Session Reset)
 */
export function clearAuth(): void {
  useAdminSession.getState().reset()
}

/**
 * Handle 401 Unauthorized status
 * Logic: Clear cache and trigger the global dialog
 * Exception: Do not trigger if already on the login page
 */
export function handleUnauthorized(): void {
  clearAuth()
  
  // Prevent dialog if currently on the login page
  if (typeof window !== 'undefined' && window.location.pathname.includes(LOGIN_ROUTE)) {
    return
  }
  
  useAuthDialog.getState().open()
}

/**
 * AuthExpiredDialog Component
 * Mounted in the layout to handle session expiration global notifications.
 * Style follows the theme: sharp corners (radius-lg: 0px), primary colors, and serif headers.
 */
export function AuthExpiredDialog() {
  const router = useRouter()
  const { isOpen, close } = useAuthDialog()

  const handleLogin = () => {
    close()
    router.push(LOGIN_ROUTE)
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent 
        className="fixed bottom-4 right-4 left-auto top-auto translate-x-0 translate-y-0 w-[calc(100%-2rem)] max-w-[400px] border-border bg-background shadow-md rounded-none font-body"
      >
        <DialogHeader>
          <DialogTitle className="font-header text-2xl text-foreground">
            Initialize Login Account
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Your session has expired or is invalid. Please log in with a test account to continue experiencing the features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-row justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={close}
            className="rounded-none border-border text-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Later
          </Button>
          <Button 
            onClick={handleLogin}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}