'use client'

import React from 'react'
import { 
  RefreshCcw, 
  Download, 
  Search, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2,
  Package,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { FoodOrderStatus, PaymentStatus } from '@/backend/actions/OrdersManagement'
import { 
  OrdersManagementState, 
  OrdersManagementHandlers,
  FOOD_ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_PROVIDER_LABELS 
} from '@/backend/hooks/useOrdersManagement'
import { useOrdersManagement } from '@/backend/hooks/useOrdersManagement'

interface Props {
  state: OrdersManagementState
  handlers: OrdersManagementHandlers
}

/**
 * Status Badge Style Mapper
 */
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'bg-muted text-muted-foreground border-transparent'
    case 'PAID': return 'bg-accent text-accent-foreground border-transparent'
    case 'PREPARING': return 'bg-secondary text-secondary-foreground border-transparent'
    case 'READY_FOR_PICKUP': return 'bg-primary text-primary-foreground border-transparent'
    case 'COMPLETED': return 'bg-secondary text-secondary-foreground border-transparent opacity-80'
    case 'CANCELLED': return 'bg-destructive text-destructive-foreground border-transparent'
    default: return 'bg-muted text-muted-foreground border-transparent'
  }
}

export const OrdersManagementView = ({ state, handlers }: Props) => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* 1. Header & Metrics Section */}
      <section className="w-full border-b border-border/50" data-controller-name="Orders Overview & Metrics">
        <div className="container mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="font-display text-5xl font-medium tracking-tight text-foreground mb-2 italic">
                Orders Management
              </h1>
              <p className="font-header text-xl text-muted-foreground italic">
                Oversee culinary operations and transaction history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-md border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all h-10 px-6 font-medium"
                onClick={handlers.handleRefresh} 
                disabled={state.isListLoading}
              >
                <RefreshCcw className={`mr-2 h-4 w-4 ${state.isListLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-10 px-6 font-medium"
                onClick={handlers.handleExport} 
                disabled={state.isExporting || state.isListLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                {state.isExporting ? 'Exporting...' : 'Export Orders'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Pending Preparation", value: state.metrics.pendingPreparation, icon: Clock },
              { label: "Ready for Pickup", value: state.metrics.readyForPickup, icon: Package },
              { label: "Pending Payment", value: state.metrics.pendingPayment, icon: CreditCard },
              { label: "Completed Today", value: state.metrics.completedToday, icon: CheckCircle2 },
            ].map((metric, idx) => (
              <Card key={idx} className="rounded-lg border border-border/40 shadow-xs overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-4xl font-header font-bold text-foreground italic">
                      {state.isListLoading ? '...' : metric.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <metric.icon className="h-6 w-6 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Filters & Data Grid Section */}
      <section className="w-full" data-controller-name="Orders Data Management">
        <div className="container mx-auto px-8 py-8">
          {/* Filter Bar */}
          <div className="bg-card border border-border/40 rounded-lg p-6 mb-8 shadow-xs">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[240px]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Search Order</label>
                <Input 
                  value={state.localSearchInput} 
                  onChange={(e) => handlers.setLocalSearchInput(e.target.value)}
                  placeholder="Order No, Customer, Phone"
                  className="bg-muted/30 border-input h-10 px-4 focus:ring-1 focus:ring-primary rounded-md"
                />
              </div>

              <div className="w-[180px] flex-shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Order Status</label>
                <Select 
                  value={state.statusFilter} 
                  onValueChange={(val) => handlers.setStatusFilter(val as FoodOrderStatus | 'ALL')}
                >
                  <SelectTrigger className="h-10 bg-muted/30 border-input rounded-md">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.entries(FOOD_ORDER_STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="rounded-md">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px] flex-shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Payment</label>
                <Select 
                  value={state.paymentFilter} 
                  onValueChange={(val) => handlers.setPaymentFilter(val as PaymentStatus | 'ALL')}
                >
                  <SelectTrigger className="h-10 bg-muted/30 border-input rounded-md">
                    <SelectValue placeholder="All Payments" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="ALL">All Payments</SelectItem>
                    {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="rounded-md">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[160px] flex-shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Start Date</label>
                <Input 
                  type="date" 
                  value={state.dateStart} 
                  onChange={(e) => handlers.setDateStart(e.target.value)} 
                  className="h-10 bg-muted/30 border-input px-4 rounded-md"
                />
              </div>

              <div className="w-[160px] flex-shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">End Date</label>
                <Input 
                  type="date" 
                  value={state.dateEnd} 
                  onChange={(e) => handlers.setDateEnd(e.target.value)} 
                  className="h-10 bg-muted/30 border-input px-4 rounded-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handlers.handleApplyFilters}
                  disabled={state.isListLoading}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-6 rounded-md font-medium"
                >
                  Apply
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handlers.handleClearFilters}
                  disabled={state.isListLoading}
                  className="text-muted-foreground hover:text-foreground h-10 rounded-md"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border/40 rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Order #</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Placed At</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Customer Information</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Payment</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.isListLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="h-16 bg-muted/10" />
                    </TableRow>
                  ))
                ) : state.orderList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="font-header text-2xl italic">No matching orders discovered</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  state.orderList.map((order) => (
                    <TableRow key={order.foodOrder_id} className="hover:bg-muted/10 transition-colors border-border/20 group">
                      <TableCell className="px-6 py-4 font-mono text-sm font-medium">{order.foodOrder_number}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.foodOrder_created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{order.pickup_contact_name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{order.pickup_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-header text-lg italic text-primary">
                        ${order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="rounded-full px-3 font-normal capitalize">
                          {PAYMENT_STATUS_LABELS[order.payment_status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={`rounded-full px-4 py-0.5 text-[10px] font-bold uppercase tracking-tighter shadow-none ${getStatusStyles(order.foodOrder_status)}`}>
                          {FOOD_ORDER_STATUS_LABELS[order.foodOrder_status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full hover:bg-secondary hover:text-secondary-foreground"
                          onClick={() => handlers.handleViewDetail(order.foodOrder_id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-border/40 flex items-center justify-between bg-muted/20">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{(state.page - 1) * state.pageSize + 1}</span> - <span className="font-medium text-foreground">{Math.min(state.page * state.pageSize, state.totalCount)}</span> of <span className="font-medium text-foreground">{state.totalCount}</span> records
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rows:</span>
                  <Select 
                    value={state.pageSize.toString()} 
                    onValueChange={handlers.handlePageSizeChange}
                    disabled={state.isListLoading}
                  >
                    <SelectTrigger className="h-8 w-20 bg-background text-xs rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="10" className="rounded-md">10</SelectItem>
                      <SelectItem value="20" className="rounded-md">20</SelectItem>
                      <SelectItem value="50" className="rounded-md">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={state.page <= 1 || state.isListLoading} 
                    onClick={() => handlers.handlePageChange(state.page - 1)}
                    className="h-8 w-8 p-0 rounded-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-xs font-medium px-2">
                    {state.page} / {state.totalPages}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={state.page >= state.totalPages || state.isListLoading} 
                    onClick={() => handlers.handlePageChange(state.page + 1)}
                    className="h-8 w-8 p-0 rounded-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detail Drawer Section */}
      <Sheet open={state.isDetailOpen} onOpenChange={handlers.handleCloseDetail}>
        <SheetContent className="sm:max-w-xl p-0 bg-background rounded-l-none border-l-border flex flex-col h-full overflow-hidden">
          <div className="p-8 border-b border-border/40 flex items-center justify-between bg-muted/10">
            <SheetHeader className="text-left space-y-1">
              <SheetTitle className="font-display text-3xl font-medium italic">Order Information</SheetTitle>
              <SheetDescription className="font-header text-base text-muted-foreground italic">
                {state.orderDetail ? `Order Reference: #${state.orderDetail.foodOrder_number}` : 'Retrieving transaction details...'}
              </SheetDescription>
            </SheetHeader>
            {state.orderDetail && (
              <Button variant="outline" size="sm" onClick={handlers.handlePrintTicket} className="rounded-md border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-8">
            {state.isDetailLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                <RefreshCcw className="h-8 w-8 animate-spin text-secondary" />
                <p className="font-header text-lg italic">Accessing digital registry...</p>
              </div>
            ) : !state.orderDetail ? (
              <div className="p-6 bg-destructive/5 text-destructive rounded-lg border border-destructive/20 flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Record could not be retrieved at this time.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Status & Actions Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Workflow Control</h3>
                    <Badge className={`rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-tight ${getStatusStyles(state.orderDetail.foodOrder_status)}`}>
                      {FOOD_ORDER_STATUS_LABELS[state.orderDetail.foodOrder_status]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3" data-state={state.isUpdatingStatus ? 'loading' : 'idle'}>
                    <fieldset disabled={state.isUpdatingStatus} className="contents">
                      {state.orderDetail.foodOrder_status === 'PAID' && (
                        <Button className="w-full bg-primary text-primary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('PREPARING')}>
                          Commence Culinary Preparation
                        </Button>
                      )}
                      {state.orderDetail.foodOrder_status === 'PREPARING' && (
                        <Button className="w-full bg-secondary text-secondary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('READY_FOR_PICKUP')}>
                          Transition to Pickup Ready
                        </Button>
                      )}
                      {state.orderDetail.foodOrder_status === 'READY_FOR_PICKUP' && (
                        <Button className="w-full bg-primary text-primary-foreground h-12 rounded-md font-semibold text-sm" onClick={() => handlers.handleUpdateStatus('COMPLETED')}>
                          Finalize Fulfillment
                        </Button>
                      )}
                      {(state.orderDetail.foodOrder_status === 'PENDING_PAYMENT' || state.orderDetail.foodOrder_status === 'PAID') && (
                        <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-12 rounded-md font-semibold text-sm transition-all mt-2" onClick={() => handlers.handleUpdateStatus('CANCELLED')}>
                          Void Order Transaction
                        </Button>
                      )}
                    </fieldset>
                  </div>
                </section>

                <Separator className="bg-border/30" />

                {/* Contact Section */}
                <section className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Patron Details</h3>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Name</p>
                      <p className="text-sm font-semibold">{state.orderDetail.pickup_contact_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <p className="text-sm font-mono font-medium">{state.orderDetail.pickup_phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Fulfillment</h3>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Method</p>
                      <p className="text-sm font-semibold capitalize">{state.orderDetail.fulfillment_method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <p className="text-sm font-medium truncate">{state.orderDetail.customer_email}</p>
                    </div>
                  </div>
                </section>

                <Separator className="bg-border/30" />

                {/* Items Section */}
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Culinary Selection</h3>
                  <div className="space-y-6">
                    {state.orderDetail.foodOrder_items?.map((item) => (
                      <div key={item.item_id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold leading-tight mb-1">{item.item_name}</p>
                          {item.item_notes && (
                            <p className="text-xs text-muted-foreground italic leading-relaxed">Note: {item.item_notes}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{item.quantity} × ${item.unit_price.toFixed(2)}</p>
                          <p className="text-sm font-bold font-header italic text-secondary">${item.line_total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {(!state.orderDetail.foodOrder_items || state.orderDetail.foodOrder_items.length === 0) && (
                      <p className="text-sm italic text-muted-foreground text-center py-4">No menu items detected.</p>
                    )}
                  </div>
                </section>

                <Separator className="bg-border/30" />

                {/* Payment Section */}
                <section className="bg-muted/30 p-6 rounded-md">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Financial Reconciliation</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium font-mono">${state.orderDetail.subtotal_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border/20">
                      <span className="text-sm font-bold uppercase tracking-wider">Total Amount</span>
                      <span className="text-2xl font-header font-bold italic text-primary">${state.orderDetail.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/20">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Payment Provider</span>
                      <span className="font-medium">{PAYMENT_PROVIDER_LABELS[state.orderDetail.payment_provider] || 'Unassigned'}</span>
                    </div>
                    {state.orderDetail.paid_at && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Settlement Time</span>
                        <span className="font-medium">{new Date(state.orderDetail.paid_at).toLocaleString()}</span>
                      </div>
                    )}
                    {(state.orderDetail.payment_out_trade_no || state.orderDetail.payment_session_id) && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Reference ID</span>
                        <span className="font-mono text-[10px] opacity-70">
                          {state.orderDetail.payment_out_trade_no || state.orderDetail.payment_session_id}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function OrdersManagementPage() {
  const { state, handlers } = useOrdersManagement()
  return <OrdersManagementView state={state} handlers={handlers} />
}
