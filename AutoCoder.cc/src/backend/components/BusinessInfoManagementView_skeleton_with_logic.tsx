'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BusinessInfoManagement } from '@/backend/route-params';
import type { MatchStatus, RecordStatus, WeekdayKey, GetBusinessProfileOutput, BusinessIdentityInfo } from '@/backend/actions/BusinessInfoManagement';
import { getBusinessProfile, updateBusinessIdentity, createHourRecord, updateHourRecord, deleteHourRecord } from '@/backend/actions/BusinessInfoManagement';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ===== Enum Mappings =====
const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched'
};
const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  PRESENT: 'Present',
  MISSING: 'Missing'
};
const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
};
export default function BusinessInfoManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => BusinessInfoManagement.getParams(searchParams), [searchParams]);

  // ===== State =====
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [profileData, setProfileData] = useState<GetBusinessProfileOutput | null>(null);
  const [identityForm, setIdentityForm] = useState<BusinessIdentityInfo | null>(null);

  // Hours local state for editing existing PRESENT records
  const [hoursLines, setHoursLines] = useState<Record<string, string>>({});

  // Hours recovery state for creating MISSING records
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

      // Reset recovery form
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
  const handleIdentityChange = <K extends keyof BusinessIdentityInfo,>(field: K, value: BusinessIdentityInfo[K]) => {
    setIdentityForm(prev => prev ? {
      ...prev,
      [field]: value
    } : prev);
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
    setHoursLines(prev => ({
      ...prev,
      [weekday]: value
    }));
  };
  const handleSaveHour = async (hour_id: string, weekday: string) => {
    const value = hoursLines[weekday];
    if (!value) {
      toast.error("Hour line cannot be empty.");
      return;
    }
    try {
      await updateHourRecord({
        hour_id,
        hour_fullLine: value
      });
      toast.success(`${WEEKDAY_LABELS[weekday as WeekdayKey]} hours updated.`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update hours");
    }
  };
  const handleDeleteHour = async (hour_id: string) => {
    try {
      await deleteHourRecord({
        hour_id
      });
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
    return profileData.hours_records.filter(h => h.hour_recordStatus === 'MISSING').map((h, index) => h.hour_weekday);
  }, [profileData]);

  // ===== Render =====
  if (isLoading) {
    return <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r093136a880c74cc2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Loading business profile...</div>;
  }
  if (!profileData || !identityForm) {
    return <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r81cb66ff5d7abea2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Failed to load data. Please refresh.</div>;
  }
  return <main data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb4456252023e2237-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
      <header data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7fed104cfe5e3374-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
        <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r08c22063928d14e8-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
          <Badge variant={profileData.is_dataset_complete ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0dd2f65f5da36e03-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            Dataset Status: {profileData.is_dataset_complete ? 'Complete' : 'Incomplete'}
          </Badge>
        </div>
        <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r67f4c10cb7ce232c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
          <Button onClick={handleSaveIdentity} disabled={isSavingIdentity} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4989d4aa8b624164-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            {isSavingIdentity ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </header>

      <section data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7f16fd994de420ae-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
        {/* Left Column: Data Management Pane */}
        <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r798fec85bbdab60c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
          <Card data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7f38893918365061-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r9dcee05ddea39e72-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r786bca5591aec3b3-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Core Identity Information</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r65a9fbaae3698aa6-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rf78f93be5d4e3679-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5a237c4858fbf618-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Restaurant Name</Label>
                <Input value={identityForm.restaurant_name} onChange={e => handleIdentityChange('restaurant_name', e.target.value)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7ecc09d461657ae4-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbd8e23e5482fabf5-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc9156f976d1e80ba-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Physical Address</Label>
                <Textarea value={identityForm.restaurant_address} onChange={e => handleIdentityChange('restaurant_address', e.target.value)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc35049c3b144482c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4ed03d9ea31e89e8-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd371c276bcf86ddc-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Contact Phone</Label>
                <Input value={identityForm.restaurant_phone} onChange={e => handleIdentityChange('restaurant_phone', e.target.value)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4e3bfdd90dc20242-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r2c23c3457c008da0-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6c197a3aba552865-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Official Website URL</Label>
                <Input value={identityForm.restaurant_website} onChange={e => handleIdentityChange('restaurant_website', e.target.value)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0f7813708036c3b6-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbab4d978dfd013de-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb62fbb5b4927bf57-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Aggregate Rating</Label>
                <Input type="number" step="0.1" value={identityForm.restaurant_rating} onChange={e => handleIdentityChange('restaurant_rating', parseFloat(e.target.value) || 0)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6c69b66802a61c34-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r8ebc05c95a460ece-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r36f74a24679142e6-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Total Review Count</Label>
                <Input type="number" value={identityForm.restaurant_reviewCount} onChange={e => handleIdentityChange('restaurant_reviewCount', parseInt(e.target.value, 10) || 0)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-re527ae099ed79e59-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
              </div>
            </CardContent>
          </Card>

          <Card data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rf90a149d2fdd3bfa-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7e6a2c93c9cee361-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4c26bc13d3ee19e2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Weekly Schedule Records</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4f50577f5897da9e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r1b60be93f60b721f-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-ree809f87a6824aae-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Missing Line Recovery Selector</Label>
                <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rf992602c7730e379-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                  <Select value={recoverWeekday} onValueChange={setRecoverWeekday} disabled={missingWeekdays.length === 0} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r01798257a23c7ba8-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    <SelectTrigger data-api-unique-id='businessinfomanagementview-skeleton-with-logic-re9aff064d826d1fb-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <SelectValue placeholder={missingWeekdays.length > 0 ? "Select missing weekday" : "No missing days"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbe17e5c653c81bf1-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
                    </SelectTrigger>
                    <SelectContent data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6c2e214909a5715c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      {missingWeekdays.map((wd, index) => <SelectItem key={wd} value={wd} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r3235a01d377fcdeb-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{WEEKDAY_LABELS[wd as WeekdayKey]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Enter full display line" value={recoverLine} onChange={e => setRecoverLine(e.target.value)} disabled={!recoverWeekday} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r661f3be9b013e2b3-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' />
                  <Button onClick={handleRecoverHour} disabled={!recoverWeekday || isRecovering} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-raeb949370c442577-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    Recover
                  </Button>
                </div>
              </div>

              <Table data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0afef5265d536699-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <TableHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc9422d6025abb5ef-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                  <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r1a45ea7c31e7864b-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rfbe3af8a9cc2e02e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Weekday</TableHead>
                    <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r9dafad5c41a7b944-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Display Line</TableHead>
                    <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbe8217173ffb0bc5-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r984542d1e31afe86-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                  {profileData.hours_records.map((record, index) => <TableRow key={record.hour_weekday} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-reef58793426a6b5e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rfe55a2d25bab6865-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{WEEKDAY_LABELS[record.hour_weekday]}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r3db41c9ea2d3157a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {record.hour_recordStatus === 'PRESENT' ? <Input value={hoursLines[record.hour_weekday] ?? ''} onChange={e => handleHourLineChange(record.hour_weekday, e.target.value)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc01f640085265297-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1' /> : <span data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rcaa1d6dc9de8cf8b-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{RECORD_STATUS_LABELS.MISSING}</span>}
                      </TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r261b02c1041c30bf-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        {record.hour_recordStatus === 'PRESENT' && record.hour_id && <>
                            <Button variant="outline" size="sm" onClick={() => handleSaveHour(record.hour_id!, record.hour_weekday)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-raa6586f9d02a5a22-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                              Save Line
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteHour(record.hour_id!)} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r208f63232360b3fd-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                              Delete
                            </Button>
                          </>}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Validation & System Status Pane */}
        <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-ra296006f0840fb4e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
          <Card data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd8a95a92b6500b0d-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd03cd15a3a11bc73-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbe0750e8553a274a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Source Alignment Audit</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5ebc5790593535a2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <section data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r8ea41ff13450fb0d-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rad5ba12500826e4a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Identity Validation List</h3>
                <Table data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r2d71aae8595c6240-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                  <TableHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r61f3438701bf219b-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r1983e3ff31d49511-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rfd0108a98f0be225-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Field Target</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r440b889aa4a405ce-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Live Value</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4440328b2dff9a21-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Source Value</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r8d61c7a961074e47-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb34b7075b126163a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-re439bd4597d2b378-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd249b68fcc66090f-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Name</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb3ecff569f00f53d-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_name}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6b544c973c002e18-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_name}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb11047c8d86d6363-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.name_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7bf6b320d8606183-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.name_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r55e8ef1f1e426439-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7930bfb9944c72dd-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Address</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbce259b693edd8d3-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_address}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4664ecf46ad222da-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_address}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc7cbc0f3d32368e4-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.address_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6220f55fef5a5c86-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.address_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rac535180fad6690b-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc0e25d9fb46374bd-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Phone</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5babe32f374fc795-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_phone}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-ra4042bb64ed88582-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_phone}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r92726fa5f95c31e2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.phone_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rf650fb74467ae5b2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.phone_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc5e2bcb98ca04a21-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r118bdfa8212a0aa7-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Website</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rff7189a34087de29-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_website}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rad629f8fa355c281-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_website}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rdd267835ebaa8594-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.website_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r318874b2ef2c1f26-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.website_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r112f892da93035da-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0a4ca4135c5d34e9-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Rating</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0736532b6c8138b8-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_rating}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd695cb4a235aeb0c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_rating}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r594e81932cce7d59-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.rating_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5531f8c026b82f66-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.rating_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r4a0ae16cf72b2447-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rd7f8bf297a694bdf-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Review Count</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r2652b9e48ff577c2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_info.restaurant_reviewCount}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r10029da9cf7ee38e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{profileData.identity_source.source_reviewCount}</TableCell>
                      <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r776a81d548f788ee-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                        <Badge variant={profileData.identity_validation.reviewCount_status === 'MATCHED' ? "default" : "destructive"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r288133d67eb4e34c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                          {MATCH_STATUS_LABELS[profileData.identity_validation.reviewCount_status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r1422bfe6cb918243-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='businessinfomanagementview-skeleton-with-logic-ra517f33c1b1dff29-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Hours Validation List</h3>
                <Table data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6a63230156191ea7-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                  <TableHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6a8902dbefd78eef-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    <TableRow data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r719751f094eb3f88-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r7c0edb28194f6afe-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Weekday Target</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r639309ba9c33c560-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Live Line</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r889a7a7e71c4195c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Source Line</TableHead>
                      <TableHead data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r03331eb869521b00-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5277e9542afeb15a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                    {profileData.hours_records.map((record, index) => <TableRow key={`audit-${record.hour_weekday}`} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-ra546f8a63ee280e2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                        <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-re0fb81894420ec8a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{WEEKDAY_LABELS[record.hour_weekday]}</TableCell>
                        <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rbff9149f4d4c4b79-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{record.hour_fullLine || '--'}</TableCell>
                        <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0b86c347010df79a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`profileData.hours_records-${index}-hour_sourceFullLine`} data-api-map-var-name='record'>{record.hour_sourceFullLine}</TableCell>
                        <TableCell data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r91a2372aba472857-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                          {record.hour_recordStatus === 'MISSING' ? <Badge variant="destructive" data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rf5ef7fd5a8363466-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>{RECORD_STATUS_LABELS.MISSING}</Badge> : <Badge variant={record.hour_matchStatus === 'MATCHED' ? "default" : "secondary"} data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r1eec1a88930b877e-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic' data-api-in-loop='1'>
                              {record.hour_matchStatus ? MATCH_STATUS_LABELS[record.hour_matchStatus] : '--'}
                            </Badge>}
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </section>
            </CardContent>
          </Card>

          <Card data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r5dcd470ae57a6843-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rfb13733fedb3d4da-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r2ef9bd7c50776b7a-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Deployment Status</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0719db91fb575aaf-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rc45fc9ebfc2f3859-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r6cf876e578126e6c-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Frontend Synchronization Confirmation</Label>
                <p data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rb20374720ed3248b-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Synced with public homepage rendering engine.</p>
              </div>
              <div data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r523060c8473d86f2-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>
                <Label data-api-unique-id='businessinfomanagementview-skeleton-with-logic-rcc26b04473377575-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>Last System Update Timestamp</Label>
                <p data-api-unique-id='businessinfomanagementview-skeleton-with-logic-r0d81e36ab170d807-s159892682' data-api-unique-page-name='src/backend/components/BusinessInfoManagementView_skeleton_with_logic'>{new Date(profileData.last_system_update).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>;
}