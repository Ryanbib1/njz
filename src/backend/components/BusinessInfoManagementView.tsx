'use client';

import React from 'react';
import type { WeekdayKey } from '@/backend/actions/BusinessInfoManagement';
import type { BusinessInfoManagementState, BusinessInfoManagementHandlers } from '@/backend/hooks/useBusinessInfoManagement';

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

// Icons
import { Save, RotateCcw, Trash2, CheckCircle2, AlertCircle, Clock, Store, ShieldCheck, RefreshCw } from "lucide-react";
interface Props {
  state: BusinessInfoManagementState;
  handlers: BusinessInfoManagementHandlers;
}
export const BusinessInfoManagementView = ({
  state,
  handlers
}: Props) => {
  if (state.isLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-background" data-api-unique-id="businessinfomanagementview-r9e973241fefdafde-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
        <div className="flex flex-col items-center gap-4" data-api-unique-id="businessinfomanagementview-rab450c10baf1ba4a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" data-api-unique-id="businessinfomanagementview-r296af2ab4b2da425-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
          <p className="font-header text-xl text-muted-foreground italic" data-api-unique-id="businessinfomanagementview-rda3d3eb31dbd0d51-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Gathering profile details...</p>
        </div>
      </div>;
  }
  if (!state.profileData || !state.identityForm) {
    return <div className="flex h-screen w-full items-center justify-center bg-background" data-api-unique-id="businessinfomanagementview-rae54abd33fdcfa9f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-6" data-api-unique-id="businessinfomanagementview-r9ff6228391b3d674-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
          <AlertCircle className="h-12 w-12 text-destructive" data-api-unique-id="businessinfomanagementview-rc47fa405ce91e7ad-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
          <h2 className="font-display text-2xl text-foreground" data-api-unique-id="businessinfomanagementview-r6b21c349dfa37431-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Data Acquisition Failure</h2>
          <p className="font-body text-muted-foreground" data-api-unique-id="businessinfomanagementview-r307dc30188ef73ea-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">We were unable to retrieve the restaurant configuration. Please refresh the dashboard or contact technical support.</p>
          <Button variant="outline" onClick={() => window.location.reload()} data-api-unique-id="businessinfomanagementview-rac115884023ccc99-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Refresh Page</Button>
        </div>
      </div>;
  }
  return <main className="min-h-screen bg-background font-body text-foreground pb-20" data-api-unique-id="businessinfomanagementview-r15afce3af09dc8cf-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
      {/* Global Header Area */}
      <section className="w-full border-b bg-card" data-controller-name="Global Navigation & Actions" data-api-unique-id="businessinfomanagementview-rb9c3b7b40d10fe9e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
        <div className="container mx-auto px-8 py-6" data-api-unique-id="businessinfomanagementview-r25c45a2dae078ebb-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" data-api-unique-id="businessinfomanagementview-r566b0044a0868fd0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
            <div className="space-y-1" data-api-unique-id="businessinfomanagementview-r094305baa5e7c040-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
              <Breadcrumb data-api-unique-id="businessinfomanagementview-r4110fa8c91cd1a4f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <BreadcrumbList className="font-body text-xs uppercase tracking-widest text-muted-foreground" data-api-unique-id="businessinfomanagementview-rb996090a55cf48d3-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <BreadcrumbItem data-api-unique-id="businessinfomanagementview-raade32511b094842-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Management</BreadcrumbItem>
                  <BreadcrumbSeparator data-api-unique-id="businessinfomanagementview-r5d08072fbc352bee-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                  <BreadcrumbItem data-api-unique-id="businessinfomanagementview-r555b70d54417ebf4-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <BreadcrumbPage data-api-unique-id="businessinfomanagementview-rad9f97168798947a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Configuration</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="font-display text-4xl font-normal text-foreground" data-api-unique-id="businessinfomanagementview-rf3211489f9e3b715-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Business Profile & Hours</h1>
            </div>

            <div className="flex items-center gap-4" data-api-unique-id="businessinfomanagementview-re9a35a141482b090-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border rounded-md" data-api-unique-id="businessinfomanagementview-r4a1ab60541c24d10-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <span className="text-xs font-medium uppercase tracking-tighter text-muted-foreground" data-api-unique-id="businessinfomanagementview-rdf117ea82de25a34-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Dataset Status</span>
                <Badge variant={state.profileData.is_dataset_complete ? "outline" : "destructive"} className={`rounded-sm px-2 py-0.5 text-[10px] font-bold ${state.profileData.is_dataset_complete ? 'border-secondary text-secondary' : 'bg-destructive text-destructive-foreground'}`} data-api-unique-id="businessinfomanagementview-r23f95e3e6fd0d422-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  {state.profileData.is_dataset_complete ? 'COMPLETE' : 'INCOMPLETE'}
                </Badge>
              </div>
              <Button onClick={handlers.handleSaveIdentity} disabled={state.isSavingIdentity} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 shadow-sm transition-all active:scale-95" data-api-unique-id="businessinfomanagementview-ra7e9f6d6b1d710b0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                {state.isSavingIdentity ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" data-api-unique-id="businessinfomanagementview-r8d9ecf1af975eed9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" /> : <Save className="mr-2 h-4 w-4" data-api-unique-id="businessinfomanagementview-reb1183e09cbf0195-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />}
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content View */}
      <section className="w-full" data-controller-name="Editorial Management Grid" data-api-unique-id="businessinfomanagementview-r608596e16c21ac63-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
        <div className="container mx-auto px-8 py-8" data-api-unique-id="businessinfomanagementview-r9429970295f6c7d2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" data-api-unique-id="businessinfomanagementview-r7a333aa53d46eaf5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
            
            {/* Left Column: Data Management Pane */}
            <div className="lg:col-span-7 space-y-8" data-api-unique-id="businessinfomanagementview-re28b300b9e678ed5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
              
              {/* Business Identity Container */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden" data-api-unique-id="businessinfomanagementview-r87b705478270e71e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <CardHeader className="bg-muted/30 border-b py-4" data-api-unique-id="businessinfomanagementview-r15385d684c2e8669-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="flex items-center gap-3" data-api-unique-id="businessinfomanagementview-r50438c8e6b14aff9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <Store className="h-5 w-5 text-secondary" data-api-unique-id="businessinfomanagementview-r2c81174b77ce111c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    <CardTitle className="font-header text-2xl italic font-medium" data-api-unique-id="businessinfomanagementview-ra55d321b5e95db0b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Core Identity Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6" data-api-unique-id="businessinfomanagementview-r47900cfd167c9534-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" data-api-unique-id="businessinfomanagementview-rb1313349725e26d1-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <div className="space-y-2 md:col-span-2" data-api-unique-id="businessinfomanagementview-rd72e44b0c237f598-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-r1cfa4e68e62a92ce-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Restaurant Name</Label>
                      <Input className="rounded-md border-input focus:ring-ring bg-background px-3 h-10" value={state.identityForm.restaurant_name} onChange={e => handlers.handleIdentityChange('restaurant_name', e.target.value)} data-api-unique-id="businessinfomanagementview-rf66669e6bcb42cf9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2" data-api-unique-id="businessinfomanagementview-r7078daf834beea29-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-rd908f5a119d3ee1c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Physical Address</Label>
                      <Textarea className="rounded-md border-input min-h-[80px] bg-background px-3 py-2 resize-none" value={state.identityForm.restaurant_address} onChange={e => handlers.handleIdentityChange('restaurant_address', e.target.value)} data-api-unique-id="businessinfomanagementview-r2d20deefe74a64ba-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>

                    <div className="space-y-2" data-api-unique-id="businessinfomanagementview-r87ef1caddfe372fe-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-r620481441d318890-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Contact Phone</Label>
                      <Input className="rounded-md border-input bg-background px-3 h-10" value={state.identityForm.restaurant_phone} onChange={e => handlers.handleIdentityChange('restaurant_phone', e.target.value)} data-api-unique-id="businessinfomanagementview-r9bc2e6058ad8237b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>

                    <div className="space-y-2" data-api-unique-id="businessinfomanagementview-r1f2549451cb9e0b5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-rd4caec57b660963f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Official Website</Label>
                      <Input className="rounded-md border-input bg-background px-3 h-10" value={state.identityForm.restaurant_website} onChange={e => handlers.handleIdentityChange('restaurant_website', e.target.value)} data-api-unique-id="businessinfomanagementview-r9dcaf46bd74120bc-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>

                    <div className="space-y-2" data-api-unique-id="businessinfomanagementview-reea343ba64538052-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-r124fad7d8dd6dbb4-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Aggregate Rating</Label>
                      <Input type="number" step="0.1" className="rounded-md border-input bg-background px-3 h-10" value={state.identityForm.restaurant_rating} onChange={e => handlers.handleIdentityChange('restaurant_rating', parseFloat(e.target.value) || 0)} data-api-unique-id="businessinfomanagementview-r795c0a497f9bfa6b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>

                    <div className="space-y-2" data-api-unique-id="businessinfomanagementview-r377ec3b6a2d88b72-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-api-unique-id="businessinfomanagementview-rba36a4b79c922ab9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Total Reviews</Label>
                      <Input type="number" className="rounded-md border-input bg-background px-3 h-10" value={state.identityForm.restaurant_reviewCount} onChange={e => handlers.handleIdentityChange('restaurant_reviewCount', parseInt(e.target.value, 10) || 0)} data-api-unique-id="businessinfomanagementview-rd087ffca1000861b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours Container */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden" data-api-unique-id="businessinfomanagementview-r037c3b70596af15a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <CardHeader className="bg-muted/30 border-b py-4" data-api-unique-id="businessinfomanagementview-r2b7b93657e9e3c2b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="flex items-center gap-3" data-api-unique-id="businessinfomanagementview-rd5addc6378d93aaf-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <Clock className="h-5 w-5 text-secondary" data-api-unique-id="businessinfomanagementview-rd380d43a7c1949cb-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    <CardTitle className="font-header text-2xl italic font-medium" data-api-unique-id="businessinfomanagementview-r15169bdc2819e3c5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Weekly Schedule Records</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8" data-api-unique-id="businessinfomanagementview-r0c92566d05dd2bb0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  
                  {/* Recovery Selector */}
                  <div className="p-4 bg-muted/20 border-l-4 border-secondary/40 space-y-4" data-api-unique-id="businessinfomanagementview-r96a643a6c2b61977-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <div className="flex items-center justify-between" data-api-unique-id="businessinfomanagementview-r5ea618b4bde99ea9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-sm font-header italic text-secondary-foreground" data-api-unique-id="businessinfomanagementview-rd6c0f236448be96c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Missing Line Recovery</Label>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground rounded-sm text-[10px]" data-api-unique-id="businessinfomanagementview-r9cc3ab1b5a5b9ded-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">{state.missingWeekdays.length} Days Remaining</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center" data-api-unique-id="businessinfomanagementview-r26dd33efd7f51632-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <div className="w-[180px] flex-shrink-0" data-api-unique-id="businessinfomanagementview-r46efe932967fa702-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <Select value={state.recoverWeekday} onValueChange={handlers.setRecoverWeekday} disabled={state.missingWeekdays.length === 0} data-api-unique-id="businessinfomanagementview-reb325934bf2eed52-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                          <SelectTrigger className="h-9 rounded-sm border-secondary/30 bg-background px-3" data-api-unique-id="businessinfomanagementview-r0f870e01049ff211-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            <SelectValue placeholder="Target Weekday" data-api-unique-id="businessinfomanagementview-r7edc2c554a283b9c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-border" data-api-unique-id="businessinfomanagementview-r00543b36963388ce-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            {state.missingWeekdays.map((wd, index) => <SelectItem key={wd} value={wd} className="rounded-none" data-api-unique-id="businessinfomanagementview-refdc651abdd8192b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                {state.labels.weekday[wd as WeekdayKey]}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-[200px]" data-api-unique-id="businessinfomanagementview-r871c13afe86432fe-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <Input placeholder="e.g. 11:30 AM - 10:30 PM" className="h-9 rounded-sm bg-background px-3" value={state.recoverLine} onChange={e => handlers.setRecoverLine(e.target.value)} disabled={!state.recoverWeekday} data-api-unique-id="businessinfomanagementview-re5848d2e00362320-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                      </div>
                      <Button size="sm" onClick={handlers.handleRecoverHour} disabled={!state.recoverWeekday || state.isRecovering} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-9 px-4 rounded-sm flex-shrink-0" data-api-unique-id="businessinfomanagementview-rdc2c6be341e474f0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        {state.isRecovering ? <RefreshCw className="h-3 w-3 animate-spin mr-2" data-api-unique-id="businessinfomanagementview-rf2a7bfbed8074ad2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" /> : <RotateCcw className="h-3 w-3 mr-2" data-api-unique-id="businessinfomanagementview-r4eec7046675acbbe-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />}
                        Reinstate
                      </Button>
                    </div>
                  </div>

                  {/* Hours List Table */}
                  <div className="rounded-sm border border-muted-foreground/20 overflow-hidden" data-api-unique-id="businessinfomanagementview-r420b9469c022a2eb-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <Table data-api-unique-id="businessinfomanagementview-r0460a4c6b9cdae07-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <TableHeader className="bg-muted/50" data-api-unique-id="businessinfomanagementview-rf734ea7c9e2def29-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <TableRow className="border-b border-muted-foreground/20 hover:bg-transparent" data-api-unique-id="businessinfomanagementview-r9a18b55987eedeb2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                          <TableHead className="font-header text-foreground italic py-3" data-api-unique-id="businessinfomanagementview-redb682a2e35b102c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Weekday</TableHead>
                          <TableHead className="font-header text-foreground italic py-3" data-api-unique-id="businessinfomanagementview-rc0aab37c5a858ac2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Display Line</TableHead>
                          <TableHead className="font-header text-foreground italic py-3 text-right" data-api-unique-id="businessinfomanagementview-r9bd9f44fb1840e77-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Operations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody data-api-unique-id="businessinfomanagementview-r2e08278982cb8cb0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        {state.profileData.hours_records.map((record, index) => <TableRow key={record.hour_weekday} className="border-b border-muted-foreground/10 last:border-0 hover:bg-muted/5" data-api-unique-id="businessinfomanagementview-r1fb45fb70863997a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                            <TableCell className="font-medium text-sm py-4" data-api-unique-id="businessinfomanagementview-r2732c9f564e06b5f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                              {state.labels.weekday[record.hour_weekday as WeekdayKey]}
                            </TableCell>
                            <TableCell className="py-4" data-api-unique-id="businessinfomanagementview-rfa1a74433933518a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                              {record.hour_recordStatus === 'PRESENT' ? <Input className="h-9 max-w-sm rounded-sm bg-background border-muted px-3 focus-visible:ring-1 focus-visible:ring-secondary/50" value={state.hoursLines[record.hour_weekday] ?? ''} onChange={e => handlers.handleHourLineChange(record.hour_weekday, e.target.value)} data-api-unique-id="businessinfomanagementview-r94ccdea5e230be32-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" /> : <span className="text-xs uppercase font-bold text-destructive tracking-widest bg-destructive/5 px-2 py-1 rounded-sm" data-api-unique-id="businessinfomanagementview-r3d00c97986aa53ec-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  {state.labels.recordStatus.MISSING}
                                </span>}
                            </TableCell>
                            <TableCell className="text-right py-4" data-api-unique-id="businessinfomanagementview-r5e91106973899447-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                              {record.hour_recordStatus === 'PRESENT' && record.hour_id && <div className="flex justify-end gap-2" data-api-unique-id="businessinfomanagementview-rb9ab873d14b86e92-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  <Button variant="outline" size="sm" className="h-8 rounded-sm border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground" onClick={() => handlers.handleSaveHour(record.hour_id!, record.hour_weekday)} data-api-unique-id="businessinfomanagementview-rcc0f948110330185-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                    Update
                                  </Button>
                                  <Button variant="destructive" size="sm" className="h-8 w-8 p-0 rounded-sm" onClick={() => handlers.handleDeleteHour(record.hour_id!)} data-api-unique-id="businessinfomanagementview-r0f3cae127aba6b1d-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                    <Trash2 className="h-4 w-4" data-api-unique-id="businessinfomanagementview-rc26f9e223d3db13f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" />
                                  </Button>
                                </div>}
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Validation & System Status Pane */}
            <div className="lg:col-span-5 space-y-8" data-api-unique-id="businessinfomanagementview-r2788291fa9668214-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
              
              {/* Reference Comparison Panel */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden" data-api-unique-id="businessinfomanagementview-ra195e4d8e2c49660-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <CardHeader className="bg-secondary/5 border-b py-4" data-api-unique-id="businessinfomanagementview-ra057514b6b48aaed-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="flex items-center gap-3" data-api-unique-id="businessinfomanagementview-rae9ec4a146a09f52-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <ShieldCheck className="h-5 w-5 text-secondary" data-api-unique-id="businessinfomanagementview-rf7bf482a66fec5ba-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    <CardTitle className="font-header text-2xl italic font-medium" data-api-unique-id="businessinfomanagementview-r538f07178f4a301e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Source Alignment Audit</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-body uppercase tracking-tight text-muted-foreground" data-api-unique-id="businessinfomanagementview-rbb7f9f2999b484ec-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    Cross-referencing live data against architectural records
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0" data-api-unique-id="businessinfomanagementview-r4bc4f139036fb25e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="p-6 space-y-8" data-api-unique-id="businessinfomanagementview-r9c6bdd0a1899c840-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    {/* Identity Validation */}
                    <div className="space-y-4" data-api-unique-id="businessinfomanagementview-r71c2300eddf9c85e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <h3 className="font-header text-lg italic text-foreground flex items-center gap-2" data-api-unique-id="businessinfomanagementview-rcb3801946e4e8cc7-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <span className="h-1 w-8 bg-secondary/30" data-api-unique-id="businessinfomanagementview-r592627bfa02bf85b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                        Identity Validation
                      </h3>
                      <div className="rounded-sm border border-muted overflow-hidden" data-api-unique-id="businessinfomanagementview-r7a0241fca99823c5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <Table data-api-unique-id="businessinfomanagementview-r5e56b6be68dffedb-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                          <TableHeader className="bg-muted/30" data-api-unique-id="businessinfomanagementview-r1116a153d04075f6-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            <TableRow className="hover:bg-transparent" data-api-unique-id="businessinfomanagementview-r12fc1ec9b60d9b29-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" data-api-unique-id="businessinfomanagementview-r69a8c7372f6e5d21-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Field</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" data-api-unique-id="businessinfomanagementview-rafe214173b7de43a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Current</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right" data-api-unique-id="businessinfomanagementview-r67b712ea54281d6d-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="font-body text-xs" data-api-unique-id="businessinfomanagementview-r7330f816a0cc41f2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            {[{
                            label: 'Name',
                            live: state.profileData.identity_info.restaurant_name,
                            source: state.profileData.identity_source.source_name,
                            status: state.profileData.identity_validation.name_status
                          }, {
                            label: 'Address',
                            live: state.profileData.identity_info.restaurant_address,
                            source: state.profileData.identity_source.source_address,
                            status: state.profileData.identity_validation.address_status
                          }, {
                            label: 'Phone',
                            live: state.profileData.identity_info.restaurant_phone,
                            source: state.profileData.identity_source.source_phone,
                            status: state.profileData.identity_validation.phone_status
                          }, {
                            label: 'Rating',
                            live: state.profileData.identity_info.restaurant_rating,
                            source: state.profileData.identity_source.source_rating,
                            status: state.profileData.identity_validation.rating_status
                          }].map((row, index) => <TableRow key={index} className="hover:bg-muted/5" data-api-unique-id="businessinfomanagementview-r5c0e6bff26b912de-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                <TableCell className="font-medium text-muted-foreground py-3" data-api-unique-id="businessinfomanagementview-rc872e458c28d0f31-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" data-api-bind-info={`list-${index}-label`} data-api-map-var-name='row'>{row.label}</TableCell>
                                <TableCell className="py-3" data-api-unique-id="businessinfomanagementview-rc7a1ff9d624c43c7-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  <div className="flex flex-col gap-0.5" data-api-unique-id="businessinfomanagementview-rb22fc120793b4f83-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                    <span className="truncate max-w-[120px] font-medium" data-api-unique-id="businessinfomanagementview-r8981120ccba63ea8-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" data-api-bind-info={`list-${index}-live`} data-api-map-var-name='row'>{row.live}</span>
                                    <span className="truncate max-w-[120px] text-[10px] text-muted-foreground italic" data-api-unique-id="businessinfomanagementview-r82807a5fb38fa320-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" data-api-bind-info={`list-${index}-source`} data-api-map-var-name='row'>Target: {row.source}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right py-3" data-api-unique-id="businessinfomanagementview-ra9425bb4344a2916-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  <Badge variant={row.status === 'MATCHED' ? "secondary" : "destructive"} className={`rounded-full h-5 w-5 p-0 flex items-center justify-center ml-auto ${row.status === 'MATCHED' ? 'bg-secondary/10 text-secondary border-none' : 'bg-destructive/10 text-destructive border-none'}`} data-api-unique-id="businessinfomanagementview-r2cd103b6a6786645-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                    {row.status === 'MATCHED' ? <CheckCircle2 className="h-3 w-3" data-api-unique-id="businessinfomanagementview-rd7622636b722ef11-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" /> : <AlertCircle className="h-3 w-3" data-api-unique-id="businessinfomanagementview-r35bb29b1d1f952f9-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1" />}
                                  </Badge>
                                </TableCell>
                              </TableRow>)}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Hours Validation */}
                    <div className="space-y-4" data-api-unique-id="businessinfomanagementview-rcda19039192bed4a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <h3 className="font-header text-lg italic text-foreground flex items-center gap-2" data-api-unique-id="businessinfomanagementview-r865618543dc33db4-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <span className="h-1 w-8 bg-secondary/30" data-api-unique-id="businessinfomanagementview-rf2df2fbca498de75-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                        Hours Validation
                      </h3>
                      <div className="rounded-sm border border-muted overflow-hidden" data-api-unique-id="businessinfomanagementview-r5ada1f855cd8e5c0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        <Table data-api-unique-id="businessinfomanagementview-rd79e8b22340a073e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                          <TableHeader className="bg-muted/30" data-api-unique-id="businessinfomanagementview-r416e9f43df803b7e-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            <TableRow className="hover:bg-transparent" data-api-unique-id="businessinfomanagementview-r782d9ec046b0cfa5-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" data-api-unique-id="businessinfomanagementview-r57b07b1cccebd07f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Day</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" data-api-unique-id="businessinfomanagementview-r17d747aba2df290d-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Audit</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right" data-api-unique-id="businessinfomanagementview-r8385b1b73d4c7a1c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="font-body text-[11px]" data-api-unique-id="businessinfomanagementview-r296f74274ae39e3b-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                            {state.profileData.hours_records.slice(0, 7).map((record, index) => <TableRow key={`audit-${record.hour_weekday}`} className="hover:bg-muted/5" data-api-unique-id="businessinfomanagementview-r1eccc6489789e565-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                <TableCell className="font-medium py-2.5" data-api-unique-id="businessinfomanagementview-r990528e4c83ab2d2-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  {state.labels.weekday[record.hour_weekday as WeekdayKey].substring(0, 3)}
                                </TableCell>
                                <TableCell className="py-2.5 max-w-[150px] truncate italic text-muted-foreground" data-api-unique-id="businessinfomanagementview-r1fd895a78a2f6a02-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  {record.hour_fullLine || 'Empty Record'}
                                </TableCell>
                                <TableCell className="text-right py-2.5" data-api-unique-id="businessinfomanagementview-r1ac45ac5fedd9708-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                  {record.hour_recordStatus === 'MISSING' ? <Badge className="bg-destructive/10 text-destructive text-[9px] border-none px-1.5 py-0" data-api-unique-id="businessinfomanagementview-rb40a70a4a4fbdac7-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">MISSING</Badge> : <Badge className={`text-[9px] border-none px-1.5 py-0 ${record.hour_matchStatus === 'MATCHED' ? 'bg-secondary/10 text-secondary' : 'bg-accent/30 text-accent-foreground'}`} data-api-unique-id="businessinfomanagementview-r9799f7c42ed6d7d4-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" data-api-in-loop="1">
                                      {record.hour_matchStatus ? state.labels.matchStatus[record.hour_matchStatus] : '--'}
                                    </Badge>}
                                </TableCell>
                              </TableRow>)}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Status Panel */}
              <Card className="rounded-none border-border shadow-xs bg-card border-l-4 border-l-primary/60" data-api-unique-id="businessinfomanagementview-r27cac8218a95bee6-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                <CardHeader className="py-4" data-api-unique-id="businessinfomanagementview-redc31c1456bddc7c-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <CardTitle className="font-header text-xl italic font-medium" data-api-unique-id="businessinfomanagementview-re32ab34cd407ee38-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Deployment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5" data-api-unique-id="businessinfomanagementview-r8725ebf64e19e7ad-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                  <div className="flex items-start gap-3" data-api-unique-id="businessinfomanagementview-rb3149724a3c5487a-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary animate-pulse" data-api-unique-id="businessinfomanagementview-r75fd1a58a77e7fa4-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                    <div className="space-y-1" data-api-unique-id="businessinfomanagementview-r5f2bd6daaabb9fa0-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block" data-api-unique-id="businessinfomanagementview-rc6824319e30b349f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Synchronization Confirmation</Label>
                      <p className="text-sm font-medium leading-tight" data-api-unique-id="businessinfomanagementview-r289f3ad74e848c43-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Actively synced with public rendering engine.</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-muted" data-api-unique-id="businessinfomanagementview-r8583b683f29d519f-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />

                  <div className="space-y-1" data-api-unique-id="businessinfomanagementview-rf31c5c4039e31370-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block" data-api-unique-id="businessinfomanagementview-re7e4e9d4468b5fbd-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">Last System Update</Label>
                    <div className="flex items-center gap-2 text-sm text-foreground" data-api-unique-id="businessinfomanagementview-rc942523023c16fff-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" data-api-unique-id="businessinfomanagementview-rd2b437f6005b02a3-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView" />
                      <span className="font-mono tabular-nums text-xs" data-api-unique-id="businessinfomanagementview-r23a5c7debecdb622-s3008419800" data-api-unique-page-name="src/backend/components/BusinessInfoManagementView">
                        {new Date(state.profileData.last_system_update).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </main>;
};