'use client'

import React from 'react';
import { Minus, Plus, UtensilsCrossed, ShoppingBag, ArrowRight } from 'lucide-react';
import EditableImg from "@/@base/EditableImg";
import type { FoodOrderState, FoodOrderHandlers } from '@/frontend/hooks/useFoodOrder';

interface Props {
  state: FoodOrderState;
  handlers: FoodOrderHandlers;
}

export const FoodOrderView = ({ state, handlers }: Props) => {
  const {
    isLoading,
    categories,
    activeCategory,
    filteredDishes,
    cart,
    form,
    isSubmitting,
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
    return (
      <section className="w-full h-screen bg-[#F7F3E8] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <UtensilsCrossed className="w-8 h-8 text-[#A87C4E] animate-pulse" strokeWidth={1} />
          <p className="text-sm font-sans tracking-widest uppercase text-[#A87C4E] font-bold">Preparing Menu...</p>
        </div>
      </section>
    );
  }

  return (
    <article className="min-h-screen bg-[#F7F3E8] text-[#2A1E14] font-sans relative selection:bg-[#B43A2B] selection:text-[#F7F3E8]">
      {/* Texture Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
      />

      {/* Hero Section */}
      <section className="w-full bg-[#F7F3E8]" data-controller-name="Menu Header">
        <div className="container mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 mb-12 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] mb-6 flex items-center gap-4">
                <span className="w-12 h-px bg-[#A87C4E]"></span>
                Tavola Authentico
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight uppercase text-[#2A1E14] leading-none mb-6 truncate">
                Il Menu d'Asporto
              </h1>
              <p className="text-xl md:text-2xl font-serif text-[#735A40] leading-relaxed md:w-2/3 line-clamp-3">
                Bring the authentic wood-fired Tavola experience to your dining room. Crafted with uncompromising quality, packaged for elegance.
              </p>
            </div>
            
            <div className="lg:col-span-12 h-[40vh] md:h-[60vh] border border-[#A87C4E] p-0 m-0 overflow-hidden bg-[#EAE3D1]">
              <EditableImg 
                propKey="hero_kitchen"
                keywords="/images/hero-kitchen.jpg" 
                needLargeImage={true}
                description="A wide, sharp-edged, high-resolution authentic photograph of an upscale Italian wood-fired kitchen and dining area, warm ambient lighting, heavy cotton table linens."
                className="w-full h-full object-cover rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split */}
      <section className="w-full bg-[#F7F3E8]" data-controller-name="Menu Ordering">
        <div className="container mx-auto px-8 py-20 border-t border-[#A87C4E]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
            
            {/* Left Column: Menu Browsing (8 Columns) */}
            <main className="lg:col-span-8 lg:border-r border-[#A87C4E] lg:pr-16 pb-20 lg:pb-0 min-w-0">
              
              {/* Category Filters (Sticky Top) */}
              <nav className="sticky top-0 z-40 bg-[#F7F3E8]/95 backdrop-blur-sm border-b border-[#A87C4E] pt-4 pb-4 mb-16 flex flex-wrap items-center overflow-x-auto hide-scrollbar">
                {categories.map((category, index) => (
                  <React.Fragment key={category}>
                    <button 
                      onClick={() => setActiveCategory(category)}
                      disabled={category === activeCategory}
                      className={`
                        uppercase text-xs font-bold tracking-widest px-6 py-3 transition-colors shrink-0 whitespace-nowrap
                        ${category === activeCategory 
                          ? 'bg-[#B43A2B] text-[#F7F3E8] border border-[#B43A2B]' 
                          : 'text-[#2A1E14] border border-transparent hover:text-[#B43A2B]'}
                      `}
                    >
                      {category}
                    </button>
                    {index < categories.length - 1 && (
                      <span className="w-px h-6 bg-[#A87C4E] mx-2 opacity-50 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Dish List (Strict 2-Column Grid) */}
              <div className="min-w-0">
                {filteredDishes.length === 0 ? (
                  <div className="border border-[#A87C4E] p-12 text-center flex flex-col items-center bg-[#F2EADC]">
                    <UtensilsCrossed className="w-8 h-8 text-[#A87C4E] mb-4" strokeWidth={1} />
                    <p className="font-serif text-xl text-[#735A40] truncate w-full">No dishes currently available in this section.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {filteredDishes.map(dish => (
                      <article key={dish.dish_id} className="flex flex-col group border-b border-[#A87C4E] pb-8 relative">
                        {/* Dish Photo */}
                        <div className="w-full aspect-[4/3] border border-[#A87C4E] overflow-hidden mb-6 bg-[#EAE3D1]">
                          <EditableImg 
                            propKey={`dish_img_${dish.dish_id}`}
                            keywords={dish.image_url} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 rounded-none"
                          />
                        </div>
                        
                        {/* Dish Info */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <h2 className="text-2xl font-serif text-[#2A1E14] mb-3 truncate pr-4">{dish.name}</h2>
                          <p className="text-sm text-[#735A40] leading-relaxed line-clamp-2 mb-6 flex-1 min-h-[2.5rem] pr-4">
                            {dish.description}
                          </p>
                          
                          {/* Price & Controls */}
                          <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#A87C4E]/30">
                            <span className="text-lg text-[#2A1E14] font-medium block truncate pr-4">
                              ${dish.price.toFixed(2)}
                            </span>
                            
                            <div className="flex items-center border border-[#A87C4E] bg-transparent shrink-0">
                              <button 
                                onClick={() => handleUpdateQuantity(dish.dish_id, -1)}
                                disabled={!cart[dish.dish_id]}
                                className="w-10 h-10 flex items-center justify-center text-[#2A1E14] hover:bg-[#A87C4E] hover:text-[#F7F3E8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2A1E14] transition-colors"
                              >
                                <Minus className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <span className="w-12 text-center text-sm font-bold text-[#2A1E14]">
                                {cart[dish.dish_id] || 0}
                              </span>
                              <button 
                                onClick={() => handleUpdateQuantity(dish.dish_id, 1)}
                                className="w-10 h-10 flex items-center justify-center text-[#2A1E14] hover:bg-[#A87C4E] hover:text-[#F7F3E8] transition-colors"
                              >
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </main>

            {/* Right Column: Checkout Panel (4 Columns) */}
            <aside className="lg:col-span-4 lg:pl-16 min-w-0 relative">
              <div className="sticky top-8 space-y-16">
                
                {/* Pickup Details Form */}
                <section className="min-w-0">
                  <h3 className="text-3xl font-serif mb-8 text-[#2A1E14] tracking-tight truncate border-b border-[#2A1E14] pb-4 flex items-center justify-between">
                    Pickup Details
                    <span className="text-xs font-sans tracking-widest text-[#A87C4E] uppercase">01</span>
                  </h3>
                  <form onSubmit={e => e.preventDefault()} className="space-y-8">
                    <div className="flex flex-col space-y-3 relative group">
                      <label htmlFor="pickup_name" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate">Full Name</label>
                      <input 
                        id="pickup_name"
                        type="text" 
                        value={form.pickup_name}
                        onChange={(e) => handleFormChange('pickup_name', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50"
                        placeholder="e.g. Marcello Mastroianni"
                      />
                    </div>
                    <div className="flex flex-col space-y-3 relative group">
                      <label htmlFor="pickup_phone" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate">Phone Number</label>
                      <input 
                        id="pickup_phone"
                        type="tel" 
                        value={form.pickup_phone}
                        onChange={(e) => handleFormChange('pickup_phone', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50"
                        placeholder="+39 06 1234 5678"
                      />
                    </div>
                    <div className="flex flex-col space-y-3 relative group">
                      <label htmlFor="customer_email" className="text-xs font-bold tracking-widest uppercase text-[#A87C4E] truncate">Contact Email</label>
                      <input 
                        id="customer_email"
                        type="email" 
                        value={form.customer_email}
                        onChange={(e) => handleFormChange('customer_email', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border-0 border-b border-[#A87C4E] bg-transparent rounded-none px-0 py-3 text-base text-[#2A1E14] placeholder:text-[#735A40]/50 focus:outline-none focus:border-[#B43A2B] focus:ring-0 transition-colors disabled:opacity-50"
                        placeholder="marcello@dolcevita.it"
                      />
                    </div>
                  </form>
                </section>

                {/* Order Summary */}
                <section className="bg-[#F2EADC] border border-[#A87C4E] p-8 min-w-0">
                  <div className="flex items-center justify-between mb-8 border-b border-[#A87C4E] pb-4">
                    <h3 className="text-2xl font-serif text-[#2A1E14] tracking-tight truncate">Your Order</h3>
                    <ShoppingBag className="w-5 h-5 text-[#A87C4E] shrink-0" strokeWidth={1.5} />
                  </div>
                  
                  {cartSummary.items.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-[#A87C4E]">
                      <p className="text-sm text-[#735A40] italic truncate">Your ledger is empty.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <ul className="space-y-4 mb-8 min-w-0">
                        {cartSummary.items.map(item => (
                          <li key={item.dish_id} className="flex items-baseline justify-between text-sm group min-w-0">
                            <span className="flex-1 truncate pr-4 text-[#2A1E14] font-medium leading-relaxed group-hover:text-[#B43A2B] transition-colors">{item.name}</span>
                            <span className="text-[#A87C4E] w-8 text-center shrink-0 text-xs font-bold font-sans">x{item.quantity}</span>
                            <span className="w-16 text-right text-[#2A1E14] shrink-0 tabular-nums">${item.itemTotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="border-t border-[#A87C4E] pt-6 space-y-3 text-sm font-sans min-w-0">
                        <div className="flex justify-between text-[#735A40]">
                          <span className="truncate pr-4 uppercase text-xs font-bold tracking-widest">Subtotal</span>
                          <span className="shrink-0 tabular-nums">${cartSummary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#735A40]">
                          <span className="truncate pr-4 uppercase text-xs font-bold tracking-widest">Tax (VAT)</span>
                          <span className="shrink-0 tabular-nums">${cartSummary.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg text-[#2A1E14] font-medium pt-6 mt-4 border-t border-[#2A1E14]">
                          <span className="truncate pr-4 uppercase tracking-widest font-bold text-sm">Grand Total</span>
                          <span className="shrink-0 tabular-nums font-serif text-2xl">${cartSummary.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Action & Feedback */}
                <section className="min-w-0">
                  {checkoutError && (
                    <div className="bg-[#EAE3D1] border border-[#99281D] p-4 mb-6">
                      <p className="text-[#99281D] text-sm font-bold line-clamp-2 uppercase tracking-wide">{checkoutError}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleCheckout} 
                    disabled={isSubmitting || cartSummary.items.length === 0}
                    className="w-full group bg-[#B43A2B] text-[#F7F3E8] border border-transparent hover:bg-transparent hover:text-[#B43A2B] hover:border-[#B43A2B] active:scale-[0.99] px-8 py-5 flex items-center justify-between rounded-none text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <span className="truncate pr-4">
                      {isSubmitting ? 'Processing Payment...' : 'Proceed to Payment'}
                    </span>
                    {!isSubmitting && <ArrowRight className="w-5 h-5 shrink-0 transform group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />}
                  </button>
                </section>

              </div>
            </aside>

          </div>
        </div>
      </section>
    </article>
  );
};
