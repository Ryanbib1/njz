'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrdersManagement } from '@/backend/route-params'
import { toast } from "sonner"
import type {
  FoodOrderStatus,
  PaymentStatus,
  PaymentProvider,
  FoodOrderListItem,
  FoodOrderDetail,
  GetFoodOrdersListInput,
  UpdateFoodOrderStatusInput,
  ExportFoodOrdersListInput
} from '@/backend/actions/OrdersManagement'
import {
  getFoodOrdersList,
  getFoodOrderDetail,
  updateFoodOrderStatus,
  exportFoodOrdersList
} from '@/backend/actions/OrdersManagement'

// ===== 枚举映射 =====
export const FOOD_ORDER_STATUS_LABELS: Record<FoodOrderStatus, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid / Pending Prep',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled'
}

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  CLINK: 'Clink'
}

// Inner Function
function getParams(sp: URLSearchParams) {
  return OrdersManagement.getParams(sp)
}

export interface OrdersManagementState {
  /** 订单列表数据 */
  orderList: FoodOrderListItem[]
  /** 总条数 */
  totalCount: number
  /** 统计指标 */
  metrics: {
    pendingPreparation: number
    readyForPickup: number
    pendingPayment: number
    completedToday: number
  }
  /** 搜索关键词（用于 Input 绑定） */
  localSearchInput: string
  /** 订单状态筛选 */
  statusFilter: FoodOrderStatus | 'ALL'
  /** 支付状态筛选 */
  paymentFilter: PaymentStatus | 'ALL'
  /** 开始日期 */
  dateStart: string
  /** 结束日期 */
  dateEnd: string
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 详情面板是否打开 */
  isDetailOpen: boolean
  /** 当前选中的订单详情 */
  orderDetail: FoodOrderDetail | null
  /** 列表加载状态 */
  isListLoading: boolean
  /** 详情加载状态 */
  isDetailLoading: boolean
  /** 导出中状态 */
  isExporting: boolean
  /** 状态更新中状态 */
  isUpdatingStatus: boolean
  /** 总页数 */
  totalPages: number
}

export interface OrdersManagementHandlers {
  /** 设置搜索输入 */
  setLocalSearchInput: (val: string) => void
  /** 设置状态筛选 */
  setStatusFilter: (val: FoodOrderStatus | 'ALL') => void
  /** 设置支付筛选 */
  setPaymentFilter: (val: PaymentStatus | 'ALL') => void
  /** 设置开始日期 */
  setDateStart: (val: string) => void
  /** 设置结束日期 */
  setDateEnd: (val: string) => void
  /** 执行搜索过滤 */
  handleApplyFilters: () => void
  /** 重置所有过滤条件 */
  handleClearFilters: () => void
  /** 刷新列表 */
  handleRefresh: () => void
  /** 分页切换 */
  handlePageChange: (newPage: number) => void
  /** 设置每页条数 */
  handlePageSizeChange: (size: string) => void
  /** 查看订单详情 */
  handleViewDetail: (orderId: string) => void
  /** 关闭详情面板 */
  handleCloseDetail: (open: boolean) => void
  /** 导出订单数据 */
  handleExport: () => void
  /** 更新订单业务状态 */
  handleUpdateStatus: (targetStatus: FoodOrderStatus) => void
  /** 打印订单小票 */
  handlePrintTicket: () => void
}

export function useOrdersManagement(): {
  state: OrdersManagementState
  handlers: OrdersManagementHandlers
} {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useMemo(() => getParams(searchParams), [searchParams])

  // List State
  const [orderList, setOrderList] = useState<FoodOrderListItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [metrics, setMetrics] = useState({
    pendingPreparation: 0,
    readyForPickup: 0,
    pendingPayment: 0,
    completedToday: 0
  })

  // Filter & Pagination State
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<FoodOrderStatus | 'ALL'>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL')
  const [dateStart, setDateStart] = useState<string>('')
  const [dateEnd, setDateEnd] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [localSearchInput, setLocalSearchInput] = useState<string>('')

  // Detail Panel State
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [orderDetail, setOrderDetail] = useState<FoodOrderDetail | null>(null)

  // Loading States
  const [isListLoading, setIsListLoading] = useState<boolean>(true)
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)

  const [fetchTrigger, setFetchTrigger] = useState<number>(0)

  // Derived
  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const handleApplyFilters = useCallback(() => {
    setSearchKeyword(localSearchInput)
    setPage(1)
    setFetchTrigger(prev => prev + 1)
  }, [localSearchInput])

  const handleClearFilters = useCallback(() => {
    setLocalSearchInput('')
    setSearchKeyword('')
    setStatusFilter('ALL')
    setPaymentFilter('ALL')
    setDateStart('')
    setDateEnd('')
    setPage(1)
    setFetchTrigger(prev => prev + 1)
  }, [])

  const handleRefresh = useCallback(() => {
    setFetchTrigger(prev => prev + 1)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    setFetchTrigger(prev => prev + 1)
  }, [])

  const handlePageSizeChange = useCallback((size: string) => {
    setPageSize(Number(size))
    setPage(1)
    setFetchTrigger(prev => prev + 1)
  }, [])

  const handleViewDetail = useCallback((orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDetailOpen(true)
  }, [])

  const handleCloseDetail = useCallback((open: boolean) => {
    if (!open) {
      setIsDetailOpen(false)
      setSelectedOrderId(null)
      setOrderDetail(null)
    }
  }, [])

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true)
      const input: ExportFoodOrdersListInput = {
        search_keyword: searchKeyword || undefined,
        foodOrder_statuses: statusFilter === 'ALL' ? undefined : [statusFilter],
        payment_statuses: paymentFilter === 'ALL' ? undefined : [paymentFilter],
        created_at_start: dateStart || undefined,
        created_at_end: dateEnd || undefined,
      }
      const data = await exportFoodOrdersList(input)

      if (data.foodOrder_list.length === 0) {
        toast("No data to export.")
        return
      }

      const headers = ['Order Number', 'Date', 'Pickup Contact', 'Customer Email', 'Phone', 'Total Amount', 'Payment Status', 'Order Status']
      const csvContent = [
        headers.join(','),
        ...data.foodOrder_list.map(row => [
          row.foodOrder_number,
          new Date(row.foodOrder_created_at).toLocaleString(),
          `"${row.pickup_contact_name.replace(/"/g, '""')}"`,
          `"${row.customer_email.replace(/"/g, '""')}"`,
          row.pickup_phone,
          row.total_amount,
          PAYMENT_STATUS_LABELS[row.payment_status],
          FOOD_ORDER_STATUS_LABELS[row.foodOrder_status]
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast("Export completed successfully.")
    } catch (error) {
    } finally {
      setIsExporting(false)
    }
  }, [searchKeyword, statusFilter, paymentFilter, dateStart, dateEnd])

  const handleUpdateStatus = useCallback(async (targetStatus: FoodOrderStatus) => {
    if (!selectedOrderId) return
    try {
      setIsUpdatingStatus(true)
      await updateFoodOrderStatus({
        foodOrder_id: selectedOrderId,
        target_order_status: targetStatus
      })
      toast("Order status updated successfully.")
      setFetchTrigger(prev => prev + 1)
      const updatedDetail = await getFoodOrderDetail({ foodOrder_id: selectedOrderId })
      setOrderDetail(updatedDetail)
    } catch (error) {
    } finally {
      setIsUpdatingStatus(false)
    }
  }, [selectedOrderId])

  const handlePrintTicket = useCallback(() => {
    toast("Print ticket command issued.")
    window.print()
  }, [])

  // Fetch List Data
  useEffect(() => {
    let mounted = true
    const fetchList = async () => {
      try {
        setIsListLoading(true)
        const input: GetFoodOrdersListInput = {
          search_keyword: searchKeyword || undefined,
          foodOrder_statuses: statusFilter === 'ALL' ? undefined : [statusFilter],
          payment_statuses: paymentFilter === 'ALL' ? undefined : [paymentFilter],
          created_at_start: dateStart ? new Date(`${dateStart}T00:00:00`).toISOString() : undefined,
          created_at_end: dateEnd ? new Date(`${dateEnd}T23:59:59.999`).toISOString() : undefined,
          page,
          page_size: pageSize
        }
        const response = await getFoodOrdersList(input)
        if (mounted) {
          setOrderList(response.foodOrder_list)
          setTotalCount(response.total_count)
          setMetrics({
            pendingPreparation: response.metrics_pending_preparation,
            readyForPickup: response.metrics_ready_for_pickup,
            pendingPayment: response.metrics_pending_payment,
            completedToday: response.metrics_completed_today
          })
        }
      } catch (error) {
      } finally {
        if (mounted) setIsListLoading(false)
      }
    }
    fetchList()
    return () => { mounted = false }
  }, [fetchTrigger, page, pageSize, searchKeyword, statusFilter, paymentFilter, dateStart, dateEnd])

  // Fetch Detail Data
  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      if (!isDetailOpen || !selectedOrderId) return
      try {
        setIsDetailLoading(true)
        const response = await getFoodOrderDetail({ foodOrder_id: selectedOrderId })
        if (mounted) setOrderDetail(response)
      } catch (error) {
        if (mounted) setIsDetailOpen(false)
      } finally {
        if (mounted) setIsDetailLoading(false)
      }
    }
    fetchDetail()
    return () => { mounted = false }
  }, [isDetailOpen, selectedOrderId])

  return {
    state: {
      orderList,
      totalCount,
      metrics,
      localSearchInput,
      statusFilter,
      paymentFilter,
      dateStart,
      dateEnd,
      page,
      pageSize,
      isDetailOpen,
      orderDetail,
      isListLoading,
      isDetailLoading,
      isExporting,
      isUpdatingStatus,
      totalPages
    },
    handlers: {
      setLocalSearchInput,
      setStatusFilter,
      setPaymentFilter,
      setDateStart,
      setDateEnd,
      handleApplyFilters,
      handleClearFilters,
      handleRefresh,
      handlePageChange,
      handlePageSizeChange,
      handleViewDetail,
      handleCloseDetail,
      handleExport,
      handleUpdateStatus,
      handlePrintTicket
    }
  }
}