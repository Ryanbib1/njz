'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLogin } from '@/backend/route-params';
import type { RegisterAdminInput } from '@/backend/actions/AdminRegister';
import { registerAdmin } from '@/backend/actions/AdminRegister';
import { toast } from 'sonner';
import { openExternalLinkAsync } from '@/lib/utils';
import { getGoogleLoginUrl } from '@/backend/actions/AdminLogin';

// Export States
export interface AdminRegisterState {
  /** 表单数据对象 */
  form: RegisterAdminInput;
  /** 是否正在提交请求 */
  isSubmitting: boolean;
  /** 注册是否成功标志位 */
  isSuccess: boolean;
}

// Export Handlers
export interface AdminRegisterHandlers {
  /** 处理表单字段变更 */
  handleFormFieldChange: <K extends keyof RegisterAdminInput>(field: K, value: RegisterAdminInput[K]) => void;
  /** 处理表单提交 */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** 使用 Google 前往登录 */
  handleGoogleLogin: () => void;
  /** 跳转到登录页面 */
  handleNavigateToLogin: () => void;
}

export function useAdminRegister(): {
  state: AdminRegisterState;
  handlers: AdminRegisterHandlers;
} {
  const router = useRouter();

  // ===== State =====
  const [form, setForm] = useState<RegisterAdminInput>({
    member_account: '',
    member_email: '',
    member_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ===== Handlers =====
  const handleFormFieldChange = useCallback(<K extends keyof RegisterAdminInput>(
    field: K,
    value: RegisterAdminInput[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

  const handleGoogleLogin = useCallback(() => {
    setIsSubmitting(true);
    openExternalLinkAsync(async () => {
      const result = await getGoogleLoginUrl();
      if (!result.url) {
        throw new Error('Google sign-in is temporarily unavailable.');
      }

      return result.url;
    }, {
      onNavigate: () => {
        setIsSubmitting(false);
      },
      onError: (error) => {
        setIsSubmitting(false);
        const message = error instanceof Error ? error.message : 'Google sign-in is temporarily unavailable.';
        toast.error(message);
      }
    });
  }, []);

  return {
    state: {
      form,
      isSubmitting,
      isSuccess,
    },
    handlers: {
      handleFormFieldChange,
      handleSubmit,
      handleGoogleLogin,
      handleNavigateToLogin,
    },
  };
}