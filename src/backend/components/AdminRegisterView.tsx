'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle2, User, Mail, Lock } from 'lucide-react';
import { GoogleIcon } from '@/components/thirdparty/GoogleIcon';
import EditableImg from '@/@base/EditableImg';
import type { AdminRegisterState, AdminRegisterHandlers } from '@/backend/hooks/useAdminRegister';
interface Props {
  state: AdminRegisterState;
  handlers: AdminRegisterHandlers;
}
export const AdminRegisterView = ({
  state,
  handlers
}: Props) => {
  const {
    form,
    isSubmitting,
    isSuccess
  } = state;
  const {
    handleFormFieldChange,
    handleSubmit,
    handleNavigateToLogin
  } = handlers;
  return <section data-controller-name="Admin Registration Portal" className="w-full h-screen bg-background flex items-center justify-center overflow-hidden" data-api-unique-id="adminregisterview-r1a15b11f59224380-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-center h-full" data-api-unique-id="adminregisterview-r46ca7422cdda0010-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
        {/* Editorial Split-Pane Card */}
        <Card className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl h-[min(720px,90vh)] overflow-hidden rounded-lg border-border shadow-md" data-api-unique-id="adminregisterview-rdc4bb5abb0aef95a-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
          
          {/* Left Column: Brand & Context Pane */}
          <div className="relative hidden md:flex flex-col justify-between p-12 bg-secondary text-secondary-foreground overflow-hidden" data-api-unique-id="adminregisterview-r6304f02d93263871-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
            {/* Background Texture/Image Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" data-api-unique-id="adminregisterview-r552dde20d7b09162-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
              <EditableImg propKey="registration_side_image" keywords="luxury italian restaurant interior fine dining" description="Elegant Italian dining atmosphere with warm lighting" needLargeImage={true} className="w-full h-full object-cover" data-api-unique-id="adminregisterview-r2a06c32553803659-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
            </div>
            
            <div className="relative z-10 space-y-2" data-api-unique-id="adminregisterview-r9e4c783601b1bb06-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
              <span className="text-xs font-medium tracking-[0.2em] uppercase opacity-80" data-api-unique-id="adminregisterview-r4eb6bbb57796c598-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">Established 1988</span>
              <h1 className="font-header text-5xl lg:text-6xl leading-tight" data-api-unique-id="adminregisterview-rd4165783963c37e1-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                Tavola <br data-api-unique-id="adminregisterview-r9778dd1ed02b0907-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" /> Italian Dining
              </h1>
            </div>

            <div className="relative z-10" data-api-unique-id="adminregisterview-r2176e2c93d747bbd-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
              <div className="h-px w-12 bg-accent mb-6" data-api-unique-id="adminregisterview-ra8195597a67cf8db-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
              <h2 className="font-body text-xl font-light tracking-wide opacity-90" data-api-unique-id="adminregisterview-rc6bfeea6f7b7f26b-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                Administration Portal
              </h2>
              <p className="mt-2 text-sm font-light opacity-70 max-w-xs" data-api-unique-id="adminregisterview-r380423d0e3618900-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                Excellence in hospitality, managed with precision and culinary passion.
              </p>
            </div>
          </div>

          {/* Right Column: Interaction & Form Pane */}
          <div className="flex flex-col justify-center p-8 md:p-16 bg-card" data-api-unique-id="adminregisterview-r422fa39f2dd3e2c8-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
            {!isSuccess ? (/* State A: Registration Form */
          <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700" data-api-unique-id="adminregisterview-r8e760b0414340644-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                <header className="space-y-2" data-api-unique-id="adminregisterview-re00b347f096c1fc2-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <h2 className="font-header text-3xl text-foreground" data-api-unique-id="adminregisterview-r4aa53f593e2d1c47-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">Admin Registration</h2>
                  <p className="text-muted-foreground text-sm font-body" data-api-unique-id="adminregisterview-r1895cd12208bef59-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    Create a backend access account to manage the administration portal.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6" data-api-unique-id="adminregisterview-rd232f469547f3865-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <div className="space-y-4" data-api-unique-id="adminregisterview-r4bc3b580564ef8e6-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    {/* Account Field */}
                    <div className="space-y-2" data-api-unique-id="adminregisterview-r8fb358412410657e-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                      <Label htmlFor="member_account" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="adminregisterview-rb59b9571c2409ac6-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                        Account Username
                      </Label>
                      <div className="relative group" data-api-unique-id="adminregisterview-r00e7858065c00ff7-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                        <Input id="member_account" type="text" autoComplete="username" className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary focus-visible:border-primary transition-all" placeholder="Enter a unique username" value={form.member_account} onChange={e => handleFormFieldChange('member_account', e.target.value)} disabled={isSubmitting} required data-api-unique-id="adminregisterview-r09d4e1f40e24e4ee-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2" data-api-unique-id="adminregisterview-r615f69236a72e0a8-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                      <Label htmlFor="member_email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="adminregisterview-r466f61ffb6083d78-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                        Email Address
                      </Label>
                      <Input id="member_email" type="email" autoComplete="email" className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary transition-all" placeholder="admin@tavola.com" value={form.member_email} onChange={e => handleFormFieldChange('member_email', e.target.value)} disabled={isSubmitting} required data-api-unique-id="adminregisterview-re705bf768e697ef3-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2" data-api-unique-id="adminregisterview-r43ba7c0df883a9e7-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                      <Label htmlFor="member_password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="adminregisterview-r69ed56c12fbba0ef-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                        Password
                      </Label>
                      <Input id="member_password" type="password" autoComplete="new-password" className="pl-3 h-11 rounded-md border-input bg-background focus-visible:ring-primary transition-all" placeholder="••••••••" value={form.member_password} onChange={e => handleFormFieldChange('member_password', e.target.value)} disabled={isSubmitting} required data-api-unique-id="adminregisterview-r20e923a091fa5375-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-base shadow-sm transition-transform active:scale-[0.98]" disabled={isSubmitting} data-api-unique-id="adminregisterview-r6bc93dd5a521a026-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    {isSubmitting ? <span className="flex items-center gap-2" data-api-unique-id="adminregisterview-r12db97984c7c8399-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                        <span className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" data-api-unique-id="adminregisterview-rdb940ed0ce36561d-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                        Processing...
                      </span> : 'Create Admin Account'}
                  </Button>

                  <div className="relative" data-api-unique-id='adminregisterview-r9d69637631f9839c-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                    <div className="absolute inset-0 flex items-center" data-api-unique-id='adminregisterview-r1864cb9281d65634-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                      <span className="w-full border-t border-border" data-api-unique-id='adminregisterview-r0839c00bbab87f04-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView' />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground" data-api-unique-id='adminregisterview-r457c6787d4bfa7b1-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                      <span className="bg-card px-3" data-api-unique-id='adminregisterview-re1dbfccbf6e1a878-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>Or continue with</span>
                    </div>
                  </div>

                  <Button type="button" variant="outline" className="w-full h-12 rounded-md font-medium text-base" onClick={handlers.handleGoogleLogin} disabled={isSubmitting} data-api-unique-id='adminregisterview-rc005a4442b05cf13-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                    {isSubmitting ? <span className="flex items-center gap-2" data-api-unique-id='adminregisterview-ra5f88f44fc59d6f4-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                        <span className="h-4 w-4 border-2 border-t-transparent border-foreground rounded-full animate-spin" data-api-unique-id='adminregisterview-r8679c60a7499032d-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView' />
                        Redirecting...
                      </span> : <span className="flex items-center justify-center gap-3" data-api-unique-id='adminregisterview-ra9bd18d787417d08-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView'>
                        <GoogleIcon className="w-5 h-5" data-api-unique-id='adminregisterview-r08cd01ef6f518588-s3180459079' data-api-unique-page-name='src/backend/components/AdminRegisterView' />
                        Sign in with Google
                      </span>}
                  </Button>
                </form>

                <footer className="text-center pt-4 border-t border-muted" data-api-unique-id="adminregisterview-re2c574ae1fce919c-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <p className="text-sm text-muted-foreground" data-api-unique-id="adminregisterview-r140f58ca0af0574d-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    Already have an admin account?{' '}
                    <button type="button" onClick={handleNavigateToLogin} disabled={isSubmitting} className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/30 transition-all" data-api-unique-id="adminregisterview-r52189f9b00e73102-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                      Sign in here
                    </button>
                  </p>
                </footer>
              </div>) : (/* State B: Creation Result Panel */
          <div className="w-full max-w-sm mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500" data-api-unique-id="adminregisterview-r54708a5be98a221b-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                <div className="flex justify-center" data-api-unique-id="adminregisterview-r29a3ff519fff324e-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary" data-api-unique-id="adminregisterview-r76b1a24453f35b09-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    <CheckCircle2 className="w-12 h-12" strokeWidth={1.5} data-api-unique-id="adminregisterview-r31f550232b077501-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                  </div>
                </div>
                
                <header className="space-y-2" data-api-unique-id="adminregisterview-r90f2370b428b8f65-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <h3 className="font-header text-3xl text-foreground" data-api-unique-id="adminregisterview-rff1650a86e0bd680-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">Registration Successful</h3>
                  <div className="h-1 w-12 bg-primary mx-auto rounded-full" data-api-unique-id="adminregisterview-r481250baa9c64278-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                </header>
                
                <div className="bg-muted/30 p-6 rounded-md" data-api-unique-id="adminregisterview-rb0cbd688155f5171-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  <p className="text-sm leading-relaxed text-muted-foreground font-body" data-api-unique-id="adminregisterview-r616f470e80990ba5-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                    Your <span className="text-foreground font-semibold" data-api-unique-id="adminregisterview-rbcf3bf3ac21250e9-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">ADMIN</span> account has been successfully created and its status is now <span className="text-green-600 font-bold tracking-tight" data-api-unique-id="adminregisterview-rb0c91e459daeff6b-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">ACTIVE</span>. 
                    <br data-api-unique-id="adminregisterview-r930dea87903ca7bd-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" /><br data-api-unique-id="adminregisterview-r37dd314011998f27-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView" />
                    You can now use these credentials to access the administration portal.
                  </p>
                </div>
                
                <Button onClick={handleNavigateToLogin} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-base shadow-sm transition-transform active:scale-[0.98]" data-api-unique-id="adminregisterview-rd95fbcb44d4b3040-s3180459079" data-api-unique-page-name="src/backend/components/AdminRegisterView">
                  Proceed to Login
                </Button>
              </div>)}
          </div>
        </Card>
      </div>
    </section>;
};
export default AdminRegisterView;