'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
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
    return <main className="h-screen w-full flex flex-col items-center justify-center bg-background text-muted-foreground font-body">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="tracking-widest uppercase text-xs">Authenticating Session</span>
      </main>;
  }
  return <main className="h-screen w-full bg-background overflow-hidden flex items-center justify-center">
      <section data-controller-name="Admin Login Access" className="w-full h-full flex flex-col items-center justify-center">
        <div className="container mx-auto px-8 py-8 flex items-center justify-center h-full">
          {/* Main Editorial Card: Dual Pane Layout */}
          <div className="w-full max-w-5xl h-full max-h-[640px] flex flex-col lg:flex-row bg-card border border-border shadow-md rounded-none overflow-hidden">
            
            {/* Left Pane: Brand & Atmosphere (Hospitality View) */}
            <div className="hidden lg:flex relative w-1/2 h-full border-r border-border bg-muted flex-col justify-end p-12 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <EditableImg propKey="login-hero-bg" needLargeImage={true} description="Atmospheric Italian dining interior with warm lighting and elegant table settings" keywords="Italian restaurant interior luxury dining" className="w-full h-full object-cover grayscale-[0.2] brightness-75 hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="relative z-10 space-y-2">
                <h1 className="font-display text-4xl text-primary-foreground leading-tight">
                  Tavola <br /> Italian Dining
                </h1>
                <p className="font-header text-lg text-primary-foreground/90 italic tracking-wide">
                  Management & Operations
                </p>
                <div className="w-12 h-px bg-primary-foreground/40 mt-6" />
              </div>
            </div>

            {/* Right Pane: Functional Form (Admin View) */}
            <div className="flex-1 h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 bg-card">
              <div className="w-full max-w-sm mx-auto space-y-10">
                
                {/* Header Section */}
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground tracking-tight">
                    Admin Access
                  </h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Authorized personnel only. Please enter your credentials to access the management dashboard.
                  </p>
                </div>

                {/* Credential Form */}
                <form onSubmit={handlers.handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2 group">
                      <Label htmlFor="account" className="font-body text-xs uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary">
                        Account
                      </Label>
                      <Input data-auto="account" id="account" className="rounded-sm border-input bg-muted/30 focus-visible:ring-primary focus-visible:border-primary transition-all px-4 h-11" value={state.form.member_account} onChange={e => handlers.handleFormFieldChange('member_account', e.target.value)} disabled={state.isLoading} placeholder="Admin ID" autoComplete="username" />
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="password" className="font-body text-xs uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary">
                        Password
                      </Label>
                      <Input data-auto="password" id="password" type="password" className="rounded-sm border-input bg-muted/30 focus-visible:ring-primary focus-visible:border-primary transition-all px-4 h-11" value={state.form.member_password} onChange={e => handlers.handleFormFieldChange('member_password', e.target.value)} disabled={state.isLoading} placeholder="••••••••" autoComplete="current-password" />
                    </div>
                  </div>

                  <Button data-auto="submit" type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm h-12 font-body font-semibold tracking-wide transition-all active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground" disabled={state.isLoading || !state.form.member_account || !state.form.member_password}>
                    {state.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">
                        Sign In <ArrowRight className="w-4 h-4" />
                      </span>}
                  </Button>
                </form>

                {/* Footer Section */}
                <div className="pt-8 border-t border-muted flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-[13px] text-muted-foreground font-body">
                      Backend-only access required?
                    </span>
                    <Button variant="link" className="h-auto p-0 font-body text-[13px] text-secondary hover:text-primary font-medium transition-colors" onClick={handlers.handleNavigateToRegister} disabled={state.isLoading}>
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
