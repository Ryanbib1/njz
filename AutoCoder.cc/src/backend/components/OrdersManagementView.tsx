'use client';

import React from 'react';
import { RefreshCcw, Download, Printer, ChevronLeft, ChevronRight, Eye, Clock, CheckCircle2, Package, CreditCard, AlertCircle, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { FoodOrderStatus, PaymentStatus } from '@/backend/actions/OrdersManagement';
import { OrdersManagementState, OrdersManagementHandlers, FOOD_ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_PROVIDER_LABELS } from '@/backend/hooks/useOrdersManagement';
import { useOrdersManagement } from '@/backend/hooks/useOrdersManagement';
interface Props {
  state: OrdersManagementState;
  handlers: OrdersManagementHandlers;
}

/**
 * Status Badge Style Mapper
 */
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'bg-muted text-muted-foreground border-transparent';
    case 'PAID':
      return 'bg-accent text-accent-foreground border-transparent';
    case 'PREPARING':
      return 'bg-secondary text-secondary-foreground border-transparent';
    case 'READY_FOR_PICKUP':
      return 'bg-primary text-primary-foreground border-transparent';
    case 'COMPLETED':
      return 'bg-secondary text-secondary-foreground border-transparent opacity-80';
    case 'CANCELLED':
      return 'bg-destructive text-destructive-foreground border-transparent';
    default:
      return 'bg-muted text-muted-foreground border-transparent';
  }
};
export const OrdersManagementView = ({
  state,
  handlers
}: Props) => {
  return <div className="min-h-screen bg-background font-body" data-api-unique-id="ordersmanagementview-rdf52dbc8662619b7-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
      {/* 1. Header & Metrics Section */}
      <section className="w-full border-b border-border/50" data-controller-name="Orders Overview & Metrics" data-api-unique-id="ordersmanagementview-r96c450738958935d-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
        <div className="container mx-auto px-8 py-10" data-api-unique-id="ordersmanagementview-r9a88e77dbcbcea6c-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12" data-api-unique-id="ordersmanagementview-r37b3230c82338fc4-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            <div data-api-unique-id="ordersmanagementview-rb6eed30b049e39eb-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <h1 className="font-display text-5xl font-medium tracking-tight text-foreground mb-2 italic" data-api-unique-id="ordersmanagementview-r7922b9ef7112e070-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                Orders Management
              </h1>
              <p className="font-header text-xl text-muted-foreground italic" data-api-unique-id="ordersmanagementview-rd8c4204b955ba930-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                Oversee culinary operations and transaction history
              </p>
            </div>
            <div className="flex items-center gap-3" data-api-unique-id="ordersmanagementview-r985ee4afeca03417-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <Button variant="outline" className="rounded-md border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all h-10 px-6 font-medium" onClick={handlers.handleRefresh} disabled={state.isListLoading} data-api-unique-id="ordersmanagementview-r2faf7a89221ece2e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <RefreshCcw className={`mr-2 h-4 w-4 ${state.isListLoading ? 'animate-spin' : ''}`} data-api-unique-id="ordersmanagementview-rb9963d906207c368-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                Refresh
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-10 px-6 font-medium" onClick={handlers.handleExport} disabled={state.isExporting || state.isListLoading} data-api-unique-id="ordersmanagementview-rbb1217c20ff00331-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <Download className="mr-2 h-4 w-4" data-api-unique-id="ordersmanagementview-rbcd4e8a7933fd2c7-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                {state.isExporting ? 'Exporting...' : 'Export Orders'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-api-unique-id="ordersmanagementview-r8b4d01f177b8fa05-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            {[{
            label: "Pending Preparation",
            value: state.metrics.pendingPreparation,
            icon: Clock
          }, {
            label: "Ready for Pickup",
            value: state.metrics.readyForPickup,
            icon: Package
          }, {
            label: "Pending Payment",
            value: state.metrics.pendingPayment,
            icon: CreditCard
          }, {
            label: "Completed Today",
            value: state.metrics.completedToday,
            icon: CheckCircle2
          }].map((metric, index) => <Card key={index} className="rounded-lg border border-border/40 shadow-xs overflow-hidden" data-api-unique-id="ordersmanagementview-r0d7890b961a60277-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                <CardContent className="p-6 flex items-center justify-between" data-api-unique-id="ordersmanagementview-r98f5e0cea76826b2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                  <div data-api-unique-id="ordersmanagementview-r88053ffefcac1071-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1" data-api-unique-id="ordersmanagementview-r1703e0eb39af96f3-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1" data-api-bind-info={`list-${index}-label`} data-api-map-var-name='metric'>{metric.label}</p>
                    <p className="text-4xl font-header font-bold text-foreground italic" data-api-unique-id="ordersmanagementview-rb9b30bb05ffab83c-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                      {state.isListLoading ? '...' : metric.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center" data-api-unique-id="ordersmanagementview-r7b6f79e5508a996c-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                    <metric.icon className="h-6 w-6 text-secondary" data-api-unique-id="ordersmanagementview-r65f2f6f885f5d72d-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1" data-api-bind-info={`list-${index}-icon`} data-api-map-var-name='metric' />
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* 2. Filters & Data Grid Section */}
      <section className="w-full" data-controller-name="Orders Data Management" data-api-unique-id="ordersmanagementview-r3c58f3bd8ba8081a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
        <div className="container mx-auto px-8 py-8" data-api-unique-id="ordersmanagementview-rbe046d8f27593338-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
          {/* Filter Bar */}
          <div className="bg-card border border-border/40 rounded-lg p-6 mb-8 shadow-xs" data-api-unique-id="ordersmanagementview-r4305cc407c8e8d65-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            <div className="flex flex-wrap items-end gap-4" data-api-unique-id="ordersmanagementview-r19e65b857e9cb7fd-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <div className="flex-1 min-w-[240px]" data-api-unique-id="ordersmanagementview-r0da7117f2762aee0-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block" data-api-unique-id="ordersmanagementview-r0176c4c8ce5a0097-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Search Order</label>
                <Input value={state.localSearchInput} onChange={e => handlers.setLocalSearchInput(e.target.value)} placeholder="Order No, Customer, Phone" className="bg-muted/30 border-input h-10 px-4 focus:ring-1 focus:ring-primary rounded-md" data-api-unique-id="ordersmanagementview-ra1e4ee7846ae9915-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
              </div>

              <div className="w-[180px] flex-shrink-0" data-api-unique-id="ordersmanagementview-r1d6b9f4704231fb5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block" data-api-unique-id="ordersmanagementview-rd1e14fcff1585c2b-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Order Status</label>
                <Select value={state.statusFilter} onValueChange={val => handlers.setStatusFilter(val as FoodOrderStatus | 'ALL')} data-api-unique-id="ordersmanagementview-rdf1186957975f9d4-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <SelectTrigger className="h-10 bg-muted/30 border-input rounded-md" data-api-unique-id="ordersmanagementview-r5b782c2cbd316bdc-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <SelectValue placeholder="All Statuses" data-api-unique-id="ordersmanagementview-rd83a857d170ff2fa-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md" data-api-unique-id="ordersmanagementview-rde44a8ac1d3baa15-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <SelectItem value="ALL" data-api-unique-id="ordersmanagementview-r5166a2e6b179cdca-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">All Statuses</SelectItem>
                    {Object.entries(FOOD_ORDER_STATUS_LABELS).map(([key, label], index) => <SelectItem key={key} value={key} className="rounded-md" data-api-unique-id="ordersmanagementview-rb0fe982055d81c1c-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px] flex-shrink-0" data-api-unique-id="ordersmanagementview-r5c6f2d21cecef8dd-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block" data-api-unique-id="ordersmanagementview-r35c88991d09189cf-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Payment</label>
                <Select value={state.paymentFilter} onValueChange={val => handlers.setPaymentFilter(val as PaymentStatus | 'ALL')} data-api-unique-id="ordersmanagementview-rcb8730f70c25dba5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <SelectTrigger className="h-10 bg-muted/30 border-input rounded-md" data-api-unique-id="ordersmanagementview-re8f8b9a9b30ea7e8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <SelectValue placeholder="All Payments" data-api-unique-id="ordersmanagementview-rcbdfd2bbf9fdc6ea-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md" data-api-unique-id="ordersmanagementview-r78a7f59d1d4eab9c-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <SelectItem value="ALL" data-api-unique-id="ordersmanagementview-rae103a59b592cbfe-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">All Payments</SelectItem>
                    {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label], index) => <SelectItem key={key} value={key} className="rounded-md" data-api-unique-id="ordersmanagementview-r12b0974c8a37ee59-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[160px] flex-shrink-0" data-api-unique-id="ordersmanagementview-r4ebfa1ec0f2ff4bb-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block" data-api-unique-id="ordersmanagementview-r230ae7473ed8ff87-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Start Date</label>
                <Input type="date" value={state.dateStart} onChange={e => handlers.setDateStart(e.target.value)} className="h-10 bg-muted/30 border-input px-4 rounded-md" data-api-unique-id="ordersmanagementview-r24a2b240d7d4100e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
              </div>

              <div className="w-[160px] flex-shrink-0" data-api-unique-id="ordersmanagementview-r0d31e5dd016ed463-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block" data-api-unique-id="ordersmanagementview-r695bceb2b9a4f1e8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">End Date</label>
                <Input type="date" value={state.dateEnd} onChange={e => handlers.setDateEnd(e.target.value)} className="h-10 bg-muted/30 border-input px-4 rounded-md" data-api-unique-id="ordersmanagementview-r2c47f8182014607a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
              </div>

              <div className="flex items-center gap-2" data-api-unique-id="ordersmanagementview-rd6d3fa681fed57e4-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <Button onClick={handlers.handleApplyFilters} disabled={state.isListLoading} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-6 rounded-md font-medium" data-api-unique-id="ordersmanagementview-r500eeddd509a636a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  Apply
                </Button>
                <Button variant="ghost" onClick={handlers.handleClearFilters} disabled={state.isListLoading} className="text-muted-foreground hover:text-foreground h-10 rounded-md" data-api-unique-id="ordersmanagementview-r17129b4687a49e96-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border/40 rounded-lg shadow-sm overflow-hidden" data-api-unique-id="ordersmanagementview-rf216ba5e129a6522-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            <Table data-api-unique-id="ordersmanagementview-rb8a99ea99eb9c596-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <TableHeader className="bg-muted/40" data-api-unique-id="ordersmanagementview-rac062b0f3b0a0858-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <TableRow className="hover:bg-transparent border-border/40" data-api-unique-id="ordersmanagementview-r7d0bbdcb256c4080-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="ordersmanagementview-r7cc030a4cde97173-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Order #</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="ordersmanagementview-r79b34a75fdbc65d9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Placed At</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id='ordersmanagementview-rfd3e3852bcffd1f2-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>Pickup Contact</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id='ordersmanagementview-rc49347c1d782c3fc-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>Customer Email</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right" data-api-unique-id="ordersmanagementview-rf253a2ee929fd46e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Amount</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="ordersmanagementview-r8d5eabb1b313d222-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Payment</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="ordersmanagementview-rbd4eb314733d7ccd-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Status</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center" data-api-unique-id="ordersmanagementview-r907a471d8ef0c4a6-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-api-unique-id="ordersmanagementview-r79a6501e11f4fc33-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                {state.isListLoading ? Array.from({
                length: 5
              }).map((_, index) => <TableRow key={index} className="animate-pulse" data-api-unique-id="ordersmanagementview-r2791d910fad3b56d-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                      <TableCell colSpan={8} className="h-16 bg-muted/10" data-api-unique-id='ordersmanagementview-rbf069a974fef67e6-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView' data-api-in-loop='1' />
                    </TableRow>) : state.orderList.length === 0 ? <TableRow data-api-unique-id="ordersmanagementview-r98831ffe7d24c995-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <TableCell colSpan={8} className="h-64 text-center" data-api-unique-id='ordersmanagementview-r973465e42e4e6f26-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                      <div className="flex flex-col items-center justify-center opacity-40" data-api-unique-id="ordersmanagementview-rd4362c1038915bde-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                        <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground" data-api-unique-id="ordersmanagementview-rd8321d70e9de783e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                        <p className="font-header text-2xl italic" data-api-unique-id="ordersmanagementview-rc1d6e5f743c613ad-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">No matching orders discovered</p>
                      </div>
                    </TableCell>
                  </TableRow> : state.orderList.map((order, index) => <TableRow key={order.foodOrder_id} className="hover:bg-muted/10 transition-colors border-border/20 group" data-api-unique-id="ordersmanagementview-r7825f38fe8406213-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                      <TableCell className="px-6 py-4 font-mono text-sm font-medium" data-api-unique-id="ordersmanagementview-rc075f3d470ebb636-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">{order.foodOrder_number}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground" data-api-unique-id="ordersmanagementview-rb1fcc9dfe140a6d9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        {new Date(order.foodOrder_created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                      </TableCell>
                      <TableCell className="px-6 py-4" data-api-unique-id="ordersmanagementview-r8611798080dd9835-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        <div className="flex flex-col" data-api-unique-id="ordersmanagementview-r8ea20703a38ad509-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                          <span className="text-sm font-semibold" data-api-unique-id="ordersmanagementview-rcc667facf1301133-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">{order.pickup_contact_name}</span>
                          <span className="text-xs text-muted-foreground font-mono" data-api-unique-id="ordersmanagementview-r7f45ece0086a0059-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">{order.pickup_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-[220px]" data-api-unique-id='ordersmanagementview-r08f0b639ab01685a-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView' data-api-in-loop='1'>
                        <span className="text-sm text-foreground break-all" data-api-unique-id='ordersmanagementview-rdcd06e5e59f9e545-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView' data-api-in-loop='1'>{order.customer_email}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-header text-lg italic text-primary" data-api-unique-id="ordersmanagementview-r211591e9c23e66b5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        ${order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 py-4" data-api-unique-id="ordersmanagementview-r697cb2fdf55dfc55-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        <Badge variant="outline" className="rounded-full px-3 font-normal capitalize" data-api-unique-id="ordersmanagementview-r517babce1624cc94-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                          {PAYMENT_STATUS_LABELS[order.payment_status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4" data-api-unique-id="ordersmanagementview-ra3aee4158365e909-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        <Badge className={`rounded-full px-4 py-0.5 text-[10px] font-bold uppercase tracking-tighter shadow-none ${getStatusStyles(order.foodOrder_status)}`} data-api-unique-id="ordersmanagementview-r9bb7f10345baaa82-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                          {FOOD_ORDER_STATUS_LABELS[order.foodOrder_status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center" data-api-unique-id="ordersmanagementview-r61a665ec4b26c88e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-secondary hover:text-secondary-foreground" onClick={() => handlers.handleViewDetail(order.foodOrder_id)} data-api-unique-id="ordersmanagementview-r23d229f49d8bb109-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1">
                          <Eye className="h-4 w-4" data-api-unique-id="ordersmanagementview-ra4f80300a74ed0f1-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" data-api-in-loop="1" />
                        </Button>
                      </TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-border/40 flex items-center justify-between bg-muted/20" data-api-unique-id="ordersmanagementview-r5314b96e5c053871-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <div className="text-xs text-muted-foreground" data-api-unique-id="ordersmanagementview-rb45fc72c790f5751-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <span className="font-medium text-foreground" data-api-unique-id="ordersmanagementview-r92f6a32d7be9acda-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{(state.page - 1) * state.pageSize + 1}</span> - <span className="font-medium text-foreground" data-api-unique-id="ordersmanagementview-r34788268b63a65d9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{Math.min(state.page * state.pageSize, state.totalCount)}</span> of <span className="font-medium text-foreground" data-api-unique-id="ordersmanagementview-rfcc5bdfef04ac66e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{state.totalCount}</span> records
              </div>
              <div className="flex items-center gap-6" data-api-unique-id="ordersmanagementview-ra3f2b1bca16f3366-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <div className="flex items-center gap-2" data-api-unique-id="ordersmanagementview-ra16eab8590949dfd-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <span className="text-xs text-muted-foreground" data-api-unique-id="ordersmanagementview-r4d739a6611fadb8b-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Rows:</span>
                  <Select value={state.pageSize.toString()} onValueChange={handlers.handlePageSizeChange} disabled={state.isListLoading} data-api-unique-id="ordersmanagementview-r7ae2af91bb1b9198-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <SelectTrigger className="h-8 w-20 bg-background text-xs rounded-md" data-api-unique-id="ordersmanagementview-rd36f1ec584f96047-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <SelectValue data-api-unique-id="ordersmanagementview-rb47d1245cb96d9d9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md" data-api-unique-id="ordersmanagementview-rbaaffca170ef0524-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <SelectItem value="10" className="rounded-md" data-api-unique-id="ordersmanagementview-r1745b042c3cbaee4-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">10</SelectItem>
                      <SelectItem value="20" className="rounded-md" data-api-unique-id="ordersmanagementview-r2af79b77b109f962-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">20</SelectItem>
                      <SelectItem value="50" className="rounded-md" data-api-unique-id="ordersmanagementview-ra68f1b965c605858-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1" data-api-unique-id="ordersmanagementview-r697ec7c00a6ce7db-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <Button variant="ghost" size="sm" disabled={state.page <= 1 || state.isListLoading} onClick={() => handlers.handlePageChange(state.page - 1)} className="h-8 w-8 p-0 rounded-md" data-api-unique-id="ordersmanagementview-r7a3952d636684004-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <ChevronLeft className="h-4 w-4" data-api-unique-id="ordersmanagementview-r387afb5750707f34-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                  </Button>
                  <div className="text-xs font-medium px-2" data-api-unique-id="ordersmanagementview-r62afa5b534030fb8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    {state.page} / {state.totalPages}
                  </div>
                  <Button variant="ghost" size="sm" disabled={state.page >= state.totalPages || state.isListLoading} onClick={() => handlers.handlePageChange(state.page + 1)} className="h-8 w-8 p-0 rounded-md" data-api-unique-id="ordersmanagementview-r39c7517a8c1b2dd1-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <ChevronRight className="h-4 w-4" data-api-unique-id="ordersmanagementview-r2202525fe64564f9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detail Drawer Section */}
      <Sheet open={state.isDetailOpen} onOpenChange={handlers.handleCloseDetail} data-api-unique-id="ordersmanagementview-r240c46fa8efbc3d6-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
        <SheetContent className="sm:max-w-xl p-0 bg-background rounded-l-none border-l-border flex flex-col h-full overflow-hidden" data-api-unique-id="ordersmanagementview-r8cab8176a9d32af2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
          <div className="p-8 border-b border-border/40 flex items-center justify-between bg-muted/10" data-api-unique-id="ordersmanagementview-rc4014f56e5b67a25-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            <SheetHeader className="text-left space-y-1" data-api-unique-id="ordersmanagementview-r5bae0372e67badf0-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
              <SheetTitle className="font-display text-3xl font-medium italic" data-api-unique-id="ordersmanagementview-r4c8cb816cb4e98af-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Order Information</SheetTitle>
              <SheetDescription className="font-header text-base text-muted-foreground italic" data-api-unique-id="ordersmanagementview-r753c6d13597253a6-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                {state.orderDetail ? `Order Reference: #${state.orderDetail.foodOrder_number}` : 'Retrieving transaction details...'}
              </SheetDescription>
            </SheetHeader>
            {state.orderDetail && <Button variant="outline" size="sm" onClick={handlers.handlePrintTicket} className="rounded-md border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all" data-api-unique-id="ordersmanagementview-rff9f245ff5433f55-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <Printer className="mr-2 h-4 w-4" data-api-unique-id="ordersmanagementview-r669f87fa9e14e5d7-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                Print
              </Button>}
          </div>

          <div className="flex-1 overflow-auto p-8" data-api-unique-id="ordersmanagementview-rda0c4f1eca369e2f-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
            {state.isDetailLoading ? <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50" data-api-unique-id="ordersmanagementview-r86f759b73a47ef9b-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <RefreshCcw className="h-8 w-8 animate-spin text-secondary" data-api-unique-id="ordersmanagementview-r0ab15040f9ad6326-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                <p className="font-header text-lg italic" data-api-unique-id="ordersmanagementview-r815a366f8f26c672-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Accessing digital registry...</p>
              </div> : !state.orderDetail ? <div className="p-6 bg-destructive/5 text-destructive rounded-lg border border-destructive/20 flex items-center gap-3" data-api-unique-id="ordersmanagementview-r90184a5ac33e9a75-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                <AlertCircle className="h-5 w-5" data-api-unique-id="ordersmanagementview-r8efbb9c268dbdd65-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />
                <p className="text-sm font-medium" data-api-unique-id="ordersmanagementview-r249472e9a6a969ab-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Record could not be retrieved at this time.</p>
              </div> : <div className="space-y-10" data-api-unique-id="ordersmanagementview-rc16b9e571cab4ea0-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                {/* Status & Actions Section */}
                <section data-api-unique-id="ordersmanagementview-r021a324944e263f9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <div className="flex items-center justify-between mb-6" data-api-unique-id="ordersmanagementview-rc5850c5a1bcf271b-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground" data-api-unique-id="ordersmanagementview-r87ff7ae6e3a5b192-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Workflow Control</h3>
                    <Badge className={`rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-tight ${getStatusStyles(state.orderDetail.foodOrder_status)}`} data-api-unique-id="ordersmanagementview-r1c48eb7a1675615a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      {FOOD_ORDER_STATUS_LABELS[state.orderDetail.foodOrder_status]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3" data-state={state.isUpdatingStatus ? 'loading' : 'idle'} data-api-unique-id="ordersmanagementview-r3d1f011d69f20b63-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <fieldset disabled={state.isUpdatingStatus} className="contents" data-api-unique-id="ordersmanagementview-r0244bd371fc243f4-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      {state.orderDetail.foodOrder_status === 'PAID' && <Button className="w-full bg-primary text-primary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('PREPARING')} data-api-unique-id="ordersmanagementview-r5b85252b195ec6ee-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          Commence Culinary Preparation
                        </Button>}
                      {state.orderDetail.foodOrder_status === 'PREPARING' && <Button className="w-full bg-secondary text-secondary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('READY_FOR_PICKUP')} data-api-unique-id="ordersmanagementview-r64376ad0e63a2cee-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          Transition to Pickup Ready
                        </Button>}
                      {state.orderDetail.foodOrder_status === 'READY_FOR_PICKUP' && <Button className="w-full bg-primary text-primary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('COMPLETED')} data-api-unique-id="ordersmanagementview-r0ed827ac27a77520-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          Finalize Fulfillment
                        </Button>}
                      {(state.orderDetail.foodOrder_status === 'PENDING_PAYMENT' || state.orderDetail.foodOrder_status === 'PAID') && <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-12 rounded-md font-semibold text-sm transition-all mt-2" onClick={() => handlers.handleUpdateStatus('CANCELLED')} data-api-unique-id="ordersmanagementview-r2f447292b9507ce5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          Void Order Transaction
                        </Button>}
                    </fieldset>
                  </div>
                </section>

                <Separator className="bg-border/30" data-api-unique-id="ordersmanagementview-r353b69c82b96dca6-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />

                {/* Contact Section */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]" data-api-unique-id='ordersmanagementview-rad054541845f883f-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                  <div className="space-y-4" data-api-unique-id="ordersmanagementview-r076053f60384f1f8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4" data-api-unique-id="ordersmanagementview-raa2b035ade50865b-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Patron Details</h3>
                    <div data-api-unique-id="ordersmanagementview-rc4202772779274f6-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <p className="text-xs text-muted-foreground mb-0.5" data-api-unique-id="ordersmanagementview-rc4e276c0006c6d29-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Name</p>
                      <p className="text-sm font-semibold" data-api-unique-id="ordersmanagementview-rf7bb02d93987033e-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{state.orderDetail.pickup_contact_name}</p>
                    </div>
                    <div data-api-unique-id="ordersmanagementview-r67da47a82ad0437d-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <p className="text-xs text-muted-foreground mb-0.5" data-api-unique-id="ordersmanagementview-rfe01fa78fd8ecfc5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Phone</p>
                      <p className="text-sm font-mono font-medium" data-api-unique-id="ordersmanagementview-r210f3130a7e44517-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{state.orderDetail.pickup_phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4" data-api-unique-id="ordersmanagementview-re0ff2698fce02882-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4" data-api-unique-id="ordersmanagementview-r68354341ad722605-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Fulfillment</h3>
                    <div data-api-unique-id="ordersmanagementview-r445c90732f74767a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <p className="text-xs text-muted-foreground mb-0.5" data-api-unique-id="ordersmanagementview-r13e6b0cf2a55bc55-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Method</p>
                      <p className="text-sm font-semibold capitalize" data-api-unique-id="ordersmanagementview-rd3e32f34a14d5332-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{state.orderDetail.fulfillment_method}</p>
                    </div>
                    <div data-api-unique-id="ordersmanagementview-r43c305eef8d2db18-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <p className="text-xs text-muted-foreground mb-0.5" data-api-unique-id="ordersmanagementview-re22626f531523315-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Email</p>
                      <p className="text-sm font-medium truncate" data-api-unique-id="ordersmanagementview-rd0ecd27248b9ca07-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{state.orderDetail.customer_email}</p>
                    </div>
                  </div>
                  <div className="space-y-4" data-api-unique-id='ordersmanagementview-r648567b17f19fa6b-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4" data-api-unique-id='ordersmanagementview-rc6ce3b30e3178867-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>Customer Email</h3>
                    <div className="rounded-md border border-border/40 bg-muted/20 px-4 py-3" data-api-unique-id='ordersmanagementview-r82389ba9c30a3ef9-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                      <div className="flex items-start gap-3" data-api-unique-id='ordersmanagementview-r93dc1acdab65b64e-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" data-api-unique-id='ordersmanagementview-re606431037e90fdd-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView' />
                        <p className="text-sm font-medium break-all" data-api-unique-id='ordersmanagementview-rb7c811a3f402d809-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>{state.orderDetail.customer_email}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="bg-border/30" data-api-unique-id="ordersmanagementview-re82e1a36339dfd65-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />

                {/* Items Section */}
                <section data-api-unique-id="ordersmanagementview-r93922f40005ba599-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6" data-api-unique-id="ordersmanagementview-r22c8d12fd2a1c3ef-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Culinary Selection</h3>
                  <div className="space-y-6" data-api-unique-id="ordersmanagementview-r9bdb627b49469820-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    {state.orderDetail.foodOrder_items?.map(item => <div key={item.item_id} className="flex justify-between items-start gap-4" data-api-unique-id="ordersmanagementview-r45503032f6d74678-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                        <div className="flex-1" data-api-unique-id="ordersmanagementview-r448f8fdfbf320843-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          <p className="text-sm font-semibold leading-tight mb-1" data-api-unique-id="ordersmanagementview-r0b32eaebb6fd7172-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{item.item_name}</p>
                          {item.item_notes && <p className="text-xs text-muted-foreground italic leading-relaxed" data-api-unique-id="ordersmanagementview-r3e0945de8b8cbff7-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Note: {item.item_notes}</p>}
                        </div>
                        <div className="text-right flex-shrink-0" data-api-unique-id="ordersmanagementview-r9f6236c57704e0f2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          <p className="text-xs font-medium text-muted-foreground mb-1" data-api-unique-id="ordersmanagementview-re5f082099860b5e9-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{item.quantity} × ${item.unit_price.toFixed(2)}</p>
                          <p className="text-sm font-bold font-header italic text-secondary" data-api-unique-id="ordersmanagementview-ra746ebafcde5b73f-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">${item.line_total.toFixed(2)}</p>
                        </div>
                      </div>)}
                    {(!state.orderDetail.foodOrder_items || state.orderDetail.foodOrder_items.length === 0) && <p className="text-sm italic text-muted-foreground text-center py-4" data-api-unique-id="ordersmanagementview-rdf3d84c4dc0b1513-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">No menu items detected.</p>}
                  </div>
                </section>

                <Separator className="bg-border/30" data-api-unique-id="ordersmanagementview-r2d61573b373095f8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />

                {/* Payment Section */}
                <section className="bg-muted/30 p-6 rounded-md" data-api-unique-id="ordersmanagementview-r4a4abd399f804b76-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6" data-api-unique-id="ordersmanagementview-r7fa379db6ca68ab2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Financial Reconciliation</h3>
                  <div className="space-y-3 mb-6" data-api-unique-id="ordersmanagementview-r3181f73a8d2f7029-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <div className="flex justify-between text-sm" data-api-unique-id="ordersmanagementview-rc4315647a53b9f39-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <span className="text-muted-foreground" data-api-unique-id="ordersmanagementview-rcf21d100961740d2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Subtotal</span>
                      <span className="font-medium font-mono" data-api-unique-id="ordersmanagementview-r94829d317186cb4d-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">${state.orderDetail.subtotal_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border/20" data-api-unique-id="ordersmanagementview-re03dc891aae5ef66-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <span className="text-sm font-bold uppercase tracking-wider" data-api-unique-id="ordersmanagementview-r65263d1b73c7ca53-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Total Amount</span>
                      <span className="text-2xl font-header font-bold italic text-primary" data-api-unique-id="ordersmanagementview-r750a5afbad9412c8-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">${state.orderDetail.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/20" data-api-unique-id="ordersmanagementview-rfcf5f667d5453dc0-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                    <div className="flex justify-between text-xs" data-api-unique-id='ordersmanagementview-r2394d8540c7be337-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>
                      <span className="text-muted-foreground" data-api-unique-id='ordersmanagementview-r8e792dddd8abb17a-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>Payment Status</span>
                      <span className="font-medium" data-api-unique-id='ordersmanagementview-r0d31c82b66c69525-s2217942871' data-api-unique-page-name='src/backend/components/OrdersManagementView'>{PAYMENT_STATUS_LABELS[state.orderDetail.payment_status]}</span>
                    </div>
                    <div className="flex justify-between text-xs" data-api-unique-id="ordersmanagementview-r8fe3f1f919374bbf-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                      <span className="text-muted-foreground" data-api-unique-id="ordersmanagementview-r9bf8b47334a765a5-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Payment Provider</span>
                      <span className="font-medium" data-api-unique-id="ordersmanagementview-re5ff0cb53733e13f-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{PAYMENT_PROVIDER_LABELS[state.orderDetail.payment_provider] || 'Unassigned'}</span>
                    </div>
                    {state.orderDetail.paid_at && <div className="flex justify-between text-xs" data-api-unique-id="ordersmanagementview-r27e1fdb09e9d0b0a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                        <span className="text-muted-foreground" data-api-unique-id="ordersmanagementview-rb56865021f719241-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Settlement Time</span>
                        <span className="font-medium" data-api-unique-id="ordersmanagementview-re32ecabf0e611cb7-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">{new Date(state.orderDetail.paid_at).toLocaleString()}</span>
                      </div>}
                    {(state.orderDetail.payment_out_trade_no || state.orderDetail.payment_session_id) && <div className="flex justify-between text-xs" data-api-unique-id="ordersmanagementview-ra278f44d1c00c651-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                        <span className="text-muted-foreground" data-api-unique-id="ordersmanagementview-r2eca2605ca2f4499-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">Reference ID</span>
                        <span className="font-mono text-[10px] opacity-70" data-api-unique-id="ordersmanagementview-rf958e7e01f20563a-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView">
                          {state.orderDetail.payment_out_trade_no || state.orderDetail.payment_session_id}
                        </span>
                      </div>}
                  </div>
                </section>
              </div>}
          </div>
        </SheetContent>
      </Sheet>
    </div>;
};
export default function OrdersManagementPage() {
  const {
    state,
    handlers
  } = useOrdersManagement();
  return <OrdersManagementView state={state} handlers={handlers} data-api-unique-id="ordersmanagementview-r847d99c1dcaa2ba2-s2217942871" data-api-unique-page-name="src/backend/components/OrdersManagementView" />;
}