'use client'

import React from 'react'
import type { WeekdayKey } from '@/backend/actions/BusinessInfoManagement'
import type { 
  BusinessInfoManagementState, 
  BusinessInfoManagementHandlers 
} from '@/backend/hooks/useBusinessInfoManagement'

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// Icons
import { 
  Save, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Store, 
  ShieldCheck,
  RefreshCw
} from "lucide-react"

interface Props {
  state: BusinessInfoManagementState
  handlers: BusinessInfoManagementHandlers
}

export const BusinessInfoManagementView = ({ state, handlers }: Props) => {
  if (state.isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="font-header text-xl text-muted-foreground italic">Gathering profile details...</p>
        </div>
      </div>
    )
  }

  if (!state.profileData || !state.identityForm) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="font-display text-2xl text-foreground">Data Acquisition Failure</h2>
          <p className="font-body text-muted-foreground">We were unable to retrieve the restaurant configuration. Please refresh the dashboard or contact technical support.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background font-body text-foreground pb-20">
      {/* Global Header Area */}
      <section className="w-full border-b bg-card" data-controller-name="Global Navigation & Actions">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <Breadcrumb>
                <BreadcrumbList className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                  <BreadcrumbItem>Management</BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Configuration</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="font-display text-4xl font-normal text-foreground">Business Profile & Hours</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border rounded-md">
                <span className="text-xs font-medium uppercase tracking-tighter text-muted-foreground">Dataset Status</span>
                <Badge 
                  variant={state.profileData.is_dataset_complete ? "outline" : "destructive"}
                  className={`rounded-sm px-2 py-0.5 text-[10px] font-bold ${state.profileData.is_dataset_complete ? 'border-secondary text-secondary' : 'bg-destructive text-destructive-foreground'}`}
                >
                  {state.profileData.is_dataset_complete ? 'COMPLETE' : 'INCOMPLETE'}
                </Badge>
              </div>
              <Button 
                onClick={handlers.handleSaveIdentity} 
                disabled={state.isSavingIdentity}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 shadow-sm transition-all active:scale-95"
              >
                {state.isSavingIdentity ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content View */}
      <section className="w-full" data-controller-name="Editorial Management Grid">
        <div className="container mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Data Management Pane */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Business Identity Container */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b py-4">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-secondary" />
                    <CardTitle className="font-header text-2xl italic font-medium">Core Identity Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Restaurant Name</Label>
                      <Input 
                        className="rounded-md border-input focus:ring-ring bg-background px-3 h-10"
                        value={state.identityForm.restaurant_name} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_name', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Physical Address</Label>
                      <Textarea 
                        className="rounded-md border-input min-h-[80px] bg-background px-3 py-2 resize-none"
                        value={state.identityForm.restaurant_address} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_address', e.target.value)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Phone</Label>
                      <Input 
                        className="rounded-md border-input bg-background px-3 h-10"
                        value={state.identityForm.restaurant_phone} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_phone', e.target.value)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Website</Label>
                      <Input 
                        className="rounded-md border-input bg-background px-3 h-10"
                        value={state.identityForm.restaurant_website} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_website', e.target.value)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aggregate Rating</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        className="rounded-md border-input bg-background px-3 h-10"
                        value={state.identityForm.restaurant_rating} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_rating', parseFloat(e.target.value) || 0)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Reviews</Label>
                      <Input 
                        type="number"
                        className="rounded-md border-input bg-background px-3 h-10"
                        value={state.identityForm.restaurant_reviewCount} 
                        onChange={(e) => handlers.handleIdentityChange('restaurant_reviewCount', parseInt(e.target.value, 10) || 0)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours Container */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b py-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <CardTitle className="font-header text-2xl italic font-medium">Weekly Schedule Records</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  
                  {/* Recovery Selector */}
                  <div className="p-4 bg-muted/20 border-l-4 border-secondary/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-header italic text-secondary-foreground">Missing Line Recovery</Label>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground rounded-sm text-[10px]">{state.missingWeekdays.length} Days Remaining</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="w-[180px] flex-shrink-0">
                        <Select 
                          value={state.recoverWeekday} 
                          onValueChange={handlers.setRecoverWeekday} 
                          disabled={state.missingWeekdays.length === 0}
                        >
                          <SelectTrigger className="h-9 rounded-sm border-secondary/30 bg-background px-3">
                            <SelectValue placeholder="Target Weekday" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-border">
                            {state.missingWeekdays.map(wd => (
                              <SelectItem key={wd} value={wd} className="rounded-none">
                                {state.labels.weekday[wd as WeekdayKey]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <Input 
                          placeholder="e.g. 11:30 AM - 10:30 PM" 
                          className="h-9 rounded-sm bg-background px-3"
                          value={state.recoverLine}
                          onChange={(e) => handlers.setRecoverLine(e.target.value)}
                          disabled={!state.recoverWeekday}
                        />
                      </div>
                      <Button 
                        size="sm"
                        onClick={handlers.handleRecoverHour} 
                        disabled={!state.recoverWeekday || state.isRecovering}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-9 px-4 rounded-sm flex-shrink-0"
                      >
                        {state.isRecovering ? <RefreshCw className="h-3 w-3 animate-spin mr-2" /> : <RotateCcw className="h-3 w-3 mr-2" />}
                        Reinstate
                      </Button>
                    </div>
                  </div>

                  {/* Hours List Table */}
                  <div className="rounded-sm border border-muted-foreground/20 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow className="border-b border-muted-foreground/20 hover:bg-transparent">
                          <TableHead className="font-header text-foreground italic py-3">Weekday</TableHead>
                          <TableHead className="font-header text-foreground italic py-3">Display Line</TableHead>
                          <TableHead className="font-header text-foreground italic py-3 text-right">Operations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.profileData.hours_records.map(record => (
                          <TableRow key={record.hour_weekday} className="border-b border-muted-foreground/10 last:border-0 hover:bg-muted/5">
                            <TableCell className="font-medium text-sm py-4">
                              {state.labels.weekday[record.hour_weekday as WeekdayKey]}
                            </TableCell>
                            <TableCell className="py-4">
                              {record.hour_recordStatus === 'PRESENT' ? (
                                <Input 
                                  className="h-9 max-w-sm rounded-sm bg-background border-muted px-3 focus-visible:ring-1 focus-visible:ring-secondary/50"
                                  value={state.hoursLines[record.hour_weekday] ?? ''}
                                  onChange={(e) => handlers.handleHourLineChange(record.hour_weekday, e.target.value)}
                                />
                              ) : (
                                <span className="text-xs uppercase font-bold text-destructive tracking-widest bg-destructive/5 px-2 py-1 rounded-sm">
                                  {state.labels.recordStatus.MISSING}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              {record.hour_recordStatus === 'PRESENT' && record.hour_id && (
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 rounded-sm border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                                    onClick={() => handlers.handleSaveHour(record.hour_id!, record.hour_weekday)}
                                  >
                                    Update
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-sm"
                                    onClick={() => handlers.handleDeleteHour(record.hour_id!)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Validation & System Status Pane */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Reference Comparison Panel */}
              <Card className="rounded-none border-border shadow-xs bg-card overflow-hidden">
                <CardHeader className="bg-secondary/5 border-b py-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                    <CardTitle className="font-header text-2xl italic font-medium">Source Alignment Audit</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-body uppercase tracking-tight text-muted-foreground">
                    Cross-referencing live data against architectural records
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 space-y-8">
                    {/* Identity Validation */}
                    <div className="space-y-4">
                      <h3 className="font-header text-lg italic text-foreground flex items-center gap-2">
                        <span className="h-1 w-8 bg-secondary/30" />
                        Identity Validation
                      </h3>
                      <div className="rounded-sm border border-muted overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Field</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Current</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="font-body text-xs">
                            {[
                              { label: 'Name', live: state.profileData.identity_info.restaurant_name, source: state.profileData.identity_source.source_name, status: state.profileData.identity_validation.name_status },
                              { label: 'Address', live: state.profileData.identity_info.restaurant_address, source: state.profileData.identity_source.source_address, status: state.profileData.identity_validation.address_status },
                              { label: 'Phone', live: state.profileData.identity_info.restaurant_phone, source: state.profileData.identity_source.source_phone, status: state.profileData.identity_validation.phone_status },
                              { label: 'Rating', live: state.profileData.identity_info.restaurant_rating, source: state.profileData.identity_source.source_rating, status: state.profileData.identity_validation.rating_status },
                            ].map((row, idx) => (
                              <TableRow key={idx} className="hover:bg-muted/5">
                                <TableCell className="font-medium text-muted-foreground py-3">{row.label}</TableCell>
                                <TableCell className="py-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="truncate max-w-[120px] font-medium">{row.live}</span>
                                    <span className="truncate max-w-[120px] text-[10px] text-muted-foreground italic">Target: {row.source}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <Badge 
                                    variant={row.status === 'MATCHED' ? "secondary" : "destructive"}
                                    className={`rounded-full h-5 w-5 p-0 flex items-center justify-center ml-auto ${row.status === 'MATCHED' ? 'bg-secondary/10 text-secondary border-none' : 'bg-destructive/10 text-destructive border-none'}`}
                                  >
                                    {row.status === 'MATCHED' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Hours Validation */}
                    <div className="space-y-4">
                      <h3 className="font-header text-lg italic text-foreground flex items-center gap-2">
                        <span className="h-1 w-8 bg-secondary/30" />
                        Hours Validation
                      </h3>
                      <div className="rounded-sm border border-muted overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Day</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Audit</TableHead>
                              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-right">Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="font-body text-[11px]">
                            {state.profileData.hours_records.slice(0, 7).map(record => (
                              <TableRow key={`audit-${record.hour_weekday}`} className="hover:bg-muted/5">
                                <TableCell className="font-medium py-2.5">
                                  {state.labels.weekday[record.hour_weekday as WeekdayKey].substring(0, 3)}
                                </TableCell>
                                <TableCell className="py-2.5 max-w-[150px] truncate italic text-muted-foreground">
                                  {record.hour_fullLine || 'Empty Record'}
                                </TableCell>
                                <TableCell className="text-right py-2.5">
                                  {record.hour_recordStatus === 'MISSING' ? (
                                    <Badge className="bg-destructive/10 text-destructive text-[9px] border-none px-1.5 py-0">MISSING</Badge>
                                  ) : (
                                    <Badge 
                                      className={`text-[9px] border-none px-1.5 py-0 ${record.hour_matchStatus === 'MATCHED' ? 'bg-secondary/10 text-secondary' : 'bg-accent/30 text-accent-foreground'}`}
                                    >
                                      {record.hour_matchStatus ? state.labels.matchStatus[record.hour_matchStatus] : '--'}
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Status Panel */}
              <Card className="rounded-none border-border shadow-xs bg-card border-l-4 border-l-primary/60">
                <CardHeader className="py-4">
                  <CardTitle className="font-header text-xl italic font-medium">Deployment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Synchronization Confirmation</Label>
                      <p className="text-sm font-medium leading-tight">Actively synced with public rendering engine.</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-muted" />

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Last System Update</Label>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono tabular-nums text-xs">
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
    </main>
  )
}
