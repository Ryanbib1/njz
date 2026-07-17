'use client';

import React from 'react';
import type { OrderPaymentResultState, OrderPaymentResultHandlers } from '@/frontend/hooks/useOrderPaymentResult';
import { Button } from "@/components/ui/button";
interface Props {
  state: OrderPaymentResultState;
  handlers: OrderPaymentResultHandlers;
}
const PaperGrain = () => <div className="absolute inset-0 pointer-events-none z-50 mix-blend-multiply opacity-[0.03]" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
}} aria-hidden="true" data-api-unique-id="orderpaymentresultview-r2be72e0e450f1522-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />;
export const OrderPaymentResultView = ({
  state,
  handlers
}: Props) => {
  const {
    isLoading,
    orderData,
    errorState,
    formattedDate,
    isSuccess,
    paymentStatusLabel,
    paymentOpening,
    foodOrderStatusLabels
  } = state;
  const {
    handleRetryPayment,
    handleReturnToMenu
  } = handlers;

  // ---------------------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <section className="w-full min-h-screen bg-[var(--color-background)] relative flex items-center justify-center" data-api-unique-id="orderpaymentresultview-r5cb988eb1363c5b2-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
        <PaperGrain data-api-unique-id="orderpaymentresultview-rfbedb3752cf9a105-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
        <div className="container mx-auto px-8 py-20 flex flex-col items-center justify-center space-y-6" data-api-unique-id="orderpaymentresultview-r4d39daaf2331b383-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
          <div className="size-8 bg-[var(--color-secondary)] animate-pulse" data-api-unique-id="orderpaymentresultview-r35678f6fd6be508a-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
          <p className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-secondary)]" data-api-unique-id="orderpaymentresultview-r1abf3403857e83b9-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            Retrieving ledger details...
          </p>
        </div>
      </section>;
  }

  // ---------------------------------------------------------------------------
  // ERROR / MISSING DATA STATE
  // ---------------------------------------------------------------------------
  if (errorState || !orderData) {
    return <section className="w-full min-h-screen bg-[var(--color-background)] relative" data-api-unique-id="orderpaymentresultview-r61bf786d033c9125-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
        <PaperGrain data-api-unique-id="orderpaymentresultview-r1ea33d4642fc8599-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
        <div className="container mx-auto px-8 py-24 flex flex-col items-start min-w-0" data-api-unique-id="orderpaymentresultview-r63fd455df1cd6917-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
          <div className="size-16 bg-[var(--color-primary)] mb-10" data-api-unique-id="orderpaymentresultview-r2f7e9fc5f1ec1641-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-[var(--color-foreground)] mb-6 truncate w-full" data-api-unique-id="orderpaymentresultview-rdc44f3e472ac4890-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            RECORD UNAVAILABLE
          </h1>
          <p className="font-body text-xl text-[var(--color-muted-foreground)] max-w-2xl line-clamp-3" data-api-unique-id="orderpaymentresultview-ra34c4a72f153da72-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            We could not locate the details for this transaction in our ledger. Please contact the maître d' for assistance.
          </p>
          <div className="mt-12 w-full h-px bg-[var(--color-border)]" data-api-unique-id="orderpaymentresultview-r95cd0e3ccf2035bc-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
        </div>
      </section>;
  }

  // ---------------------------------------------------------------------------
  // MAIN RESULT STATE
  // ---------------------------------------------------------------------------
  return <section className="w-full bg-[var(--color-background)] relative min-h-screen" data-controller-name="Order Payment Result" data-api-unique-id="orderpaymentresultview-rf73086d5734039ea-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
      <PaperGrain data-api-unique-id="orderpaymentresultview-r025cf5365a5a3169-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
      
      <div className="container mx-auto px-8 py-24 flex flex-col" data-api-unique-id="orderpaymentresultview-r88a8dbb52e535ba7-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
        
        {/* Section 1: The Result Hero */}
        <div className="flex flex-col items-start w-full min-w-0 mb-20" data-api-unique-id="orderpaymentresultview-r9626e713ccb69f9c-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
          {/* Status Indicator Square */}
          <div className={`size-16 mb-12 ${isSuccess ? 'bg-[var(--color-foreground)]' : 'bg-[var(--color-primary)]'}`} aria-hidden="true" data-api-unique-id="orderpaymentresultview-r6b5625669eda4358-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />
          
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-[var(--color-foreground)] uppercase mb-6 w-full truncate" data-api-unique-id="orderpaymentresultview-r16fb83d7561f5205-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            {isSuccess ? 'GRAZIE.' : 'TRANSACTION DECLINED.'}
          </h1>
          <p className="font-body text-xl md:text-2xl text-[var(--color-foreground)] max-w-3xl line-clamp-2" data-api-unique-id="orderpaymentresultview-r08553c17dae02e45-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            {isSuccess ? 'Your culinary experience is confirmed and currently being prepared.' : 'We were unable to process your payment. Please review your details and attempt the transaction again.'}
          </p>
        </div>

        {/* Global Horizontal Divider */}
        <div className="w-full h-px bg-[var(--color-border)] mb-20" data-api-unique-id="orderpaymentresultview-r42c6a0077cde6fd7-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />

        {/* Section 2 & 3: The Order Dossier & Financial Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 relative w-full items-stretch min-w-0" data-api-unique-id="orderpaymentresultview-r3cacdc6dba8c054c-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
          
          {/* Strict Vertical Rule separating the two columns (Desktop only) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-[58.333333%] w-px bg-[var(--color-border)] -ml-px" aria-hidden="true" data-api-unique-id="orderpaymentresultview-r02ba7030decf6c7e-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />

          {/* Left Column: The Ledger (7 Columns) */}
          <div className="lg:col-span-7 pb-16 lg:pb-0 lg:pr-16 flex flex-col min-w-0" data-api-unique-id="orderpaymentresultview-r05fa0a1c2b732d01-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            <h2 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full" data-api-unique-id="orderpaymentresultview-r8dfe34afe4cff5c1-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
              PURCHASE LEDGER
            </h2>
            
            <div className="flex flex-col w-full border-t border-[var(--color-border)]" data-api-unique-id="orderpaymentresultview-r58083483b505b444-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
              {orderData.order_items.map((item, index) => <div key={item.item_id || index} className="flex flex-row items-start py-8 border-b border-[var(--color-border)] min-w-0" data-api-unique-id="orderpaymentresultview-r382661128f876f2e-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1">
                  <div className="w-16 flex-shrink-0 text-[var(--color-secondary)] font-body text-base font-bold pt-1" data-api-unique-id="orderpaymentresultview-ra9e8ab74564a6a8c-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1">
                    {item.item_quantity.toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6 flex flex-col" data-api-unique-id="orderpaymentresultview-r7dab47b468649e12-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1">
                    <span className="font-header text-2xl text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-re11a57e2f9c0ddf9-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1" data-api-bind-info={`orderData.order_items-${index}-item_name`} data-api-map-var-name='item'>
                      {item.item_name}
                    </span>
                    {item.item_notes && <span className="font-body text-sm text-[var(--color-muted-foreground)] mt-2 line-clamp-2" data-api-unique-id="orderpaymentresultview-r0b2ebfeea3d262fd-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1" data-api-bind-info={`orderData.order_items-${index}-item_notes`} data-api-map-var-name='item'>
                        {item.item_notes}
                      </span>}
                  </div>
                  
                  <div className="flex-shrink-0 font-body text-lg text-[var(--color-foreground)] pt-1 text-right whitespace-nowrap pl-4" data-api-unique-id="orderpaymentresultview-r2756dacf69c22cf5-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" data-api-in-loop="1">
                    {orderData.order_currency} {item.item_line_total.toFixed(2)}
                  </div>
                </div>)}
            </div>
          </div>

          {/* Right Column: The Manifesto (5 Columns) */}
          <div className="lg:col-span-5 pt-16 lg:pt-0 lg:pl-16 flex flex-col min-w-0 h-full justify-between" data-api-unique-id="orderpaymentresultview-r19c621f920c0ddf6-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
            
            <div className="flex flex-col min-w-0 w-full" data-api-unique-id="orderpaymentresultview-r19f9dcd527794164-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
              <h2 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full" data-api-unique-id="orderpaymentresultview-r1c5b70da529e511f-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                ORDER DETAILS
              </h2>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-y-10 gap-x-6 min-w-0 mb-12" data-api-unique-id="orderpaymentresultview-r029b6f3dd6610709-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                <div className="flex flex-col min-w-0" data-api-unique-id="orderpaymentresultview-r3efe429e15e333e1-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id="orderpaymentresultview-r1e0e4d9fa3450def-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    ORDER NO.
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-rbfa66ebbfaf8b32e-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    {orderData.order_number}
                  </span>
                </div>
                
                <div className="flex flex-col min-w-0" data-api-unique-id="orderpaymentresultview-r4f111d11fc1c0dde-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id="orderpaymentresultview-r14bb2a33b733a731-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    DATE
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-r7f37f3bace46d105-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    {formattedDate}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 col-span-2" data-api-unique-id="orderpaymentresultview-r4f0b7faf15cf94fd-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id="orderpaymentresultview-r87a94dcec266ed56-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    PAYMENT REF
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-r20e87a3406397bd4-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    {orderData.order_payment_out_trade_no || 'N/A'}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 col-span-2" data-api-unique-id='orderpaymentresultview-rb49f64688d2b53a1-s845046652' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView'>
                  <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id='orderpaymentresultview-r6d8d16c90982f49c-s845046652' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView'>
                    PAYMENT STATUS
                  </span>
                  <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id='orderpaymentresultview-r970564590f6ded1c-s845046652' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView'>
                    {paymentStatusLabel}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-[var(--color-border)] mb-12" data-api-unique-id="orderpaymentresultview-r005681ab68587cb4-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView" />

              {/* Conditional Manifesto Blocks */}
              {isSuccess ? <div className="flex flex-col min-w-0 mb-16" data-api-unique-id="orderpaymentresultview-r9af1af6ff1aaf68c-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  <h3 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full" data-api-unique-id="orderpaymentresultview-r64e4e45b12c40c65-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    PICKUP DIRECTIVE
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-y-10 gap-x-6 min-w-0 mb-10" data-api-unique-id="orderpaymentresultview-ra47acf5b72070c02-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    <div className="flex flex-col min-w-0" data-api-unique-id="orderpaymentresultview-r6bc11ddca6ed57e4-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id="orderpaymentresultview-rbdb383376add6bd0-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        CONTACT
                      </span>
                      <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-r64adb1bac745ae76-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        {orderData.order_pickup_contact_name}
                      </span>
                    </div>
                    
                    <div className="flex flex-col min-w-0" data-api-unique-id="orderpaymentresultview-rdcb26906a945576c-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-2 truncate w-full" data-api-unique-id="orderpaymentresultview-rd4fc46be8d81c7ad-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        TELEPHONE
                      </span>
                      <span className="font-body text-base text-[var(--color-foreground)] truncate w-full" data-api-unique-id="orderpaymentresultview-rb1eb41f8156646cc-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        {orderData.order_pickup_phone}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 col-span-2 items-start" data-api-unique-id="orderpaymentresultview-r67ea74a827857cf7-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                      <span className="text-[10px] font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-3 truncate w-full" data-api-unique-id="orderpaymentresultview-r2c881dfd6e73c0a6-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        STATUS
                      </span>
                      <div className="bg-[var(--color-foreground)] text-[var(--color-background)] px-4 py-2 text-sm font-body font-bold uppercase tracking-widest truncate max-w-full" data-api-unique-id="orderpaymentresultview-rb1e0e09fdb56c41e-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                        {foodOrderStatusLabels[orderData.order_food_status]}
                      </div>
                    </div>
                  </div>
                  
                  <p className="font-header text-lg text-[var(--color-foreground)] italic line-clamp-3" data-api-unique-id="orderpaymentresultview-r14cea426f7c32198-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    "Please present this order number to the maître d' upon arrival."
                  </p>
                </div> : <div className="flex flex-col min-w-0 mb-16" data-api-unique-id="orderpaymentresultview-r20e42b352c45bb22-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  <h3 className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-border)] mb-10 truncate w-full" data-api-unique-id="orderpaymentresultview-re1feb3b340d6a3b4-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    RESOLUTION
                  </h3>
                  
                  <div className="flex flex-col space-y-4 w-full" data-api-unique-id="orderpaymentresultview-r1c570c9b65dbde23-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                    <Button onClick={handleRetryPayment} disabled={paymentOpening} className="w-full inline-flex items-center justify-center rounded-none font-body text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-2 border-transparent hover:bg-transparent hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] active:scale-[0.98] px-8 py-6 h-auto disabled:opacity-50 disabled:pointer-events-none" data-api-unique-id='orderpaymentresultview-r49879b60914beae0-s845046652' data-api-unique-page-name='src/frontend/components/OrderPaymentResultView'>
                      {paymentOpening ? 'OPENING PAYMENT...' : 'RETRY PAYMENT'}
                    </Button>
                    <Button onClick={handleReturnToMenu} className="w-full inline-flex items-center justify-center rounded-none font-body text-sm font-bold tracking-widest uppercase transition-all duration-400 ease-out bg-transparent text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-background)] active:scale-[0.98] px-8 py-6 h-auto" data-api-unique-id="orderpaymentresultview-r7dd9d66dc1b79a7b-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                      RETURN TO MENU
                    </Button>
                  </div>
                </div>}
            </div>

            {/* Section 3: The Financial Summary (Docked to bottom of right column) */}
            <div className="flex flex-col w-full min-w-0 mt-auto pt-8 border-t-2 border-[var(--color-border)]" data-api-unique-id="orderpaymentresultview-re2eef99eacddf6fc-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
              
              <div className="flex justify-between items-end mb-6 w-full" data-api-unique-id="orderpaymentresultview-r94543b04bc1ea539-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                <span className="text-xs font-body font-bold tracking-widest uppercase text-[var(--color-secondary)] truncate pr-4" data-api-unique-id="orderpaymentresultview-r9e47dbada40402dc-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  SUBTOTAL
                </span>
                <span className="font-body text-lg text-[var(--color-foreground)] whitespace-nowrap" data-api-unique-id="orderpaymentresultview-rb46d675a5527e473-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  {orderData.order_currency} {orderData.order_subtotal_amount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline w-full" data-api-unique-id="orderpaymentresultview-rc128f2ed441280ca-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                <h2 className="font-header text-3xl md:text-4xl text-[var(--color-foreground)] uppercase truncate pr-4" data-api-unique-id="orderpaymentresultview-r68e5b3ab68851097-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  TOTAL SETTLEMENT
                </h2>
                <span className="font-display text-4xl md:text-5xl font-medium tracking-tight text-[var(--color-foreground)] whitespace-nowrap" data-api-unique-id="orderpaymentresultview-rbe0b7db39085ff13-s845046652" data-api-unique-page-name="src/frontend/components/OrderPaymentResultView">
                  {orderData.order_currency} {orderData.order_total_amount.toFixed(2)}
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>;
};