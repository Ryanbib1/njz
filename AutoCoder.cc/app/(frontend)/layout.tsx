'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navigation from '@/components/layout/frontend/Navigation'
import Footer from '@/components/layout/frontend/Footer'
import FrontendAuthGuard from '@/tools/FrontendAuthGuard'
import { PageErrorBoundary } from '@/default/NextPageErrorBoundary'

import '@/index.css'
import './theme-style.css'
import { AuthExpiredDialog } from '@/frontend/auth/rpc-auth'



// 不需要导航栏和页脚的路径白名单（模板，后续可修改）
const FULLSCREEN_PATHS = ['/login', '/register']

interface RootLayoutProps {
  children: React.ReactNode
}

export default function FrontendLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const handleGoBack = () => router.back()
  const isFullscreen = FULLSCREEN_PATHS.some((p) => pathname.startsWith(p))

  return (
    <FrontendAuthGuard>
      <div
        className={`font-sans min-h-screen`}
      >
        <AuthExpiredDialog />
        {isFullscreen ? (
          <div className="flex-1">
            <PageErrorBoundary key={pathname} onGoBack={handleGoBack}>{children}</PageErrorBoundary>
          </div>
        ) : (
          <>
            <Navigation />
            <PageErrorBoundary key={pathname} onGoBack={handleGoBack}>{children}</PageErrorBoundary>
            <Footer />
          </>
        )}
      </div>
    </FrontendAuthGuard>
  )
}
