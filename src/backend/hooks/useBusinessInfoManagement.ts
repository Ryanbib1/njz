'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BusinessInfoManagement } from '@/backend/route-params';
import type { 
  MatchStatus, 
  RecordStatus, 
  WeekdayKey, 
  GetBusinessProfileOutput,
  BusinessIdentityInfo
} from '@/backend/actions/BusinessInfoManagement';
import { 
  getBusinessProfile, 
  updateBusinessIdentity, 
  createHourRecord, 
  updateHourRecord, 
  deleteHourRecord 
} from '@/backend/actions/BusinessInfoManagement';
import { toast } from "sonner";

// ===== Enum Mappings (内部常量) =====
const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched',
};

const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  PRESENT: 'Present',
  MISSING: 'Missing',
};

const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

export interface BusinessInfoManagementState {
  /** 页面是否正在加载数据 */
  isLoading: boolean;
  /** 是否正在保存身份信息 */
  isSavingIdentity: boolean;
  /** 业务简报完整数据 */
  profileData: GetBusinessProfileOutput | null;
  /** 身份信息表单状态 */
  identityForm: BusinessIdentityInfo | null;
  /** 营业时间本地编辑状态，Key为星期 */
  hoursLines: Record<string, string>;
  /** 待恢复营业时间的星期选择 */
  recoverWeekday: string;
  /** 待恢复营业时间的文本内容 */
  recoverLine: string;
  /** 是否正在执行恢复操作 */
  isRecovering: boolean;
  /** 缺失的星期列表 */
  missingWeekdays: string[];
  /** 路由参数 */
  params: any;
  /** 映射枚举标签 */
  labels: {
    matchStatus: Record<MatchStatus, string>;
    recordStatus: Record<RecordStatus, string>;
    weekday: Record<WeekdayKey, string>;
  };
}

export interface BusinessInfoManagementHandlers {
  /** 处理身份信息字段变更 */
  handleIdentityChange: <K extends keyof BusinessIdentityInfo>(field: K, value: BusinessIdentityInfo[K]) => void;
  /** 保存核心身份信息 */
  handleSaveIdentity: () => Promise<void>;
  /** 处理具体某天营业时间的输入变更 */
  handleHourLineChange: (weekday: string, value: string) => void;
  /** 更新保存单条营业时间记录 */
  handleSaveHour: (hour_id: string, weekday: string) => Promise<void>;
  /** 删除单条营业时间记录 */
  handleDeleteHour: (hour_id: string) => Promise<void>;
  /** 恢复缺失的营业时间记录 */
  handleRecoverHour: () => Promise<void>;
  /** 设置恢复星期的选择值 */
  setRecoverWeekday: (val: string) => void;
  /** 设置恢复文本的输入值 */
  setRecoverLine: (val: string) => void;
}

export function useBusinessInfoManagement(): {
  state: BusinessInfoManagementState;
  handlers: BusinessInfoManagementHandlers;
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => BusinessInfoManagement.getParams(searchParams), [searchParams]);

  // ===== State =====
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [profileData, setProfileData] = useState<GetBusinessProfileOutput | null>(null);
  const [identityForm, setIdentityForm] = useState<BusinessIdentityInfo | null>(null);
  const [hoursLines, setHoursLines] = useState<Record<string, string>>({});
  const [recoverWeekday, setRecoverWeekday] = useState<string>('');
  const [recoverLine, setRecoverLine] = useState<string>('');
  const [isRecovering, setIsRecovering] = useState(false);

  // ===== Data Fetching =====
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBusinessProfile();
      setProfileData(data);
      setIdentityForm(data.identity_info);
      
      const initialHours: Record<string, string> = {};
      data.hours_records.forEach(h => {
        if (h.hour_recordStatus === 'PRESENT' && h.hour_fullLine) {
          initialHours[h.hour_weekday] = h.hour_fullLine;
        }
      });
      setHoursLines(initialHours);
      
      setRecoverWeekday('');
      setRecoverLine('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load business profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ===== Handlers =====
  const handleIdentityChange = <K extends keyof BusinessIdentityInfo>(field: K, value: BusinessIdentityInfo[K]) => {
    setIdentityForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSaveIdentity = async () => {
    if (!identityForm) return;
    setIsSavingIdentity(true);
    try {
      await updateBusinessIdentity(identityForm);
      toast.success("Business identity updated successfully.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update identity");
    } finally {
      setIsSavingIdentity(false);
    }
  };

  const handleHourLineChange = (weekday: string, value: string) => {
    setHoursLines(prev => ({ ...prev, [weekday]: value }));
  };

  const handleSaveHour = async (hour_id: string, weekday: string) => {
    const value = hoursLines[weekday];
    if (!value) {
      toast.error("Hour line cannot be empty.");
      return;
    }
    try {
      await updateHourRecord({ hour_id, hour_fullLine: value });
      toast.success(`${WEEKDAY_LABELS[weekday as WeekdayKey]} hours updated.`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update hours");
    }
  };

  const handleDeleteHour = async (hour_id: string) => {
    try {
      await deleteHourRecord({ hour_id });
      toast.success("Hours record deleted.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete hours");
    }
  };

  const handleRecoverHour = async () => {
    if (!profileData || !identityForm) return;
    if (!recoverWeekday || !recoverLine) {
      toast.error("Please select a weekday and provide the full hours line.");
      return;
    }
    setIsRecovering(true);
    try {
      await createHourRecord({
        restaurant_id: identityForm.restaurant_id,
        hour_weekday: recoverWeekday,
        hour_fullLine: recoverLine
      });
      toast.success("Missing hours record recovered.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to recover hours");
    } finally {
      setIsRecovering(false);
    }
  };

  // ===== Derived State =====
  const missingWeekdays = useMemo(() => {
    if (!profileData) return [];
    return profileData.hours_records
      .filter(h => h.hour_recordStatus === 'MISSING')
      .map(h => h.hour_weekday);
  }, [profileData]);

  const state: BusinessInfoManagementState = {
    isLoading,
    isSavingIdentity,
    profileData,
    identityForm,
    hoursLines,
    recoverWeekday,
    recoverLine,
    isRecovering,
    missingWeekdays,
    params,
    labels: {
      matchStatus: MATCH_STATUS_LABELS,
      recordStatus: RECORD_STATUS_LABELS,
      weekday: WEEKDAY_LABELS,
    }
  };

  const handlers: BusinessInfoManagementHandlers = {
    handleIdentityChange,
    handleSaveIdentity,
    handleHourLineChange,
    handleSaveHour,
    handleDeleteHour,
    handleRecoverHour,
    setRecoverWeekday,
    setRecoverLine,
  };

  return { state, handlers };
}