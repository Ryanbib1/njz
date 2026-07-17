'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { GoogleIcon } from '@/components/thirdparty/GoogleIcon';
import EditableImg from '@/@base/EditableImg';
import type { AdminLoginState, AdminLoginHandlers } from '@/backend/hooks/useAdminLogin';
interface Props {
  state: AdminLoginState;
  handlers: AdminLoginHandlers;
}

/**
 * AdminLoginView - Editorial Hospitality Admin Style
 * Features:
 * - Single screen, strictly no-scroll layout.
 * - Dual-column editorial grid for desktop.
 * - Strict adherence to typography and color contrast.
 * - Precise architectural alignment.
 */
export const AdminLoginView = ({
  state,
  handlers
}: Props) => {
  // Session Checking State - Full screen centered loader
  if (state.isCheckingSession) {
    return <main className="h-screen w-full flex flex-col items-center justify-center bg-background text-muted-foreground font-body" data-api-unique-id="adminloginview-r5ee4985ad46e1e03-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" data-api-unique-id="adminloginview-r161ebb4660c543f0-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
        <span className="tracking-widest uppercase text-xs" data-api-unique-id="adminloginview-rdf3a3050e241e1ee-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">Authenticating Session</span>
      </main>;
  }
  return <main className="h-screen w-full bg-background overflow-hidden flex items-center justify-center" data-api-unique-id="adminloginview-r5653c141bb6a5f1f-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
      <section data-controller-name="Admin Login Access" className="w-full h-full flex flex-col items-center justify-center" data-api-unique-id="adminloginview-rfc90da53f398b50f-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
        <div className="container mx-auto px-8 py-8 flex items-center justify-center h-full" data-api-unique-id="adminloginview-rc5f35fcf25c1f86d-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
          {/* Main Editorial Card: Dual Pane Layout */}
          <div className="w-full max-w-5xl h-full max-h-[640px] flex flex-col lg:flex-row bg-card border border-border shadow-md rounded-none overflow-hidden" data-api-unique-id="adminloginview-r5e5938962423a3b6-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
            
            {/* Left Pane: Brand & Atmosphere (Hospitality View) */}
            <div className="hidden lg:flex relative w-1/2 h-full border-r border-border bg-muted flex-col justify-end p-12 overflow-hidden" data-api-unique-id="adminloginview-r586d8d6e708827f7-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
              <div className="absolute inset-0 z-0" data-api-unique-id="adminloginview-r4e8fb50c13860759-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                <EditableImg propKey="login-hero-bg" needLargeImage={true} description="Atmospheric Italian dining interior with warm lighting and elegant table settings" keywords="Italian restaurant interior luxury dining" className="w-full h-full object-cover grayscale-[0.2] brightness-75 hover:scale-105 transition-transform duration-1000" data-api-unique-id="adminloginview-r8d9d00f4f9a28093-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
              </div>
              <div className="relative z-10 space-y-2" data-api-unique-id="adminloginview-r8430a9766363332f-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                <h1 className="font-display text-4xl text-primary-foreground leading-tight" data-api-unique-id="adminloginview-rb4c7bc78d0dd7810-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                  Tavola <br data-api-unique-id="adminloginview-r7fb4d10db891d971-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" /> Italian Dining
                </h1>
                <p className="font-header text-lg text-primary-foreground/90 italic tracking-wide" data-api-unique-id="adminloginview-r09095cce98a36e89-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                  Management & Operations
                </p>
                <div className="w-12 h-px bg-primary-foreground/40 mt-6" data-api-unique-id="adminloginview-r8bc559443269d540-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
              </div>
            </div>

            {/* Right Pane: Functional Form (Admin View) */}
            <div className="flex-1 h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 bg-card" data-api-unique-id="adminloginview-r88f490ffd9f3288f-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
              <div className="w-full max-w-sm mx-auto space-y-10" data-api-unique-id="adminloginview-r6c4a06249c0ed4a3-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                
                {/* Header Section */}
                <div className="space-y-2" data-api-unique-id="adminloginview-r45fe9288c80e69a6-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                  <h2 className="font-display text-3xl text-foreground tracking-tight" data-api-unique-id="adminloginview-r09baa73212631ba3-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                    Admin Access
                  </h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed" data-api-unique-id="adminloginview-r9e5a904df4eae31a-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                    Authorized personnel only. Please enter your credentials to access the management dashboard.
                  </p>
                </div>

                {/* Credential Form */}
                <form onSubmit={handlers.handleSubmit} className="space-y-6" data-api-unique-id="adminloginview-r6448901a507f55ea-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                  <div className="space-y-4" data-api-unique-id="adminloginview-rc3d4b5793ac8c469-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                    <div className="space-y-2 group" data-api-unique-id="adminloginview-rd333e39d3584835a-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                      <Label htmlFor="account" className="font-body text-xs uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary" data-api-unique-id="adminloginview-rc89affa54fc6c3c7-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                        Account
                      </Label>
                      <Input data-auto="account" id="account" className="rounded-sm border-input bg-muted/30 focus-visible:ring-primary focus-visible:border-primary transition-all px-4 h-11" value={state.form.member_account} onChange={e => handlers.handleFormFieldChange('member_account', e.target.value)} disabled={state.isLoading} placeholder="Admin ID" autoComplete="username" data-api-unique-id="adminloginview-rf16644f8040a632b-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
                    </div>

                    <div className="space-y-2 group" data-api-unique-id="adminloginview-rf9388234c2eec26a-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                      <Label htmlFor="password" className="font-body text-xs uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary" data-api-unique-id="adminloginview-rc037617a44786d7d-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                        Password
                      </Label>
                      <Input data-auto="password" id="password" type="password" className="rounded-sm border-input bg-muted/30 focus-visible:ring-primary focus-visible:border-primary transition-all px-4 h-11" value={state.form.member_password} onChange={e => handlers.handleFormFieldChange('member_password', e.target.value)} disabled={state.isLoading} placeholder="••••••••" autoComplete="current-password" data-api-unique-id="adminloginview-r80c245505cc7850d-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
                    </div>
                  </div>

                  <Button data-auto="submit" type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm h-12 font-body font-semibold tracking-wide transition-all active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground" disabled={state.isLoading || !state.form.member_account || !state.form.member_password} data-api-unique-id="adminloginview-r851ba5ee46e8540d-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                    {state.isLoading ? <Loader2 className="w-5 h-5 animate-spin" data-api-unique-id="adminloginview-rc6f87af18b256347-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" /> : <span className="flex items-center gap-2" data-api-unique-id="adminloginview-r99c2c7d862b92314-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                        Sign In <ArrowRight className="w-4 h-4" data-api-unique-id="adminloginview-r361a93a2f1f97ca0-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView" />
                      </span>}
                  </Button>

                  <div className="relative" data-api-unique-id='adminloginview-r8b5a116c3169c9cd-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>
                    <div className="absolute inset-0 flex items-center" data-api-unique-id='adminloginview-r5624404c8785d8bc-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>
                      <span className="w-full border-t border-border" data-api-unique-id='adminloginview-r67013ba8f424476c-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView' />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground" data-api-unique-id='adminloginview-rd907622d11b28837-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>
                      <span className="bg-card px-3" data-api-unique-id='adminloginview-r2369901aa532c587-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>Or continue with</span>
                    </div>
                  </div>

                  <Button type="button" variant="outline" className="w-full rounded-sm h-12 font-body font-semibold tracking-wide" onClick={handlers.handleGoogleLogin} disabled={state.isLoading} data-api-unique-id='adminloginview-raef3a6abe5afe9cd-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>
                    {state.isLoading ? <Loader2 className="w-5 h-5 animate-spin" data-api-unique-id='adminloginview-r2d04dc04025eb72a-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView' /> : <span className="flex items-center gap-3" data-api-unique-id='adminloginview-r2d12ed8e65473e9c-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView'>
                        <GoogleIcon className="w-5 h-5" data-api-unique-id='adminloginview-rd3d528d01d688e3a-s2069262871' data-api-unique-page-name='src/backend/components/AdminLoginView' />
                        Sign in with Google
                      </span>}
                  </Button>
                </form>

                {/* Footer Section */}
                <div className="pt-8 border-t border-muted flex flex-col gap-4" data-api-unique-id="adminloginview-rc26fc5f8ae7dfac6-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2" data-api-unique-id="adminloginview-r4115575b8291bcf8-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                    <span className="text-[13px] text-muted-foreground font-body" data-api-unique-id="adminloginview-rc7de75781dfbc0d3-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                      Backend-only access required?
                    </span>
                    <Button variant="link" className="h-auto p-0 font-body text-[13px] text-secondary hover:text-primary font-medium transition-colors" onClick={handlers.handleNavigateToRegister} disabled={state.isLoading} data-api-unique-id="adminloginview-re38c145ee2363652-s2069262871" data-api-unique-page-name="src/backend/components/AdminLoginView">
                      Admin Register
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>;
};