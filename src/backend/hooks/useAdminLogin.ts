'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminLogin, AdminDashboard, AdminRegister } from '@/backend/route-params';
import { adminLogin, checkCurrentSession, getGoogleLoginUrl, handleGoogleCallback } from '@/backend/actions/AdminLogin';
import type { AdminLoginInput, AdminLoginOutput } from '@/backend/actions/AdminLogin';
import { toast } from "sonner";
import { useAdminSession } from '@/tools/BackendSession';
import { openExternalLinkAsync, isExternalLinkPopup, closeExternalLinkPopup, onExternalLinkMessage } from '@/lib/utils';

// Export States
export interface AdminLoginState {
  /** 是否正在检查登录会话 */
  isCheckingSession: boolean;
  /** 是否处于提交加载状态 */
  isLoading: boolean;
  /** 登录表单数据 */
  form: AdminLoginInput;
}

// Export Handlers
export interface AdminLoginHandlers {
  /** 处理表单字段变更 */
  handleFormFieldChange: <K extends keyof AdminLoginInput>(field: K, value: AdminLoginInput[K]) => void;
  /** 处理表单提交登录 */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** 使用 Google 登录 */
  handleGoogleLogin: () => void;
  /** 跳转至注册页面 */
  handleNavigateToRegister: () => void;
}

export const useAdminLogin = (): {
  state: AdminLoginState;
  handlers: AdminLoginHandlers;
} => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Resolving params according to function_note requirement
  AdminLogin.getParams(searchParams);

  const { set } = useAdminSession();

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AdminLoginInput>({
    member_account: '',
    member_password: ''
  });

  const applyLoginResult = (result: AdminLoginOutput) => {
    set({
      token: result.token,
      user_id: result.member_id,
      username: result.member_account
    });

    toast.success("Login successful. Accessing dashboard...");
    AdminDashboard.navigateTo(router);
  };

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

  useEffect(() => {
    const authToken = searchParams.get('auth_token');
    const status = searchParams.get('status');

    if (!status) {
      return;
    }

    const cleanUrl = AdminLogin.path;
    window.history.replaceState({}, '', cleanUrl);

    if (status === 'success' && authToken) {
      setIsLoading(true);
      handleGoogleCallback(authToken).then(result => {
        if (isExternalLinkPopup()) {
          closeExternalLinkPopup({ type: 'oauth-success', payload: result });
          return;
        }

        applyLoginResult(result);
      }).catch((error: any) => {
        if (isExternalLinkPopup()) {
          closeExternalLinkPopup({ type: 'oauth-fail', message: error?.message || 'Google sign-in failed.' });
          return;
        }

        toast.error(error?.message || 'Google sign-in failed.');
      }).finally(() => {
        setIsLoading(false);
      });

      return;
    }

    if (status === 'fail') {
      if (isExternalLinkPopup()) {
        closeExternalLinkPopup({ type: 'oauth-fail', message: 'Google sign-in failed.' });
        return;
      }

      toast.error('Google sign-in failed.');
    }
  }, [searchParams, router]);

  useEffect(() => {
    return onExternalLinkMessage((data) => {
      if (data.type === 'oauth-success' && data.payload) {
        applyLoginResult(data.payload as AdminLoginOutput);
        setIsLoading(false);
        return;
      }

      if (data.type === 'oauth-fail') {
        const message = typeof data.message === 'string' ? data.message : 'Google sign-in failed.';
        setIsLoading(false);
        toast.error(message);
      }
    });
  }, [router]);

  const handleFormFieldChange = <K extends keyof AdminLoginInput>(field: K, value: AdminLoginInput[K]) => {
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
      applyLoginResult(result);
      
    } catch (error: any) {
      toast.error(error.message || "Invalid account or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    openExternalLinkAsync(async () => {
      const result = await getGoogleLoginUrl();
      if (!result.url) {
        throw new Error('Google sign-in is temporarily unavailable.');
      }

      return result.url;
    }, {
      onNavigate: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        const message = error instanceof Error ? error.message : 'Google sign-in is temporarily unavailable.';
        toast.error(message);
      }
    });
  };

  const handleNavigateToRegister = () => {
    AdminRegister.navigateTo(router);
  };

  return {
    state: {
      isCheckingSession,
      isLoading,
      form
    },
    handlers: {
      handleFormFieldChange,
      handleSubmit,
      handleGoogleLogin,
      handleNavigateToRegister
    }
  };
};