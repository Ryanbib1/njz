'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLogin } from '@/backend/route-params';
import type { RegisterAdminInput } from '@/backend/actions/AdminRegister';
import { registerAdmin } from '@/backend/actions/AdminRegister';
import { toast } from 'sonner';

// shadcn UI components mapping (simulated generic imports as requested)
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
export default function AdminRegisterPage() {
  const router = useRouter();

  // ===== State =====
  const [form, setForm] = useState<RegisterAdminInput>({
    member_account: '',
    member_email: '',
    member_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ===== Handlers =====
  // Scenario B: Pure form state update, no side effects, IME safe
  const handleFormFieldChange = useCallback(<K extends keyof RegisterAdminInput,>(field: K, value: RegisterAdminInput[K]) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation
    if (!form.member_account.trim() || !form.member_email.trim() || !form.member_password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerAdmin(form);
      setIsSuccess(true);
    } catch (error: any) {
      // Server action throws errors for duplication (account/email) and other validations
      toast.error(error.message || 'Failed to register admin account.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNavigateToLogin = useCallback(() => {
    AdminLogin.navigateTo(router);
  }, [router]);

  // ===== Render =====
  return <main data-api-unique-id='adminregisterview-skeleton-with-logic-r6566bcfa62066366-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
      <article data-api-unique-id='adminregisterview-skeleton-with-logic-rb06d23a912bf48bc-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
        
        {/* Left Column: Brand & Context Pane */}
        <aside data-api-unique-id='adminregisterview-skeleton-with-logic-re355ec191310db34-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
          <header data-api-unique-id='adminregisterview-skeleton-with-logic-rba9efbca136eff54-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
            <h1 data-api-unique-id='adminregisterview-skeleton-with-logic-r21679207b042908f-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Tavola Italian Dining</h1>
            <h2 data-api-unique-id='adminregisterview-skeleton-with-logic-re12efebcfd7d03a4-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Administration Portal</h2>
          </header>
          <figure data-api-unique-id='adminregisterview-skeleton-with-logic-r89d7102d3f77b3fc-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
            {/* Editorial Graphic Area placeholder */}
            <figcaption data-api-unique-id='adminregisterview-skeleton-with-logic-ra7fa2674dbc9e970-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Hospitality Management System</figcaption>
          </figure>
        </aside>

        {/* Right Column: Interaction & Form Pane */}
        <section data-api-unique-id='adminregisterview-skeleton-with-logic-r3ee77b670efd5715-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
          {!isSuccess ? (/* State A: Registration Form */
        <div data-api-unique-id='adminregisterview-skeleton-with-logic-r238b09b1aa204783-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
              <header data-api-unique-id='adminregisterview-skeleton-with-logic-r084a2a2a18271eb0-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <h2 data-api-unique-id='adminregisterview-skeleton-with-logic-r07d55da4b39628bf-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Admin Registration</h2>
                <p data-api-unique-id='adminregisterview-skeleton-with-logic-r6775d45bf8cfa2b8-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Create a backend access account to manage the administration portal.</p>
              </header>

              <form onSubmit={handleSubmit} data-api-unique-id='adminregisterview-skeleton-with-logic-rfd9cb966eb798de1-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <fieldset disabled={isSubmitting} data-api-unique-id='adminregisterview-skeleton-with-logic-ra99a75bc5c15c0e6-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                  <div data-api-unique-id='adminregisterview-skeleton-with-logic-re20b1fb6621a167f-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                    <Label htmlFor="member_account" data-api-unique-id='adminregisterview-skeleton-with-logic-rf1400cbaa47b42b5-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Account Username</Label>
                    <Input id="member_account" type="text" placeholder="Enter a unique username" value={form.member_account} onChange={e => handleFormFieldChange('member_account', e.target.value)} required data-api-unique-id='adminregisterview-skeleton-with-logic-rd1633936c3134085-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic' />
                  </div>

                  <div data-api-unique-id='adminregisterview-skeleton-with-logic-r5beee2de7ca650b3-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                    <Label htmlFor="member_email" data-api-unique-id='adminregisterview-skeleton-with-logic-r60bce1a9bb4a5c71-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Email Address</Label>
                    <Input id="member_email" type="email" placeholder="admin@tavola.com" value={form.member_email} onChange={e => handleFormFieldChange('member_email', e.target.value)} required data-api-unique-id='adminregisterview-skeleton-with-logic-rd5e0fd5db96d3141-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic' />
                  </div>

                  <div data-api-unique-id='adminregisterview-skeleton-with-logic-rf8287d261aca115b-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                    <Label htmlFor="member_password" data-api-unique-id='adminregisterview-skeleton-with-logic-r80df2272fff74d68-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Password</Label>
                    <Input id="member_password" type="password" placeholder="Enter a secure password" value={form.member_password} onChange={e => handleFormFieldChange('member_password', e.target.value)} required data-api-unique-id='adminregisterview-skeleton-with-logic-rb5f9ed454461ef53-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic' />
                  </div>
                </fieldset>

                <div data-api-unique-id='adminregisterview-skeleton-with-logic-r9612e2f61462e127-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                  <Button type="submit" disabled={isSubmitting} data-api-unique-id='adminregisterview-skeleton-with-logic-rfa8106c05f71e656-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                    {isSubmitting ? 'Creating...' : 'Create Admin Account'}
                  </Button>
                </div>
              </form>

              <footer data-api-unique-id='adminregisterview-skeleton-with-logic-r46a21afbab23960d-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <p data-api-unique-id='adminregisterview-skeleton-with-logic-r973d8fb5c7f96b17-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Already have an admin account?</p>
                <Button variant="link" onClick={handleNavigateToLogin} disabled={isSubmitting} data-api-unique-id='adminregisterview-skeleton-with-logic-rab0c41018299bacc-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                  Sign in here
                </Button>
              </footer>
            </div>) : (/* State B: Creation Result Panel */
        <div data-api-unique-id='adminregisterview-skeleton-with-logic-r82b9cf432daf7248-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
              <div data-api-unique-id='adminregisterview-skeleton-with-logic-r082a7dac1ba71a5c-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                {/* Status Indicator Icon Placeholder */}
                <span data-api-unique-id='adminregisterview-skeleton-with-logic-re40ea2fe57f15f9a-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>[ Success ]</span>
              </div>
              
              <header data-api-unique-id='adminregisterview-skeleton-with-logic-r11b1cee6e8087982-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <h3 data-api-unique-id='adminregisterview-skeleton-with-logic-r41acb443d806687c-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>Registration Successful</h3>
              </header>
              
              <div data-api-unique-id='adminregisterview-skeleton-with-logic-rf60922ba8898c94e-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <p data-api-unique-id='adminregisterview-skeleton-with-logic-r5bae5e210d4c8b98-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                  Your ADMIN account has been successfully created and its status is now ACTIVE.
                  You can now use these credentials to access the administration portal.
                </p>
              </div>
              
              <div data-api-unique-id='adminregisterview-skeleton-with-logic-re23e8189a3933f8e-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                <Button onClick={handleNavigateToLogin} data-api-unique-id='adminregisterview-skeleton-with-logic-ree1d31c820f955ef-s2674882668' data-api-unique-page-name='src/backend/components/AdminRegisterView_skeleton_with_logic'>
                  Proceed to Login
                </Button>
              </div>
            </div>)}
        </section>

      </article>
    </main>;
}