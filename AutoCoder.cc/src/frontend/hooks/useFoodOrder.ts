'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OrderPaymentResult } from '@/frontend/route-params';
import { getMenu, createFoodOrder } from '@/frontend/actions/FoodOrder';
import type { DishItem, CartItemPayload, OrderPaymentStatus } from '@/frontend/actions/FoodOrder';
import { openExternalLinkAsync, onExternalLinkMessage } from '@/lib/utils';
import { toast } from 'sonner';

const ORDER_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  PENDING: 'Pending',
  SUCCESS: 'Paid',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

interface CheckoutForm {
  pickup_name: string;
  pickup_phone: string;
  customer_email: string;
}

export interface FoodOrderState {
  isLoading: boolean;
  dishes: DishItem[];
  categories: string[];
  activeCategory: string;
  cart: Record<string, number>;
  form: CheckoutForm;
  checkoutError: string | null;
  isSubmitting: boolean;
  paymentOpening: boolean;
  paymentStatus: 'idle' | 'pending' | 'paid' | 'canceled' | 'failed';
  filteredDishes: DishItem[];
  cartSummary: {
    items: {
      dish_id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      itemTotal: number;
    }[];
    subtotal: number;
    total: number;
    totalQuantity: number;
  };
}

export interface FoodOrderHandlers {
  setActiveCategory: (category: string) => void;
  handleUpdateQuantity: (dishId: string, delta: number) => void;
  handleFormChange: <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => void;
  handleCheckout: () => void;
}

export const useFoodOrder = (): { state: FoodOrderState; handlers: FoodOrderHandlers } => {
  const router = useRouter();

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
  const [paymentOpening, setPaymentOpening] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'paid' | 'canceled' | 'failed'>('idle');

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

  useEffect(() => {
    return onExternalLinkMessage((data) => {
      if (data.type === 'payment-success') {
        setPaymentOpening(false);
        setPaymentStatus('paid');
        if (typeof data.orderId === 'string' && typeof data.sessionId === 'string' && typeof data.status === 'string') {
          OrderPaymentResult.navigateToWithParams(router, {
            orderId: data.orderId,
            sessionId: data.sessionId,
            status: data.status,
          });
        }
        toast.success('Payment completed successfully.');
      } else if (data.type === 'payment-cancel') {
        setPaymentOpening(false);
        setPaymentStatus('canceled');
        toast.info('Payment was cancelled. You can try again from the order result page.');
      } else if (data.type === 'payment-failed') {
        setPaymentOpening(false);
        setPaymentStatus('failed');
        toast.error('Payment verification failed. Please try again from the order result page.');
      }
    });
  }, [router]);

  const filteredDishes = useMemo(() => {
    if (!activeCategory) return dishes;
    return dishes.filter(dish => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let totalQuantity = 0;
    const items = Object.entries(cart).map(([dish_id, quantity]) => {
      const dish = dishes.find(d => d.dish_id === dish_id);
      const unitPrice = dish?.price || 0;
      const itemTotal = unitPrice * quantity;
      subtotal += itemTotal;
      totalQuantity += quantity;
      return {
        dish_id,
        name: dish?.name || 'Unknown Dish',
        quantity,
        unitPrice,
        itemTotal,
      };
    });

    const total = Number(subtotal.toFixed(2));
    return { items, subtotal: total, total, totalQuantity };
  }, [cart, dishes]);

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

  const handleCheckout = () => {
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
    setPaymentOpening(true);
    setPaymentStatus('pending');

    openExternalLinkAsync(async () => {
      const payloadItems: CartItemPayload[] = cartSummary.items.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
      }));

      const result = await createFoodOrder({
        pickup_name: form.pickup_name,
        pickup_phone: form.pickup_phone,
        customer_email: form.customer_email,
        items: payloadItems,
      });

      toast.success(`Pickup order ${result.order_number} created. ${ORDER_STATUS_LABELS[result.status]} for payment.`);

      OrderPaymentResult.navigateToWithParams(router, {
        orderId: result.order_id,
        sessionId: result.session_id,
        status: result.status,
      });

      return result.payment_url;
    }, {
      onNavigate: () => {
        setIsSubmitting(false);
        setPaymentOpening(false);
      },
      onError: (error) => {
        setIsSubmitting(false);
        setPaymentOpening(false);
        setPaymentStatus('failed');
        setCheckoutError(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      },
    });
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
      paymentOpening,
      paymentStatus,
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
