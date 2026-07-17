'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FoodOrder, OrderPaymentResult } from '@/frontend/route-params';
import { getMenu, createFoodOrder } from '@/frontend/actions/FoodOrder';
import type { DishItem, CartItemPayload, OrderStatus } from '@/frontend/actions/FoodOrder';
import { toast } from 'sonner';

// Shadcn UI components (assumed available functionally)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ===== Enums =====
const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled'
};

// ===== Types =====
interface CheckoutForm {
  pickup_name: string;
  pickup_phone: string;
  customer_email: string;
}
export default function FoodOrderPage() {
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
    customer_email: ''
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

  // ===== Derived State (useMemo for referential stability) =====
  const filteredDishes = useMemo(() => {
    if (!activeCategory) return dishes;
    return dishes.filter(dish => dish.category === activeCategory);
  }, [dishes, activeCategory]);
  const cartSummary = useMemo(() => {
    let subtotal = 0;
    const items = Object.entries(cart).map(([dish_id, quantity], index) => {
      const dish = dishes.find(d => d.dish_id === dish_id);
      const unitPrice = dish?.price || 0;
      const itemTotal = unitPrice * quantity;
      subtotal += itemTotal;
      return {
        dish_id,
        name: dish?.name || 'Unknown Dish',
        quantity,
        unitPrice,
        itemTotal
      };
    });
    const tax = Number((subtotal * 0.08).toFixed(2));
    const grandTotal = subtotal + tax;
    return {
      items,
      subtotal,
      tax,
      grandTotal
    };
  }, [cart, dishes]);

  // ===== Handlers =====
  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      const current = prev[dishId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = {
        ...prev
      };
      if (next === 0) {
        delete newCart[dishId];
      } else {
        newCart[dishId] = next;
      }
      return newCart;
    });
  };
  const handleFormChange = <K extends keyof CheckoutForm,>(field: K, value: CheckoutForm[K]) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
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
      const payloadItems: CartItemPayload[] = cartSummary.items.map((item, index) => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));
      const result = await createFoodOrder({
        pickup_name: form.pickup_name,
        pickup_phone: form.pickup_phone,
        customer_email: form.customer_email,
        items: payloadItems
      });
      OrderPaymentResult.navigateToWithParams(router, {
        orderId: result.order_id,
        sessionId: result.session_id,
        status: result.status
      });
    } catch (error: any) {
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Render =====
  if (isLoading) {
    return <section data-api-unique-id='foodorderview-skeleton-with-logic-r0ba19686eea2c2bd-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
        <p data-api-unique-id='foodorderview-skeleton-with-logic-r09784afab5227473-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Loading menu...</p>
      </section>;
  }
  return <article data-api-unique-id='foodorderview-skeleton-with-logic-rf8f8dc1d5cbb5214-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
      {/* Hero Section */}
      <header data-api-unique-id='foodorderview-skeleton-with-logic-rd7d0a421dc9dad0f-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
        <img src="/images/hero-kitchen.jpg" alt="Kitchen or dining table" data-api-unique-id='foodorderview-skeleton-with-logic-r740c4bc794773675-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />
        <h1 data-api-unique-id='foodorderview-skeleton-with-logic-r49f6994ac6bc00f9-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Il Menu d'Asporto</h1>
        <p data-api-unique-id='foodorderview-skeleton-with-logic-rd759cb9787f1eac3-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Bring the authentic wood-fired Tavola experience to your dining room. Crafted with uncompromising quality.</p>
      </header>

      {/* Main Content Split */}
      <div data-api-unique-id='foodorderview-skeleton-with-logic-r0921a7f7c59f12f2-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
        {/* Left Column: Menu Browsing */}
        <main data-api-unique-id='foodorderview-skeleton-with-logic-r2571d963d6b8ea57-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
          {/* Category Filters */}
          <nav data-api-unique-id='foodorderview-skeleton-with-logic-r163ef13213fefb30-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
            {categories.map((category, index) => <button key={category} onClick={() => setActiveCategory(category)} disabled={category === activeCategory} data-api-unique-id='foodorderview-skeleton-with-logic-rd0e7a2d453ff052d-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`categories-${index}-$item`} data-api-map-var-name='category'>
                {category}
              </button>)}
          </nav>

          <hr data-api-unique-id='foodorderview-skeleton-with-logic-ra3b04684be73c745-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />

          {/* Dish List */}
          <section data-api-unique-id='foodorderview-skeleton-with-logic-r46266126eba49112-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
            {filteredDishes.length === 0 ? <p data-api-unique-id='foodorderview-skeleton-with-logic-r9e2951fa713b3f99-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>No dishes available in this category.</p> : <div data-api-unique-id='foodorderview-skeleton-with-logic-rafc20ef11b13b5f8-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                {filteredDishes.map((dish, index) => <article key={dish.dish_id} data-api-unique-id='foodorderview-skeleton-with-logic-rba0c40eb6ef2f39d-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                    <img src={dish.image_url} alt={dish.name} data-api-unique-id='foodorderview-skeleton-with-logic-rfafe45cf06c46be7-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' />
                    <div data-api-unique-id='foodorderview-skeleton-with-logic-re0c306e501e322d8-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                      <h2 data-api-unique-id='foodorderview-skeleton-with-logic-r710bb26059603f2c-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`filteredDishes-${index}-name`} data-api-map-var-name='dish'>{dish.name}</h2>
                      <p data-api-unique-id='foodorderview-skeleton-with-logic-rcbc2cedd22a7be9b-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`filteredDishes-${index}-description`} data-api-map-var-name='dish'>{dish.description}</p>
                      <p data-api-unique-id='foodorderview-skeleton-with-logic-r47886abd6788fb5d-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>${dish.price.toFixed(2)}</p>
                    </div>
                    <div data-api-unique-id='foodorderview-skeleton-with-logic-rd73d8886ba8e99c4-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                      <button onClick={() => handleUpdateQuantity(dish.dish_id, -1)} disabled={!cart[dish.dish_id]} data-api-unique-id='foodorderview-skeleton-with-logic-r5645a0ce4fa594b3-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                        -
                      </button>
                      <span data-api-unique-id='foodorderview-skeleton-with-logic-r9bb443384361ed2e-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>{cart[dish.dish_id] || 0}</span>
                      <button onClick={() => handleUpdateQuantity(dish.dish_id, 1)} data-api-unique-id='foodorderview-skeleton-with-logic-rd7d6b8336d0dd226-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                        +
                      </button>
                    </div>
                  </article>)}
              </div>}
          </section>
        </main>

        <hr data-api-unique-id='foodorderview-skeleton-with-logic-r51639c2d33c1d872-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />

        {/* Right Column: Checkout Panel */}
        <aside data-api-unique-id='foodorderview-skeleton-with-logic-re6848bb6305acd45-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
          {/* Pickup Details Form */}
          <section data-api-unique-id='foodorderview-skeleton-with-logic-r24df1f6522ac556a-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
            <h2 data-api-unique-id='foodorderview-skeleton-with-logic-rd8b679d03a870a4f-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Pickup Details</h2>
            <form onSubmit={e => e.preventDefault()} data-api-unique-id='foodorderview-skeleton-with-logic-rf99b75634ee0f1d9-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
              <div data-api-unique-id='foodorderview-skeleton-with-logic-rd154441042f151d9-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <label htmlFor="pickup_name" data-api-unique-id='foodorderview-skeleton-with-logic-rbc95b5735acb6eda-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Name</label>
                <Input id="pickup_name" type="text" value={form.pickup_name} onChange={e => handleFormChange('pickup_name', e.target.value)} disabled={isSubmitting} data-api-unique-id='foodorderview-skeleton-with-logic-r37822371e8623349-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='foodorderview-skeleton-with-logic-rd5aaf80da933109c-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <label htmlFor="pickup_phone" data-api-unique-id='foodorderview-skeleton-with-logic-r0f9204a0259d8043-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Phone Number</label>
                <Input id="pickup_phone" type="tel" value={form.pickup_phone} onChange={e => handleFormChange('pickup_phone', e.target.value)} disabled={isSubmitting} data-api-unique-id='foodorderview-skeleton-with-logic-r4596f9129b320cd8-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />
              </div>
              <div data-api-unique-id='foodorderview-skeleton-with-logic-rc46593a2368d4631-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <label htmlFor="customer_email" data-api-unique-id='foodorderview-skeleton-with-logic-ra5b2fd21805facf9-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Customer Email</label>
                <Input id="customer_email" type="email" value={form.customer_email} onChange={e => handleFormChange('customer_email', e.target.value)} disabled={isSubmitting} data-api-unique-id='foodorderview-skeleton-with-logic-rb464bba691eca824-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />
              </div>
            </form>
          </section>

          <hr data-api-unique-id='foodorderview-skeleton-with-logic-rb7441a9241afa30a-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />

          {/* Order Summary */}
          <section data-api-unique-id='foodorderview-skeleton-with-logic-r76f0fcbf29f8a6d2-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
            <h2 data-api-unique-id='foodorderview-skeleton-with-logic-r31b4d9b487638bba-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Your Order</h2>
            {cartSummary.items.length === 0 ? <p data-api-unique-id='foodorderview-skeleton-with-logic-r21d5cb82430a0f00-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Your cart is empty.</p> : <ul data-api-unique-id='foodorderview-skeleton-with-logic-r8381469b3e27192f-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                {cartSummary.items.map((item, index) => <li key={item.dish_id} data-api-unique-id='foodorderview-skeleton-with-logic-r04279437d66f3684-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>
                    <span data-api-unique-id='foodorderview-skeleton-with-logic-r1eea3cf198fb8251-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`cartSummary.items-${index}-name`} data-api-map-var-name='item'>{item.name}</span>
                    <span data-api-unique-id='foodorderview-skeleton-with-logic-r82c8174d9daaab61-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1' data-api-bind-info={`cartSummary.items-${index}-quantity`} data-api-map-var-name='item'>x{item.quantity}</span>
                    <span data-api-unique-id='foodorderview-skeleton-with-logic-r1a251a9e145ca638-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' data-api-in-loop='1'>${item.itemTotal.toFixed(2)}</span>
                  </li>)}
              </ul>}

            <hr data-api-unique-id='foodorderview-skeleton-with-logic-rafd14c403556ec17-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic' />
            
            <div data-api-unique-id='foodorderview-skeleton-with-logic-r270f40f1d0af535a-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
              <p data-api-unique-id='foodorderview-skeleton-with-logic-r15333013da193a50-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <span data-api-unique-id='foodorderview-skeleton-with-logic-r0b59caac48b2bf50-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Subtotal</span>
                <span data-api-unique-id='foodorderview-skeleton-with-logic-re2f1cd7b32497027-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>${cartSummary.subtotal.toFixed(2)}</span>
              </p>
              <p data-api-unique-id='foodorderview-skeleton-with-logic-r7d8f8029184e2469-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <span data-api-unique-id='foodorderview-skeleton-with-logic-r4fcd3e9577a727e1-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Tax</span>
                <span data-api-unique-id='foodorderview-skeleton-with-logic-rb357f5e4f84ffb35-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>${cartSummary.tax.toFixed(2)}</span>
              </p>
              <p data-api-unique-id='foodorderview-skeleton-with-logic-ra3847d37f39f50b0-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <strong data-api-unique-id='foodorderview-skeleton-with-logic-rf43b4ab46488c094-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>Grand Total</strong>
                <strong data-api-unique-id='foodorderview-skeleton-with-logic-recf68aab80c32380-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>${cartSummary.grandTotal.toFixed(2)}</strong>
              </p>
            </div>
          </section>

          {/* Action & Feedback */}
          <section data-api-unique-id='foodorderview-skeleton-with-logic-re405b4f40de6e5ea-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
            {checkoutError && <div data-api-unique-id='foodorderview-skeleton-with-logic-r6960318126d891d8-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
                <p data-api-unique-id='foodorderview-skeleton-with-logic-r483e3a7909dd8c48-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>{checkoutError}</p>
              </div>}
            <Button onClick={handleCheckout} disabled={isSubmitting || cartSummary.items.length === 0} data-api-unique-id='foodorderview-skeleton-with-logic-rdf7ba971ad54778f-s4145528688' data-api-unique-page-name='src/frontend/components/FoodOrderView_skeleton_with_logic'>
              {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </section>
        </aside>
      </div>
    </article>;
}