'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FoodOrder, OrderPaymentResult } from '@/frontend/route-params';
import { getMenu, createFoodOrder } from '@/frontend/actions/FoodOrder';
import type { DishItem, CartItemPayload, OrderStatus } from '@/frontend/actions/FoodOrder';
import { toast } from 'sonner';

// ===== Enums & Constants =====
const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

// ===== Types =====
interface CheckoutForm {
  pickup_name: string;
  pickup_phone: string;
  customer_email: string;
}

export interface FoodOrderState {
  /** 是否正在加载菜单数据 */
  isLoading: boolean;
  /** 所有菜品列表 */
  dishes: DishItem[];
  /** 菜品分类列表 */
  categories: string[];
  /** 当前选中的分类 */
  activeCategory: string;
  /** 购物车数据，Key 为菜品 ID，Value 为数量 */
  cart: Record<string, number>;
  /** 结账表单数据 */
  form: CheckoutForm;
  /** 结账过程中的错误信息 */
  checkoutError: string | null;
  /** 是否正在提交订单 */
  isSubmitting: boolean;
  /** 当前分类下过滤后的菜品 */
  filteredDishes: DishItem[];
  /** 购物车汇总数据（包含明细、小计、税费、总计） */
  cartSummary: {
    items: {
      dish_id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      itemTotal: number;
    }[];
    subtotal: number;
    tax: number;
    grandTotal: number;
  };
}

export interface FoodOrderHandlers {
  /** 切换当前显示的菜品分类 */
  setActiveCategory: (category: string) => void;
  /** 更新购物车中菜品的数量 */
  handleUpdateQuantity: (dishId: string, delta: number) => void;
  /** 处理结账表单字段变更 */
  handleFormChange: <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => void;
  /** 提交订单并跳转支付 */
  handleCheckout: () => Promise<void>;
}

export const useFoodOrder = (): { state: FoodOrderState; handlers: FoodOrderHandlers } => {
  const router = useRouter();

  // ===== State =====
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  
  const [cart, setCart] = useState<Record<string, number>>({});
  const [form, setForm] = useState<CheckoutForm>({
    pickup_name: '',
    pickup_phone: '',
    customer_email: '',
  });
  
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ===== Effects =====
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await getMenu();
        setDishes(data.dishes || []);
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setActiveCategory(data.categories[0]);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // ===== Derived State =====
  const filteredDishes = useMemo(() => {
    if (!activeCategory) return dishes;
    return dishes.filter(dish => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    const items = Object.entries(cart).map(([dish_id, quantity]) => {
      const dish = dishes.find(d => d.dish_id === dish_id);
      const unitPrice = dish?.price || 0;
      const itemTotal = unitPrice * quantity;
      subtotal += itemTotal;
      return {
        dish_id,
        name: dish?.name || 'Unknown Dish',
        quantity,
        unitPrice,
        itemTotal,
      };
    });

    const tax = Number((subtotal * 0.08).toFixed(2));
    const grandTotal = subtotal + tax;

    return { items, subtotal, tax, grandTotal };
  }, [cart, dishes]);

  // ===== Handlers =====
  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      const current = prev[dishId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      
      if (next === 0) {
        delete newCart[dishId];
      } else {
        newCart[dishId] = next;
      }
      
      return newCart;
    });
  };

  const handleFormChange = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    setCheckoutError(null);

    if (!form.pickup_name || !form.pickup_phone || !form.customer_email) {
      setCheckoutError('Please provide all pickup details (name, phone, email).');
      return;
    }

    if (cartSummary.items.length === 0) {
      setCheckoutError('Your cart is empty. Please add items to your order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payloadItems: CartItemPayload[] = cartSummary.items.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const result = await createFoodOrder({
        pickup_name: form.pickup_name,
        pickup_phone: form.pickup_phone,
        customer_email: form.customer_email,
        items: payloadItems,
      });

      OrderPaymentResult.navigateToWithParams(router, {
        orderId: result.order_id,
        sessionId: result.session_id,
        status: result.status,
      });
    } catch (error: any) {
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      isLoading,
      dishes,
      categories,
      activeCategory,
      cart,
      form,
      checkoutError,
      isSubmitting,
      filteredDishes,
      cartSummary,
    },
    handlers: {
      setActiveCategory,
      handleUpdateQuantity,
      handleFormChange,
      handleCheckout,
    }
  };
};
