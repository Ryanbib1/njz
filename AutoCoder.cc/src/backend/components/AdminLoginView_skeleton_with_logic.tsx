'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminLogin, AdminDashboard, AdminRegister } from '@/backend/route-params';
import { adminLogin, checkCurrentSession } from '@/backend/actions/AdminLogin';
import type { AdminLoginInput } from '@/backend/actions/AdminLogin';
import { toast } from "sonner";
import { useAdminSession } from '@/tools/BackendSession';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolving params according to function_note requirement
  AdminLogin.getParams(searchParams);
  const {
    set
  } = useAdminSession();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AdminLoginInput>({
    member_account: '',
    member_password: ''
  });
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const result = await checkCurrentSession();
        if (result.is_logged_in && mounted) {
          AdminDashboard.navigateTo(router);
        } else if (mounted) {
          setIsCheckingSession(false);
        }
      } catch (error) {
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    };
    checkSession();
    return () => {
      mounted = false;
    };
  }, [router]);
  const handleFormFieldChange = <K extends keyof AdminLoginInput,>(field: K, value: AdminLoginInput[K]) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.member_account || !form.member_password) {
      toast.error("Account and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await adminLogin(form);
      set({
        token: result.token,
        user_id: result.member_id,
        username: result.member_account
      });
      toast.success("Login successful. Accessing dashboard...");
      AdminDashboard.navigateTo(router);
    } catch (error: any) {
      toast.error(error.message || "Invalid account or password.");
    } finally {
      setIsLoading(false);
    }
  };
  if (isCheckingSession) {
    return <main data-api-unique-id='adminloginview-skeleton-with-logic-r9206f1d8cd338b1c-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
        <div data-api-unique-id='adminloginview-skeleton-with-logic-rbc5b0d0d4b8c7e80-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Loading session state...</div>
      </main>;
  }
  return <main data-api-unique-id='adminloginview-skeleton-with-logic-r7c87c4b23c8fde3c-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
      <section data-api-unique-id='adminloginview-skeleton-with-logic-r1159790e4f953a79-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
        <header data-api-unique-id='adminloginview-skeleton-with-logic-rfacfd98b0becb65f-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
          <h1 data-api-unique-id='adminloginview-skeleton-with-logic-r078649e263d988d3-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Tavola Italian Dining</h1>
          <p data-api-unique-id='adminloginview-skeleton-with-logic-r4112f10a7b6632a4-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Management & Operations</p>
          <img alt="Atmospheric culinary detail or table setting for Tavola Italian Dining" data-api-unique-id='adminloginview-skeleton-with-logic-rafc66af3cc5fc73b-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic' />
        </header>
      </section>
      
      <section data-api-unique-id='adminloginview-skeleton-with-logic-rcea2b267bf438a59-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
        <header data-api-unique-id='adminloginview-skeleton-with-logic-r59c27fd423a2323a-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
          <h2 data-api-unique-id='adminloginview-skeleton-with-logic-r2b34363619e9d1e2-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Admin Access</h2>
          <p data-api-unique-id='adminloginview-skeleton-with-logic-r7b39de4a67b49981-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Authorized backend management only.</p>
        </header>
        
        <form onSubmit={handleSubmit} data-api-unique-id='adminloginview-skeleton-with-logic-r3ddd8c6b3fa8bc1e-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
          <div data-api-unique-id='adminloginview-skeleton-with-logic-rcc0b7539d57c186a-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
            <Label htmlFor="account" data-api-unique-id='adminloginview-skeleton-with-logic-r8ed3e2c098efbdff-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Account</Label>
            <Input id="account" value={form.member_account} onChange={e => handleFormFieldChange('member_account', e.target.value)} disabled={isLoading} placeholder="Enter your admin account" data-api-unique-id='adminloginview-skeleton-with-logic-r6220261faf1593ea-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic' />
          </div>
          
          <div data-api-unique-id='adminloginview-skeleton-with-logic-ra613d8073eb4d298-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
            <Label htmlFor="password" data-api-unique-id='adminloginview-skeleton-with-logic-r4b47cd49ebb76afc-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Password</Label>
            <Input id="password" type="password" value={form.member_password} onChange={e => handleFormFieldChange('member_password', e.target.value)} disabled={isLoading} placeholder="Enter your password" data-api-unique-id='adminloginview-skeleton-with-logic-r54348b5de3cb749a-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic' />
          </div>
          
          <Button type="submit" disabled={isLoading || !form.member_account || !form.member_password} data-api-unique-id='adminloginview-skeleton-with-logic-r6f0ce0b5fb85abf0-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
            Sign In
          </Button>
        </form>
        
        <hr data-api-unique-id='adminloginview-skeleton-with-logic-rc8637176aed5ace6-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic' />
        
        <footer data-api-unique-id='adminloginview-skeleton-with-logic-r1a63a5d1191de3e5-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
          <p data-api-unique-id='adminloginview-skeleton-with-logic-r91519f0ea17ed2e8-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>Backend-only access. First-time setup required?</p>
          <Button variant="link" onClick={() => AdminRegister.navigateTo(router)} disabled={isLoading} data-api-unique-id='adminloginview-skeleton-with-logic-rf5778c2d9b538151-s2912335177' data-api-unique-page-name='src/backend/components/AdminLoginView_skeleton_with_logic'>
            Admin Register
          </Button>
        </footer>
      </section>
    </main>;
}