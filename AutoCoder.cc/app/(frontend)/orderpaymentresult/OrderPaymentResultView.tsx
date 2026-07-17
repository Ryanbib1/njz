'use client'

import React from 'react';
import type { OrderPaymentResultState, OrderPaymentResultHandlers } from '@/frontend/hooks/useOrderPaymentResult';
import { Button } from "@/components/ui/button";

interface Props {
  state: OrderPaymentResultState;
  handlers: OrderPaymentResultHandlers;
}

const PaperGrain = () => (
  <div
    className="absolute inset-0 pointer-events-none z-50 mix-blend-multiply opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
    aria-hidden="true"
  />
);

export const OrderPaymentResultView = ({ state, handlers }: Props) => {
  const {
    isLoading,
    orderData,
    errorState,
    formattedDate,
    isSuccess,
    foodOrderStatusLabels
  } = state;

  const { handleRetryPayment, handleReturnToMenu } = handlers;

  // ---------------------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <section className="w-full min-h-screen bg-[var(--color-background)] relative flex items-center justify-center">
        <PaperGrain />
        <div className="container mx-auto px-8 py-20 flex flex-col items-center justify-center space-y-6">
          <div className="size-8 bg-[var(--color-secondary)] animate-pulse" />
          <p className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-secondary)]">
            Retrieving ledger details...
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // ERROR / MISSING DATA STATE
  // ---------------------------------------------------------------------------
  if (errorState || !orderData) {
    return (
      <section className="w-full min-h-screen bg-[var(--color-background)] relative">
        <PaperGrain />
        <div className="container mx-auto px-8 py-24 flex flex-col items-start min-w-0">
          <div className="size-16 bg-[var(--color-primary)] mb-10" />
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-[var(--color-foreground)] mb-6 truncate w-full">
            RECORD UNAVAILABLE
          </h1>
          <p className="font-body text-xl text-[var(--color-muted-foreground)] max-w-2xl line-clamp-3">
            We could not locate the details for this transaction in our ledger. Please contact the maître d' for assistance.
          </p>
          <div className="mt-12 w-full h-px bg-[var(--color-border)]" />
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RESULT STATE
  // ---------------------------------------------------------------------------
  return (
    <section 
      className="w-full bg-[var(--color-background)] relative min-h-screen" 
      data-controller-name="Order Payment Result"
    >
      <PaperGrain />
      
      <div className="container mx-auto px-8 py-24 flex flex-col">
        
        {/* Section 1: The Result Hero */}
        <div className="flex flex-col items-start w-full min-w-0 mb-20">
          {/* Status Indicator Square */}
          <div 
            className={`size-16 mb-12 ${isSuccess ? 'bg-[var(--color-foreground)]' : 'bg-[var(--color-primary)]'}`} 
            aria-hidden="true" 
          />
          
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-[var(--color-foreground)] uppercase mb-6 w-full truncate">
            {isSuccess ? 'GRAZIE.' : 'TRANSACTION DECLINED.'}
          </h1>
          <p className="font-body text-xl md:text-2xl text-[var(--color-foreground)] max-w-3xl line-clamp-2">
            {isSuccess 
              ? 'Your culinary experience is confirmed and currently being prepared.' 
              : 'We were unable to process your payment. Please review your details and attempt the transaction again.'}
          </p>
        </div>

        {/* Global Horizontal Divider */}
        <div className="w-full h-px bg-[var(--color-border)] mb-20" />

        {/* Section 2 & 3: The Order Dossier & Financial Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 relative w-full items-stretch min-w-0">
          
          {/* Strict Vertical Rule separating the two columns (Desktop only) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-[58.333333%] w-px bg-[var(--color-border)] -ml-px" aria-hidden="true" />

          {/* Left Column: The Ledger (7 Columns) */}
          <div className="lg:col-span-7 pb-16 lg:pb-0 lg:pr-16 flex flex-col min-w-0">
            <h2 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full">
              PURCHASE LEDGER
            </h2>
            
            <div className="flex flex-col w-full border-t border-[var(--color-border)]">
              {orderData.order_items.map((item, index) => (
                <div 
                  key={item.item_id || index} 
                  className="flex flex-row items-start py-8 border-b border-[var(--color-border)] min-w-0"
                >
                  <div className="w-16 flex-shrink-0 text-[var(--color-secondary)] font-body text-base font-bold pt-1">
                    {item.item_quantity.toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6 flex flex-col">
                    <span className="font-header text-2xl text-[var(--color-foreground)] truncate w-full">
                      {item.item_name}
                    </span>
                    {item.item_notes && (
                      <span className="font-body text-sm text-[var(--color-muted-foreground)] mt-2 line-clamp-2">
                        {item.item_notes}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 font-body text-lg text-[var(--color-foreground)] pt-1 text-right whitespace-nowrap pl-4">
                    {orderData.order_currency} {item.item_line_total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The Manifesto (5 Columns) */}
          <div className="lg:col-span-5 pt-16 lg:pt-0 lg:pl-16 flex flex-col min-w-0 h-full justify-between">
            
            <div className="flex flex-col min-w-0 w-full">
              <h2 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full">
                ORDER DETAILS
              </h2>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-y-10 gap-x-6 min-w-0 mb-12">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full">
                    ORDER NO.
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full">
                    {orderData.order_number}
                  </span>
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full">
                    DATE
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full">
                    {formattedDate}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 col-span-2">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full">
                    PAYMENT REF
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full">
                    {orderData.order_payment_out_trade_no || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-[var(--color-border)] mb-12" />

              {/* Conditional Manifesto Blocks */}
              {isSuccess ? (
                <div className="flex flex-col min-w-0 mb-16">
                  <h3 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full">
                    PICKUP DIRECTIVE
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-y-10 gap-x-6 min-w-0 mb-10">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full">
                        CONTACT
                      </span>
                      <span className="font-body text-base text-[var(--color-foreground)] truncate w-full">
                        {orderData.order_pickup_contact_name}
                      </span>
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full">
                        TELEPHONE
                      </span>
                      <span className="font-body text-base text-[var(--color-foreground)] truncate w-full">
                        {orderData.order_pickup_phone}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 col-span-2 items-start">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-3 truncate w-full">
                        STATUS
                      </span>
                      <div className="bg-[var(--color-foreground)] text-[var(--color-background)] px-4 py-2 text-sm font-body font-bold uppercase tracking-widest truncate max-w-full">
                        {foodOrderStatusLabels[orderData.order_food_status]}
                      </div>
                    </div>
                  </div>
                  
                  <p className="font-header text-lg text-[var(--color-foreground)] italic line-clamp-3">
                    "Please present this order number to the maître d' upon arrival."
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-w-0 mb-16">
                  <h3 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full">
                    RESOLUTION
                  </h3>
                  
                  <div className="flex flex-col space-y-4 w-full">
                    <Button 
                      onClick={handleRetryPayment}
                      className="w-full inline-flex items-center justify-center rounded-none font-body text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-2 border-transparent hover:bg-transparent hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] active:scale-[0.98] px-8 py-6 h-auto"
                    >
                      RETRY PAYMENT
                    </Button>
                    <Button 
                      onClick={handleReturnToMenu}
                      className="w-full inline-flex items-center justify-center rounded-none font-body text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out bg-transparent text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-background)] active:scale-[0.98] px-8 py-6 h-auto"
                    >
                      RETURN TO MENU
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: The Financial Summary (Docked to bottom of right column) */}
            <div className="flex flex-col w-full min-w-0 mt-auto pt-8 border-t-2 border-[var(--color-border)]">
              
              <div className="flex justify-between items-end mb-6 w-full">
                <span className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] truncate pr-4">
                  SUBTOTAL
                </span>
                <span className="font-body text-lg text-[var(--color-foreground)] whitespace-nowrap">
                  {orderData.order_currency} {orderData.order_subtotal_amount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline w-full">
                <h2 className="font-header text-3xl md:text-4xl text-[var(--color-foreground)] uppercase truncate pr-4">
                  TOTAL SETTLEMENT
                </h2>
                <span className="font-display text-4xl md:text-5xl font-medium tracking-tight text-[var(--color-foreground)] whitespace-nowrap">
                  {orderData.order_currency} {orderData.order_total_amount.toFixed(2)}
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
