'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrdersManagement } from '@/backend/route-params';
import { toast } from "sonner";
import type { FoodOrderStatus, PaymentStatus, PaymentProvider, FoodOrderItemData, FoodOrderListItem, FoodOrderDetail, GetFoodOrdersListInput, UpdateFoodOrderStatusInput, ExportFoodOrdersListInput } from '@/backend/actions/OrdersManagement';
import { getFoodOrdersList, getFoodOrderDetail, updateFoodOrderStatus, exportFoodOrdersList } from '@/backend/actions/OrdersManagement';

// shadcn components (assumed available standard exports)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ===== 枚举映射 =====
const FOOD_ORDER_STATUS_LABELS: Record<FoodOrderStatus, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid / Pending Prep',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled'
};
const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  CLINK: 'Clink'
};

// ===== 页面入参 =====
const getParams = (sp: URLSearchParams) => OrdersManagement.getParams(sp);
export default function OrdersManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Ensure we safely consume params if any, though none defined for this page currently
  const params = useMemo(() => getParams(searchParams), [searchParams]);

  // ===== State =====
  // List State
  const [orderList, setOrderList] = useState<FoodOrderListItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    pendingPreparation: 0,
    readyForPickup: 0,
    pendingPayment: 0,
    completedToday: 0
  });

  // Filter & Pagination State
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FoodOrderStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // IME handling for Search Input (Scenario B - pure local state update, fetched on button click)
  const [localSearchInput, setLocalSearchInput] = useState<string>('');

  // Detail Panel State
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<FoodOrderDetail | null>(null);

  // Loading States
  const [isListLoading, setIsListLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Trigger effect dependency
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  // ===== Handlers =====

  const handleApplyFilters = useCallback(() => {
    setSearchKeyword(localSearchInput);
    setPage(1);
    setFetchTrigger(prev => prev + 1);
  }, [localSearchInput]);
  const handleClearFilters = useCallback(() => {
    setLocalSearchInput('');
    setSearchKeyword('');
    setStatusFilter('ALL');
    setPaymentFilter('ALL');
    setDateStart('');
    setDateEnd('');
    setPage(1);
    setFetchTrigger(prev => prev + 1);
  }, []);
  const handleRefresh = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setFetchTrigger(prev => prev + 1);
  }, []);
  const handleViewDetail = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailOpen(true);
  }, []);
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedOrderId(null);
    setOrderDetail(null);
  }, []);
  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const input: ExportFoodOrdersListInput = {
        search_keyword: searchKeyword || undefined,
        foodOrder_statuses: statusFilter === 'ALL' ? undefined : [statusFilter],
        payment_statuses: paymentFilter === 'ALL' ? undefined : [paymentFilter],
        created_at_start: dateStart || undefined,
        created_at_end: dateEnd || undefined
      };
      const data = await exportFoodOrdersList(input);

      // Simple CSV generation for exported data
      if (data.foodOrder_list.length === 0) {
        toast("No data to export.");
        return;
      }
      const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Total Amount', 'Payment Status', 'Order Status'];
      const csvContent = [headers.join(','), ...data.foodOrder_list.map((row, index) => [row.foodOrder_number, new Date(row.foodOrder_created_at).toLocaleString(), `"${row.pickup_contact_name.replace(/"/g, '""')}"`, row.pickup_phone, row.total_amount, PAYMENT_STATUS_LABELS[row.payment_status], FOOD_ORDER_STATUS_LABELS[row.foodOrder_status]].join(','))].join('\n');
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast("Export completed successfully.");
    } catch (error) {
      // Error handled by framework generic interceptor
    } finally {
      setIsExporting(false);
    }
  }, [searchKeyword, statusFilter, paymentFilter, dateStart, dateEnd]);
  const handleUpdateStatus = useCallback(async (targetStatus: FoodOrderStatus) => {
    if (!selectedOrderId) return;
    try {
      setIsUpdatingStatus(true);
      await updateFoodOrderStatus({
        foodOrder_id: selectedOrderId,
        target_order_status: targetStatus
      });
      toast("Order status updated successfully.");
      // Refresh detail and list
      setFetchTrigger(prev => prev + 1);

      // Re-fetch detail
      const updatedDetail = await getFoodOrderDetail({
        foodOrder_id: selectedOrderId
      });
      setOrderDetail(updatedDetail);
    } catch (error) {
      // Handled by framework
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [selectedOrderId]);
  const handlePrintTicket = useCallback(() => {
    // In a real scenario, this might open a new window with a printable view or send to a thermal printer.
    // Given the constraints, we just show a toast to simulate the action.
    toast("Print ticket command issued.");
    window.print();
  }, []);

  // ===== Effects =====

  // Fetch List Data
  useEffect(() => {
    let mounted = true;
    const fetchList = async () => {
      try {
        setIsListLoading(true);
        const input: GetFoodOrdersListInput = {
          search_keyword: searchKeyword || undefined,
          foodOrder_statuses: statusFilter === 'ALL' ? undefined : [statusFilter],
          payment_statuses: paymentFilter === 'ALL' ? undefined : [paymentFilter],
          created_at_start: dateStart ? new Date(`${dateStart}T00:00:00`).toISOString() : undefined,
          created_at_end: dateEnd ? new Date(`${dateEnd}T23:59:59.999`).toISOString() : undefined,
          page,
          page_size: pageSize
        };
        const response = await getFoodOrdersList(input);
        if (mounted) {
          setOrderList(response.foodOrder_list);
          setTotalCount(response.total_count);
          setMetrics({
            pendingPreparation: response.metrics_pending_preparation,
            readyForPickup: response.metrics_ready_for_pickup,
            pendingPayment: response.metrics_pending_payment,
            completedToday: response.metrics_completed_today
          });
        }
      } catch (error) {
        // Handled by framework
      } finally {
        if (mounted) {
          setIsListLoading(false);
        }
      }
    };
    fetchList();
    return () => {
      mounted = false;
    };
  }, [fetchTrigger, page, pageSize, searchKeyword, statusFilter, paymentFilter, dateStart, dateEnd]);

  // Fetch Detail Data
  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (!isDetailOpen || !selectedOrderId) return;
      try {
        setIsDetailLoading(true);
        const response = await getFoodOrderDetail({
          foodOrder_id: selectedOrderId
        });
        if (mounted) {
          setOrderDetail(response);
        }
      } catch (error) {
        if (mounted) {
          setIsDetailOpen(false);
        }
      } finally {
        if (mounted) {
          setIsDetailLoading(false);
        }
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [isDetailOpen, selectedOrderId]);

  // ===== Render =====

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  return <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r225f8b23cf2c165b-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
      {/* Action Area & Metrics */}
      <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9b34197c9991d0ec-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
        <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r79104fdf31c27e26-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <Button onClick={handleExport} disabled={isExporting || isListLoading} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc96750f260eb8d71-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            {isExporting ? 'Exporting...' : 'Export Orders'}
          </Button>
          <Button variant="secondary" onClick={handleRefresh} disabled={isListLoading} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9567f16252c39c5e-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Refresh
          </Button>
        </div>

        <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r756778bac32a8a11-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <Card data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc24cb3251c18a8c8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfd7539aafd5cbc7e-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='ordersmanagementview-skeleton-with-logic-r6e324f021e38524e-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Pending Preparation</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdba55e289b8feedd-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb8d1c84f374f0d96-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{isListLoading ? '-' : metrics.pendingPreparation}</p>
            </CardContent>
          </Card>
          <Card data-api-unique-id='ordersmanagementview-skeleton-with-logic-rae0a21cc3dd15577-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2f2018ab1342b96e-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='ordersmanagementview-skeleton-with-logic-r29d2b9f8f8f01b94-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Ready for Pickup</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9081931a9bd618f8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r76c39885721e6f21-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{isListLoading ? '-' : metrics.readyForPickup}</p>
            </CardContent>
          </Card>
          <Card data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb092e1e554747a75-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-r6402cf546ff7e109-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra4fa3be6b6743402-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Pending Payment</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-r34fd2b67bfe4d311-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb3a712fea327885d-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{isListLoading ? '-' : metrics.pendingPayment}</p>
            </CardContent>
          </Card>
          <Card data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2a5b2dcf8edde104-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <CardHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-r8d5ce5bb14e7c3a8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <CardTitle data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra8bbce17cd82dac0-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Completed Today</CardTitle>
            </CardHeader>
            <CardContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5f9fe23f9ce86d85-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r12556a20cd070601-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{isListLoading ? '-' : metrics.completedToday}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-r80ef710c4fbcfc37-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

      {/* Filters */}
      <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfcfb437b45385ce1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
        <fieldset disabled={isListLoading} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r940c97954db096ed-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <legend data-api-unique-id='ordersmanagementview-skeleton-with-logic-rbf03e3ade536cc29-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Filter Orders</legend>
          
          <label data-api-unique-id='ordersmanagementview-skeleton-with-logic-r10e917aae8988094-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Search:
            <Input value={localSearchInput} onChange={e => setLocalSearchInput(e.target.value)} placeholder="Order No, Name, Phone" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r401fea4fd3ab0c72-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
          </label>

          <label data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0c1ef90ac82dbd25-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Order Status:
            <Select value={statusFilter} onValueChange={val => setStatusFilter(val as FoodOrderStatus | 'ALL')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf8e0193dd4ce075e-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <SelectTrigger data-api-unique-id='ordersmanagementview-skeleton-with-logic-re99ce686219fa04a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <SelectValue placeholder="All Statuses" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r828325cb88083822-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
              </SelectTrigger>
              <SelectContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-r22ae66597c4c2495-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <SelectItem value="ALL" data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdc65378fa9778efc-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>All Statuses</SelectItem>
                {Object.entries(FOOD_ORDER_STATUS_LABELS).map(([key, label], index) => <SelectItem key={key} value={key} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1abccedd116fe642-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>

          <label data-api-unique-id='ordersmanagementview-skeleton-with-logic-rbaf3c2f5178cd377-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Payment Status:
            <Select value={paymentFilter} onValueChange={val => setPaymentFilter(val as PaymentStatus | 'ALL')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r3d89619c0ae9b1ee-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <SelectTrigger data-api-unique-id='ordersmanagementview-skeleton-with-logic-r136aa697f6fc7fd1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <SelectValue placeholder="All Payments" data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfdf8c410babae0c7-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
              </SelectTrigger>
              <SelectContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-r93eb3b1569bf20d6-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <SelectItem value="ALL" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r8a72b966bd9e5878-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>All Payments</SelectItem>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label], index) => <SelectItem key={key} value={key} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5bc2cc25ad5a83b4-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>

          <label data-api-unique-id='ordersmanagementview-skeleton-with-logic-rcc5e018ee1589214-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Date Start:
            <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r74046645d6da701a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
          </label>

          <label data-api-unique-id='ordersmanagementview-skeleton-with-logic-re1c115865c1b4eba-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Date End:
            <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r3805caae4784bab1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
          </label>

          <Button onClick={handleApplyFilters} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r77a6f858526b4065-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Apply Filters</Button>
          <Button variant="ghost" onClick={handleClearFilters} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r7ac15af59879b511-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Clear</Button>
        </fieldset>
      </section>

      <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb8549afc454d7ee9-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

      {/* Data Grid */}
      <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-r46e13568513a0ee0-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
        <Table data-api-unique-id='ordersmanagementview-skeleton-with-logic-rbd72b33ff4928bf7-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <TableHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc0d52e0e8f09f5ac-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <TableRow data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc2af56c72aa0587a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r26007a6294dc8ae7-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Order Number</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf846731d1d3963cb-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Date & Time</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf6e92fc3cd94e5fb-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Customer Info</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r8733ccfef52ee2df-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Total Amount</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfcba278c4a9cbd58-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Payment Status</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r18eef9033bbbc1b2-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Order Status</TableHead>
              <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r3ac5b70254bfd429-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-api-unique-id='ordersmanagementview-skeleton-with-logic-r253a40a4894fe5c0-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            {isListLoading ? <TableRow data-api-unique-id='ordersmanagementview-skeleton-with-logic-ref02dd8dc02162b4-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <TableCell colSpan={7} data-api-unique-id='ordersmanagementview-skeleton-with-logic-re1bf9818bf77f9d1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Loading orders...</TableCell>
              </TableRow> : orderList.length === 0 ? <TableRow data-api-unique-id='ordersmanagementview-skeleton-with-logic-re4dbf4df1c36d584-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <TableCell colSpan={7} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5061198fbc81646f-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>No orders found matching the criteria.</TableCell>
              </TableRow> : orderList.map((order, index) => <TableRow key={order.foodOrder_id} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r4884e1250c47cf3b-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r7aed4de9fd5b3d4c-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderList-${index}-foodOrder_number`} data-api-map-var-name='order'>{order.foodOrder_number}</TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r4de457ba8f59b60f-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{new Date(order.foodOrder_created_at).toLocaleString()}</TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2a8c995a04da88c8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderList-${index}-pickup_contact_name`} data-api-map-var-name='order'>
                    {order.pickup_contact_name} <br data-api-unique-id='ordersmanagementview-skeleton-with-logic-r62725f884fbc8d5a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1' />
                    <small data-api-unique-id='ordersmanagementview-skeleton-with-logic-r67dcc706643511d2-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`orderList-${index}-pickup_phone`} data-api-map-var-name='order'>{order.pickup_phone}</small>
                  </TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-rd0956a74d3f6e270-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{order.total_amount.toFixed(2)}</TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-rd1b141a4b48c1c84-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{PAYMENT_STATUS_LABELS[order.payment_status]}</TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9362aef5bcccddf8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>{FOOD_ORDER_STATUS_LABELS[order.foodOrder_status]}</TableCell>
                  <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r81c19d570627bd60-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(order.foodOrder_id)} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0d11920973524d71-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' data-api-in-loop='1'>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>)}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0df2df88b122693d-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <span data-api-unique-id='ordersmanagementview-skeleton-with-logic-r8b9ce05989a3ac02-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Showing page {page} of {totalPages} ({totalCount} total records)
          </span>
          <Button variant="outline" disabled={page <= 1 || isListLoading} onClick={() => handlePageChange(page - 1)} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1701dbd5eaaae227-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Previous
          </Button>
          <Button variant="outline" disabled={page >= totalPages || isListLoading} onClick={() => handlePageChange(page + 1)} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r3301ac7b1068743b-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            Next
          </Button>
          <Select value={pageSize.toString()} onValueChange={val => {
          setPageSize(Number(val));
          setPage(1);
          setFetchTrigger(prev => prev + 1);
        }} disabled={isListLoading} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc446b73df386495d-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <SelectTrigger data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0b1e1abacde221c9-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <SelectValue placeholder="Rows per page" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r3ae5c82443816492-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
            </SelectTrigger>
            <SelectContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra921c995deb846b6-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              <SelectItem value="10" data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdc54f2e02624c270-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>10 / page</SelectItem>
              <SelectItem value="20" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r91357509a28cfd95-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>20 / page</SelectItem>
              <SelectItem value="50" data-api-unique-id='ordersmanagementview-skeleton-with-logic-r93d90ab820483247-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Order Detail Side Panel */}
      <Sheet open={isDetailOpen} onOpenChange={handleCloseDetail} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfc4aba199f2266f7-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
        <SheetContent data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc629311cf1359947-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
          <SheetHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-rbcc5a3e33a326299-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
            <SheetTitle data-api-unique-id='ordersmanagementview-skeleton-with-logic-r6b5f78bbab310ec1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Order Details</SheetTitle>
            <SheetDescription data-api-unique-id='ordersmanagementview-skeleton-with-logic-rba5dac4949b0d5b5-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              {orderDetail ? `Order #${orderDetail.foodOrder_number}` : 'Loading...'}
            </SheetDescription>
          </SheetHeader>

          {isDetailLoading ? <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1abacecf403fff99-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Loading order details...</div> : !orderDetail ? <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0dfb5359bc1b4b4f-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Order not found or unable to load.</div> : <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2295995b487ffe67-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
              {/* Panel Header Actions */}
              <div data-api-unique-id='ordersmanagementview-skeleton-with-logic-rd2459140a9029cb1-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r66940445b45e3800-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r49086c9794f42bdd-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Created:</strong> {new Date(orderDetail.foodOrder_created_at).toLocaleString()}</p>
                <Button variant="outline" onClick={handlePrintTicket} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf3413370ab33f820-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Print Ticket</Button>
              </div>

              <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-r7afec100aa61ee9d-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

              {/* Operational Control Section */}
              <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-reff2ceba5666e542-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='ordersmanagementview-skeleton-with-logic-r36df0a2487cc8247-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Operational Status</h3>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf3d1616a67322a15-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Current Status: <strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1046293eb261f099-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{FOOD_ORDER_STATUS_LABELS[orderDetail.foodOrder_status]}</strong></p>
                
                <fieldset disabled={isUpdatingStatus} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb20632e8873bd580-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                  {orderDetail.foodOrder_status === 'PAID' && <Button onClick={() => handleUpdateStatus('PREPARING')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-r356009b5118c83ae-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                      Start Preparing
                    </Button>}
                  {orderDetail.foodOrder_status === 'PREPARING' && <Button onClick={() => handleUpdateStatus('READY_FOR_PICKUP')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rb8b21dfdce76ddc5-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                      Mark Ready for Pickup
                    </Button>}
                  {orderDetail.foodOrder_status === 'READY_FOR_PICKUP' && <Button onClick={() => handleUpdateStatus('COMPLETED')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rba07c9360354c774-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                      Complete Order
                    </Button>}
                  {(orderDetail.foodOrder_status === 'PENDING_PAYMENT' || orderDetail.foodOrder_status === 'PAID') && <Button variant="destructive" onClick={() => handleUpdateStatus('CANCELLED')} data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra8ed3b70c0ecd799-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                      Cancel Order
                    </Button>}
                </fieldset>
              </section>

              <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-re32375f7898bc1cb-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

              {/* Pickup Contact Summary Section */}
              <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdeb12ab70f17a7b0-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='ordersmanagementview-skeleton-with-logic-r32f3c855c00dad65-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Contact & Fulfillment</h3>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1023eea5687804bd-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0055d24c57a815da-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Method:</strong> {orderDetail.fulfillment_method}</p>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9b5337f87b627286-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2b84d694481dbf9b-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Name:</strong> {orderDetail.pickup_contact_name}</p>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r53de32291817c50b-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r44caf0fefd637d07-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Phone:</strong> {orderDetail.pickup_phone}</p>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r20281aa4ed694cdc-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-rbc3e306f84d90dc6-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Email:</strong> {orderDetail.customer_email}</p>
              </section>

              <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-re50d65eb2fbc689f-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

              {/* Ordered Items List Section */}
              <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc07695b474512188-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='ordersmanagementview-skeleton-with-logic-r913f0c9f2fe1a069-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Ordered Items</h3>
                <Table data-api-unique-id='ordersmanagementview-skeleton-with-logic-r29d26413732ec7e6-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                  <TableHeader data-api-unique-id='ordersmanagementview-skeleton-with-logic-reea6c91f1d549406-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                    <TableRow data-api-unique-id='ordersmanagementview-skeleton-with-logic-r9b30d6ec1bb4f317-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                      <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r6b02bc7fcc35ae83-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Item Name</TableHead>
                      <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdfb4879420375b2a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Qty</TableHead>
                      <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-r69cb5b4158f87311-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Price</TableHead>
                      <TableHead data-api-unique-id='ordersmanagementview-skeleton-with-logic-rd63d962e8107d0f6-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-api-unique-id='ordersmanagementview-skeleton-with-logic-r6547d07fc1d20525-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                    {orderDetail.foodOrder_items?.map(item => <TableRow key={item.item_id} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf75f7f902754bdce-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                        <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r141caa3b046e8a51-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                          {item.item_name}
                          {item.item_notes && <>
                              <br data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5e4d33f4570dc4d0-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />
                              <small data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra7cc7022fdfbb6fb-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Note: {item.item_notes}</small>
                            </>}
                        </TableCell>
                        <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5be7af2e3f7dba80-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{item.quantity}</TableCell>
                        <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-r1a0b5c29e1d5e357-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{item.unit_price.toFixed(2)}</TableCell>
                        <TableCell data-api-unique-id='ordersmanagementview-skeleton-with-logic-rad1da094eb8f4e73-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>{item.line_total.toFixed(2)}</TableCell>
                      </TableRow>)}
                    {(!orderDetail.foodOrder_items || orderDetail.foodOrder_items.length === 0) && <TableRow data-api-unique-id='ordersmanagementview-skeleton-with-logic-ra3cb8c447f941ebb-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                        <TableCell colSpan={4} data-api-unique-id='ordersmanagementview-skeleton-with-logic-rcbc15a9eb483d38d-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>No items found for this order.</TableCell>
                      </TableRow>}
                  </TableBody>
                </Table>
              </section>

              <hr data-api-unique-id='ordersmanagementview-skeleton-with-logic-rdd9fc67a6606e605-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic' />

              {/* Financial & Payment Summary Section */}
              <section data-api-unique-id='ordersmanagementview-skeleton-with-logic-r26017e80670ec907-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>
                <h3 data-api-unique-id='ordersmanagementview-skeleton-with-logic-r14456464be57e3cd-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Financial Summary</h3>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r7d0511e913b5f045-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-rfc02c8247e9f7510-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Subtotal:</strong> {orderDetail.subtotal_amount.toFixed(2)}</p>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r640c96003f0aaeba-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-rc7280bfe6d3c47d7-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Total Amount:</strong> {orderDetail.total_amount.toFixed(2)}</p>
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-rca6a1b45ae3558ab-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r93cfcd3be5ecb0d8-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Payment Status:</strong> {PAYMENT_STATUS_LABELS[orderDetail.payment_status]}</p>
                {orderDetail.paid_at && <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r27e390f97e328678-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r2f362191ae78b5df-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Paid At:</strong> {new Date(orderDetail.paid_at).toLocaleString()}</p>}
                <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-rd306d8e6aeca8a46-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r4c9b572540f4bded-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Payment Provider:</strong> {PAYMENT_PROVIDER_LABELS[orderDetail.payment_provider]}</p>
                {orderDetail.payment_out_trade_no && <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r5529aab00993681a-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-r61b5e7cc418ebfbc-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Transaction Ref:</strong> {orderDetail.payment_out_trade_no}</p>}
                {orderDetail.payment_session_id && <p data-api-unique-id='ordersmanagementview-skeleton-with-logic-r0eae4c3422707634-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'><strong data-api-unique-id='ordersmanagementview-skeleton-with-logic-rf72677682f4c56e9-s600398019' data-api-unique-page-name='src/backend/components/OrdersManagementView_skeleton_with_logic'>Session ID:</strong> {orderDetail.payment_session_id}</p>}
              </section>

            </div>}
        </SheetContent>
      </Sheet>
    </div>;
}