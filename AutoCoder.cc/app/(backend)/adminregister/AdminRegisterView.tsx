'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle2, User, Mail, Lock } from 'lucide-react';
import EditableImg from '@/@base/EditableImg';
import type { AdminRegisterState, AdminRegisterHandlers } from '@/backend/hooks/useAdminRegister';

interface Props {
  state: AdminRegisterState;
  handlers: AdminRegisterHandlers;
}

export const AdminRegisterView = ({ state, handlers }: Props) => {
  const { form, isSubmitting, isSuccess } = state;
  const { handleFormFieldChange, handleSubmit, handleNavigateToLogin } = handlers;

  return (
    <section 
      data-controller-name="Admin Registration Portal"
      className="w-full h-screen bg-background flex items-center justify-center overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-center h-full">
        {/* Editorial Split-Pane Card */}
        <Card className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl h-[min(720px,90vh)] overflow-hidden rounded-lg border-border shadow-md">
          
          {/* Left Column: Brand & Context Pane */}
          <div className="relative hidden md:flex flex-col justify-between p-12 bg-secondary text-secondary-foreground overflow-hidden">
            {/* Background Texture/Image Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <EditableImg 
                propKey="registration_side_image"
                keywords="luxury italian restaurant interior fine dining"
                description="Elegant Italian dining atmosphere with warm lighting"
                needLargeImage={true}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-medium tracking-[0.2em] uppercase opacity-80">Established 1988</span>
              <h1 className="font-header text-5xl lg:text-6xl leading-tight">
                Tavola <br /> Italian Dining
              </h1>
            </div>

            <div className="relative z-10">
              <div className="h-px w-12 bg-accent mb-6" />
              <h2 className="font-body text-xl font-light tracking-wide opacity-90">
                Administration Portal
              </h2>
              <p className="mt-2 text-sm font-light opacity-70 max-w-xs">
                Excellence in hospitality, managed with precision and culinary passion.
              </p>
            </div>
          </div>

          {/* Right Column: Interaction & Form Pane */}
          <div className="flex flex-col justify-center p-8 md:p-16 bg-card">
            {!isSuccess ? (
              /* State A: Registration Form */
              <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <header className="space-y-2">
                  <h2 className="font-header text-3xl text-foreground">Admin Registration</h2>
                  <p className="text-muted-foreground text-sm font-body">
                    Create a backend access account to manage the administration portal.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Account Field */}
                    <div className="space-y-2">
                      <Label htmlFor="member_account" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Account Username
                      </Label>
                      <div className="relative group">
                        <Input
                          id="member_account"
                          type="text"
                          autoComplete="username"
                          className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary focus-visible:border-primary transition-all"
                          placeholder="Enter a unique username"
                          value={form.member_account}
                          onChange={(e) => handleFormFieldChange('member_account', e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="member_email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="member_email"
                        type="email"
                        autoComplete="email"
                        className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary transition-all"
                        placeholder="admin@tavola.com"
                        value={form.member_email}
                        onChange={(e) => handleFormFieldChange('member_email', e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="member_password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Password
                      </Label>
                      <Input
                        id="member_password"
                        type="password"
                        autoComplete="new-password"
                        className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary transition-all"
                        placeholder="••••••••"
                        value={form.member_password}
                        onChange={(e) => handleFormFieldChange('member_password', e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-base shadow-sm transition-transform active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : 'Create Admin Account'}
                  </Button>
                </form>

                <footer className="text-center pt-4 border-t border-muted">
                  <p className="text-sm text-muted-foreground">
                    Already have an admin account?{' '}
                    <button 
                      type="button"
                      onClick={handleNavigateToLogin}
                      disabled={isSubmitting}
                      className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/30 transition-all"
                    >
                      Sign in here
                    </button>
                  </p>
                </footer>
              </div>
            ) : (
              /* State B: Creation Result Panel */
              <div className="w-full max-w-sm mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-12 h-12" strokeWidth={1.5} />
                  </div>
                </div>
                
                <header className="space-y-2">
                  <h3 className="font-header text-3xl text-foreground">Registration Successful</h3>
                  <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
                </header>
                
                <div className="bg-muted/30 p-6 rounded-md">
                  <p className="text-sm leading-relaxed text-muted-foreground font-body">
                    Your <span className="text-foreground font-semibold">ADMIN</span> account has been successfully created and its status is now <span className="text-green-600 font-bold tracking-tight">ACTIVE</span>. 
                    <br /><br />
                    You can now use these credentials to access the administration portal.
                  </p>
                </div>
                
                <Button 
                  onClick={handleNavigateToLogin}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-base shadow-sm transition-transform active:scale-[0.98]"
                >
                  Proceed to Login
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminRegisterView;
