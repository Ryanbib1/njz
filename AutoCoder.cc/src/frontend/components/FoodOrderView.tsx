'use client';

import React from 'react';
import { Minus, Plus, UtensilsCrossed, ShoppingBag, ArrowRight } from 'lucide-react';
import EditableImg from "@/@base/EditableImg";
import type { FoodOrderState, FoodOrderHandlers } from '@/frontend/hooks/useFoodOrder';
interface Props {
  state: FoodOrderState;
  handlers: FoodOrderHandlers;
}
export const FoodOrderView = ({
  state,
  handlers
}: Props) => {
  const {
    isLoading,
    categories,
    activeCategory,
    filteredDishes,
    cart,
    form,
    isSubmitting,
    paymentOpening,
    paymentStatus,
    cartSummary,
    checkoutError
  } = state;
  const {
    setActiveCategory,
    handleUpdateQuantity,
    handleFormChange,
    handleCheckout
  } = handlers;
  if (isLoading) {
    return <section className="w-full h-screen bg-[#F7F3E8] flex items-center justify-center" data-api-unique-id="foodorderview-rf3245d6ef8884e3f-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
        <div className="flex flex-col items-center space-y-4" data-api-unique-id="foodorderview-r90699b348d449c4c-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
          <UtensilsCrossed className="w-8 h-8 text-[#A87C4E] animate-pulse" strokeWidth={1} data-api-unique-id="foodorderview-r46c1f0fb0cc6e619-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
          <p className="text-sm font-sans tracking-widest uppercase text-[#A87C4E] font-bold" data-api-unique-id="foodorderview-r20b388ad1cd58462-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Preparing Menu...</p>
        </div>
      </section>;
  }
  return <article className="min-h-screen bg-[#F7F3E8] text-[#2A1E14] font-sans relative selection:bg-[#B43A2B] selection:text-[#F7F3E8]" data-api-unique-id="foodorderview-r0696dd8851e4fe48-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
      {/* Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
    }} data-api-unique-id="foodorderview-r820f7f9fe0f982bc-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />

      {/* Hero Section */}
      <section className="w-full bg-[#F7F3E8]" data-controller-name="Menu Header" data-api-unique-id="foodorderview-r82ef38492c4f5afd-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
        <div className="container mx-auto px-8 py-24" data-api-unique-id="foodorderview-rab60b79b11c549a4-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-api-unique-id="foodorderview-r844ee1084f2b0835-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
            <div className="lg:col-span-12 mb-12 flex flex-col justify-center" data-api-unique-id="foodorderview-r33ff89ea5fa833b2-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
              <span className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] mb-6 flex items-center gap-4" data-api-unique-id="foodorderview-r706c56779bed1b91-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                <span className="w-12 h-px bg-[#A87C4E]" data-api-unique-id="foodorderview-r936e5c85212e4686-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView"></span>
                Tavola Authentico
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight uppercase text-[#2A1E14] leading-none mb-6 truncate" data-api-unique-id="foodorderview-r46697a1045d0a25f-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                Il Menu d'Asporto
              </h1>
              <p className="text-xl md:text-2xl font-serif text-[#735A40] leading-relaxed md:w-2/3 line-clamp-3" data-api-unique-id="foodorderview-r458c36f0fb62ad14-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                Choose your dishes, leave your pickup details, and place a pickup order that is created server-side before payment.
              </p>
            </div>
            
            <div className="lg:col-span-12 h-[40vh] md:h-[60vh] border border-[#A87C4E] p-0 m-0 overflow-hidden bg-[#EAE3D1]" data-api-unique-id="foodorderview-r7a617e59684c5628-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
              <EditableImg propKey="hero_kitchen" keywords="/images/hero-kitchen.jpg" needLargeImage={true} description="A wide, sharp-edged, high-resolution authentic photograph of an upscale Italian wood-fired kitchen and dining area, warm ambient lighting, heavy cotton table linens." className="w-full h-full object-cover rounded-none" data-api-unique-id="foodorderview-rab5fb0684d030434-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split */}
      <section className="w-full bg-[#F7F3E8]" data-controller-name="Menu Ordering" data-api-unique-id="foodorderview-r228d6fd34c4f02c6-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
        <div className="container mx-auto px-8 py-20 border-t border-[#A87C4E]" data-api-unique-id="foodorderview-r499c7e55f7e2de77-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative" data-api-unique-id="foodorderview-rd12fcff1715cb334-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
            
            {/* Left Column: Menu Browsing (8 Columns) */}
            <main className="lg:col-span-8 lg:border-r border-[#A87C4E] lg:pr-16 pb-20 lg:pb-0 min-w-0" data-api-unique-id="foodorderview-rad7056c8f110c77b-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
              
              {/* Category Filters (Sticky Top) */}
              <nav className="sticky top-0 z-40 bg-[#F7F3E8]/95 backdrop-blur-sm border-b border-[#A87C4E] pt-4 pb-4 mb-16 flex flex-wrap items-center overflow-x-auto hide-scrollbar" data-api-unique-id="foodorderview-r2b2cd8762a2196df-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                {categories.map((category, index) => <React.Fragment key={category}>
                    <button onClick={() => setActiveCategory(category)} disabled={category === activeCategory} className={`
                        uppercase text-xs font-bold tracking-widest px-6 py-3 transition-colors shrink-0 whitespace-nowrap
                        ${category === activeCategory ? 'bg-[#B43A2B] text-[#F7F3E8] border border-[#B43A2B]' : 'text-[#2A1E14] border border-transparent hover:text-[#B43A2B]'}
                      `} data-api-unique-id="foodorderview-r9f659bcf0eaf2e8d-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" data-api-bind-info={`categories-${index}-$item`} data-api-map-var-name='category'>
                      {category}
                    </button>
                    {index < categories.length - 1 && <span className="w-px h-6 bg-[#A87C4E] mx-2 opacity-50 shrink-0" data-api-unique-id="foodorderview-r9e6d03e05a87ff00-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" />}
                  </React.Fragment>)}
              </nav>

              {/* Dish List (Strict 2-Column Grid) */}
              <div className="min-w-0" data-api-unique-id="foodorderview-r682c8867f5a28600-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                {filteredDishes.length === 0 ? <div className="border border-[#A87C4E] p-12 text-center flex flex-col items-center bg-[#F2EADC]" data-api-unique-id="foodorderview-r04fab6c538b594ec-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                    <UtensilsCrossed className="w-8 h-8 text-[#A87C4E] mb-4" strokeWidth={1} data-api-unique-id="foodorderview-rf097ed9a0b6a7cf2-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
                    <p className="font-serif text-xl text-[#735A40] truncate w-full" data-api-unique-id="foodorderview-r3efaedf27dd8e199-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">No dishes currently available in this section.</p>
                  </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16" data-api-unique-id="foodorderview-r04614243d3996c5a-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                    {filteredDishes.map((dish, index) => <article key={dish.dish_id} className="flex flex-col group border-b border-[#A87C4E] pb-8 relative" data-api-unique-id="foodorderview-r9006876ef680e5a3-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                        {/* Dish Photo */}
                        <div className="w-full aspect-[4/3] border border-[#A87C4E] overflow-hidden mb-6 bg-[#EAE3D1]" data-api-unique-id="foodorderview-r69f97451f118282b-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                          <EditableImg propKey={`dish_img_${dish.dish_id}`} keywords={dish.image_url} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 rounded-none" data-api-unique-id="foodorderview-r620f88e9b3f02cd9-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" />
                        </div>
                        
                        {/* Dish Info */}
                        <div className="flex-1 flex flex-col min-w-0" data-api-unique-id="foodorderview-r5e5439689446a4d8-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                          <h2 className="text-2xl font-serif text-[#2A1E14] mb-3 truncate pr-4" data-api-unique-id="foodorderview-r5c17d1f380a7cdae-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" data-api-bind-info={`filteredDishes-${index}-name`} data-api-map-var-name='dish'>{dish.name}</h2>
                          <p className="text-sm text-[#735A40] leading-relaxed line-clamp-2 mb-6 flex-1 min-h-[2.5rem] pr-4" data-api-unique-id="foodorderview-r363f2ab6c0a6f409-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" data-api-bind-info={`filteredDishes-${index}-description`} data-api-map-var-name='dish'>
                            {dish.description}
                          </p>
                          
                          {/* Price & Controls */}
                          <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#A87C4E]/30" data-api-unique-id="foodorderview-r1e812d335a19db61-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                            <span className="text-lg text-[#2A1E14] font-medium block truncate pr-4" data-api-unique-id="foodorderview-r95100b5590e31314-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                              ${dish.price.toFixed(2)}
                            </span>
                            
                            <div className="flex items-center border border-[#A87C4E] bg-transparent shrink-0" data-api-unique-id="foodorderview-re57c1c747aaf8cdc-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                              <button onClick={() => handleUpdateQuantity(dish.dish_id, -1)} disabled={!cart[dish.dish_id]} className="w-10 h-10 flex items-center justify-center text-[#2A1E14] hover:bg-[#A87C4E] hover:text-[#F7F3E8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2A1E14] transition-colors" data-api-unique-id="foodorderview-rd705a16b00700da6-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                                <Minus className="w-4 h-4" strokeWidth={1.5} data-api-unique-id="foodorderview-r7253ecbccd3891b0-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" />
                              </button>
                              <span className="w-12 text-center text-sm font-bold text-[#2A1E14]" data-api-unique-id="foodorderview-r6c70291d48fd6af3-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                                {cart[dish.dish_id] || 0}
                              </span>
                              <button onClick={() => handleUpdateQuantity(dish.dish_id, 1)} className="w-10 h-10 flex items-center justify-center text-[#2A1E14] hover:bg-[#A87C4E] hover:text-[#F7F3E8] transition-colors" data-api-unique-id="foodorderview-r98450c1127fd2b66-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                                <Plus className="w-4 h-4" strokeWidth={1.5} data-api-unique-id="foodorderview-rad6748620b9dba28-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>)}
                  </div>}
              </div>
            </main>

            {/* Right Column: Checkout Panel (4 Columns) */}
            <aside className="lg:col-span-4 lg:pl-16 min-w-0 relative" data-api-unique-id="foodorderview-r1f784bffa31f3717-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
              <div className="sticky top-8 space-y-16" data-api-unique-id="foodorderview-r0b20584ae9cabbdd-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                
                {/* Pickup Details Form */}
                <section className="min-w-0" data-api-unique-id="foodorderview-r37e3a84239016a16-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                  <h3 className="text-3xl font-serif mb-8 text-[#2A1E14] tracking-tight truncate border-b border-[#2A1E14] pb-4 flex items-center justify-between" data-api-unique-id="foodorderview-rc417155b2de8b917-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                    Pickup Details
                    <span className="text-xs font-sans tracking-widest text-[#A87C4E] uppercase" data-api-unique-id="foodorderview-r03cc58aeb0ed19cb-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">01</span>
                  </h3>
                  <p className="text-sm text-[#735A40] leading-relaxed mb-6" data-api-unique-id='foodorderview-rc8e275f4b683dedc-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>
                    Pickup only. Your name, phone number, and email will be saved with the order for preparation updates and the later payment session.
                  </p>
                  <form onSubmit={e => e.preventDefault()} className="space-y-8" data-api-unique-id="foodorderview-r320647305ddf79e8-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                    <div className="flex flex-col space-y-3 relative group" data-api-unique-id="foodorderview-r8037147c5c8446ca-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <label htmlFor="pickup_name" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate" data-api-unique-id="foodorderview-re0ca4fca023ede49-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Full Name</label>
                      <input id="pickup_name" type="text" value={form.pickup_name} onChange={e => handleFormChange('pickup_name', e.target.value)} disabled={isSubmitting} className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50" placeholder="e.g. Marcello Mastroianni" data-api-unique-id="foodorderview-rdcb99011d9bb6677-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
                    </div>
                    <div className="flex flex-col space-y-3 relative group" data-api-unique-id="foodorderview-r2e99ec3b27d346de-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <label htmlFor="pickup_phone" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate" data-api-unique-id="foodorderview-r6620a4545d9ea504-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Phone Number</label>
                      <input id="pickup_phone" type="tel" value={form.pickup_phone} onChange={e => handleFormChange('pickup_phone', e.target.value)} disabled={isSubmitting} className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50" placeholder="+39 06 1234 5678" data-api-unique-id="foodorderview-rb9871ab46aff4fba-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
                    </div>
                    <div className="flex flex-col space-y-3 relative group" data-api-unique-id="foodorderview-r1d050f87f76e3fea-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <label htmlFor="customer_email" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate" data-api-unique-id="foodorderview-rec79fb2099932ed7-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Contact Email</label>
                      <input id="customer_email" type="email" value={form.customer_email} onChange={e => handleFormChange('customer_email', e.target.value)} disabled={isSubmitting} className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50" placeholder="marcello@dolcevita.it" data-api-unique-id="foodorderview-r86adeecb8ceaf6d9-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
                    </div>
                  </form>
                </section>

                {/* Order Summary */}
                <section className="bg-[#F2EADC] border border-[#A87C4E] p-8 min-w-0" data-api-unique-id="foodorderview-ref190643447cbbf7-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                  <div className="flex items-center justify-between mb-8 border-b border-[#A87C4E] pb-4" data-api-unique-id="foodorderview-r1b1fcf24a146b0c3-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                    <h3 className="text-2xl font-serif text-[#2A1E14] tracking-tight truncate" data-api-unique-id="foodorderview-r9887a77c36435194-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Your Order</h3>
                    <ShoppingBag className="w-5 h-5 text-[#A87C4E] shrink-0" strokeWidth={1.5} data-api-unique-id="foodorderview-rcec0edd16201d8a7-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" />
                  </div>
                  
                  {cartSummary.items.length === 0 ? <div className="py-12 text-center border border-dashed border-[#A87C4E]" data-api-unique-id="foodorderview-r78c918d24b18a202-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <p className="text-sm text-[#735A40] italic truncate" data-api-unique-id='foodorderview-r911d7370ed102233-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>Your pickup cart is empty.</p>
                    </div> : <div className="flex flex-col" data-api-unique-id="foodorderview-r46b5b3aafccf6c3f-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <ul className="space-y-4 mb-8 min-w-0" data-api-unique-id="foodorderview-r5402885dfc14417a-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                        {cartSummary.items.map((item, index) => <li key={item.dish_id} className="flex items-baseline justify-between text-sm group min-w-0" data-api-unique-id="foodorderview-rd2ed91edb9776b61-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">
                            <span className="flex-1 truncate pr-4 text-[#2A1E14] font-medium leading-relaxed group-hover:text-[#B43A2B] transition-colors" data-api-unique-id="foodorderview-r85ffb251eb9ef86a-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" data-api-bind-info={`cartSummary.items-${index}-name`} data-api-map-var-name='item'>{item.name}</span>
                            <span className="text-[#A87C4E] w-8 text-center shrink-0 text-xs font-bold font-sans" data-api-unique-id="foodorderview-r1ea31e1be7949b25-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1" data-api-bind-info={`cartSummary.items-${index}-quantity`} data-api-map-var-name='item'>x{item.quantity}</span>
                            <span className="w-16 text-right text-[#2A1E14] shrink-0 tabular-nums" data-api-unique-id="foodorderview-rd0c87b65d97a5f86-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView" data-api-in-loop="1">${item.itemTotal.toFixed(2)}</span>
                          </li>)}
                      </ul>
                      
                      <div className="border-t border-[#A87C4E] pt-6 space-y-3 text-sm font-sans min-w-0" data-api-unique-id="foodorderview-r74547718a6a12443-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                        <div className="flex justify-between text-[#735A40]" data-api-unique-id='foodorderview-rdafb3fa1df625b16-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>
                          <span className="truncate pr-4 uppercase text-xs font-bold tracking-widest" data-api-unique-id='foodorderview-r1137d9b6660e796c-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>Items</span>
                          <span className="shrink-0 tabular-nums" data-api-unique-id='foodorderview-r30f5923c53850834-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>{cartSummary.totalQuantity}</span>
                        </div>
                        <div className="flex justify-between text-[#735A40]" data-api-unique-id="foodorderview-rd21fab62439bdae3-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                          <span className="truncate pr-4 uppercase text-xs font-bold tracking-widest" data-api-unique-id="foodorderview-r83dc6be7794b47a4-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">Subtotal</span>
                          <span className="shrink-0 tabular-nums" data-api-unique-id="foodorderview-rac8ca463b0f6ca03-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">${cartSummary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#735A40]" data-api-unique-id="foodorderview-r3b7d64057e3618a1-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                          <span className="truncate pr-4 uppercase text-xs font-bold tracking-widest" data-api-unique-id='foodorderview-rd44e24b9715e2fe9-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>Pickup Total</span>
                          <span className="shrink-0 tabular-nums" data-api-unique-id='foodorderview-r4a94124a7afa9a98-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>${cartSummary.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg text-[#2A1E14] font-medium pt-6 mt-4 border-t border-[#2A1E14]" data-api-unique-id="foodorderview-r53c99a8f6f319d78-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                          <span className="truncate pr-4 uppercase tracking-widest font-bold text-sm" data-api-unique-id='foodorderview-rcf2e4aabe51a49be-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>Server Calculated Total</span>
                          <span className="shrink-0 tabular-nums font-serif text-2xl" data-api-unique-id='foodorderview-r4c874a5a55b5e8e9-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>${cartSummary.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>}
                </section>

                {/* Action & Feedback */}
                <section className="min-w-0" data-api-unique-id="foodorderview-r8a86374165842035-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                  {checkoutError && <div className="bg-[#EAE3D1] border border-[#99281D] p-4 mb-6" data-api-unique-id="foodorderview-r765dbdf658a66db2-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      <p className="text-[#99281D] text-sm font-bold line-clamp-2 uppercase tracking-wide" data-api-unique-id="foodorderview-r1c6d237b371c68ab-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">{checkoutError}</p>
                    </div>}
                  
                  <button onClick={handleCheckout} disabled={isSubmitting || paymentOpening || paymentStatus === 'paid' || cartSummary.items.length === 0} className="w-full group bg-[#B43A2B] text-[#F7F3E8] border border-transparent hover:bg-transparent hover:text-[#B43A2B] hover:border-[#B43A2B] active:scale-[0.99] px-8 py-5 flex items-center justify-between rounded-none text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out disabled:opacity-40 disabled:pointer-events-none" data-api-unique-id='foodorderview-r869c0361c7c622c0-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView'>
                    <span className="truncate pr-4" data-api-unique-id="foodorderview-r29cbfefa32a870cf-s1241809882" data-api-unique-page-name="src/frontend/components/FoodOrderView">
                      {isSubmitting ? 'Creating Pickup Order...' : paymentOpening ? 'Opening Payment...' : paymentStatus === 'paid' ? 'Payment Completed' : 'Create Order & Pay with Clink'}
                    </span>
                    {!isSubmitting && !paymentOpening && paymentStatus !== 'paid' && <ArrowRight className="w-5 h-5 shrink-0 transform group-hover:translate-x-1 transition-transform" strokeWidth={1.5} data-api-unique-id='foodorderview-r26388c294bebd28d-s1241809882' data-api-unique-page-name='src/frontend/components/FoodOrderView' />}
                  </button>
                </section>

              </div>
            </aside>

          </div>
        </div>
      </section>
    </article>;
};