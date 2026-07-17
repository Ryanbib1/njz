"use client";

import React from "react";
import { Star, Image as ImageIcon, MessageSquare, Clock, MapPin, Phone, Globe, Check, FileText, RotateCw, Calendar } from "lucide-react";
import EditableImg from "@/@base/EditableImg";
import type { UseAdminDashboardState, UseAdminDashboardHandlers } from "@/backend/hooks/useAdminDashboard";
interface Props {
  state: UseAdminDashboardState;
  handlers: UseAdminDashboardHandlers;
}
export default function AdminDashboardView({
  state,
  handlers
}: Props) {
  return <div className="min-h-screen flex bg-background text-foreground font-body" data-api-unique-id="admindashboardview-r2dcf632de8426166-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
      <div className="flex-1 flex flex-col min-h-screen" data-api-unique-id="admindashboardview-r2bbdec014fab95e6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
        <main className="p-8 max-w-6xl w-full mx-auto space-y-12 pb-16" data-api-unique-id="admindashboardview-r757ce11b9e989473-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
          <section data-controller-name="KPISummary" className="grid grid-cols-1 md:grid-cols-3 gap-6" data-api-unique-id="admindashboardview-r0b689fd5624b5add-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
            <div className="bg-card border border-secondary/20 p-6 flex flex-col justify-between" data-api-unique-id="admindashboardview-r6a4f30bbacb52962-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div data-api-unique-id="admindashboardview-r658ff5f4a7750c00-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground" data-api-unique-id="admindashboardview-r55f6251f98ee2d09-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Verified Score
                </p>
                <div className="flex items-baseline gap-2 mt-2" data-api-unique-id="admindashboardview-r82f2f57dd2690c29-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <span className="text-4xl font-black font-display text-foreground" data-api-unique-id="admindashboardview-r15a3ecb330e79cee-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    {state.dashboardData?.restaurant?.rating ?? "4.6"}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs" data-api-unique-id="admindashboardview-rab74c5adcafa94ec-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    <Star className="size-4 fill-current" data-api-unique-id="admindashboardview-r3584d03c53764e91-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    <Star className="size-4 fill-current" data-api-unique-id="admindashboardview-r5a1f50c08a08ac42-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    <Star className="size-4 fill-current" data-api-unique-id="admindashboardview-r099ee7bd4e2426df-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    <Star className="size-4 fill-current" data-api-unique-id="admindashboardview-r4e511c9d2f7765d6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    <Star className="size-4 fill-current" data-api-unique-id="admindashboardview-re70d56d6cb852376-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 border-t border-secondary/10 pt-3" data-api-unique-id="admindashboardview-rdb4dcb7a17d427e4-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                Calculated dynamically from {state.dashboardData?.restaurant?.reviewCount ?? 59} guest reviews.
              </p>
            </div>

            <div className="bg-card border border-secondary/20 p-6 flex flex-col justify-between" data-api-unique-id="admindashboardview-r8778023c263c84d0-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div data-api-unique-id="admindashboardview-r116d279c01b4f61a-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground" data-api-unique-id="admindashboardview-r8791c7bbe206699a-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Active Media Assets
                </p>
                <div className="flex items-baseline gap-2 mt-2" data-api-unique-id="admindashboardview-red73a1e5c765b115-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <span className="text-4xl font-black font-display text-foreground" data-api-unique-id="admindashboardview-r5a0abf9558b4b53c-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    {state.dashboardData?.counts.activePhotosCount ?? 10}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold" data-api-unique-id="admindashboardview-r14c39c202ab9f11b-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Photos Live
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 border-t border-secondary/10 pt-3" data-api-unique-id="admindashboardview-r44ed4e39585c05f2-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                Showcasing rustic dining room, pizza, steak & wine.
              </p>
            </div>

            <div className="bg-card border border-secondary/20 p-6 flex flex-col justify-between" data-api-unique-id="admindashboardview-rc5a7a6cce967e8da-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div data-api-unique-id="admindashboardview-r17fbe7216a6228e2-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground" data-api-unique-id="admindashboardview-r6a4782e75edaab94-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  System Synchronization
                </p>
                <div className="flex items-center gap-2 mt-3" data-api-unique-id="admindashboardview-r0f00a5a83fb57640-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" data-api-unique-id="admindashboardview-rf7afe02e1ce807f6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  <span className="text-sm font-bold uppercase tracking-wider text-emerald-700" data-api-unique-id="admindashboardview-r444bb2b281fc0862-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Online & Active
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 border-t border-secondary/10 pt-3" data-api-unique-id="admindashboardview-r5078a59d1978271c-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                Updating www.tavola.cn Beijing domain.
              </p>
            </div>
          </section>

          <div data-controller-name="MainContent" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" data-api-unique-id="admindashboardview-r3299f7e94b13de39-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
            <section data-controller-name="StoreProfileForm" className="lg:col-span-2 bg-card border border-secondary/20 p-8 space-y-6" data-api-unique-id="admindashboardview-rc6555b99af806c58-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div className="flex items-center justify-between border-b border-secondary/10 pb-4" data-api-unique-id="admindashboardview-r19f791e78dd12337-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <div className="flex items-center gap-2" data-api-unique-id="admindashboardview-r4da81914b9d3906f-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <FileText className="size-4 text-primary" data-api-unique-id="admindashboardview-r0f5f35ce102826df-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  <h3 className="font-header font-bold text-lg text-foreground" data-api-unique-id="admindashboardview-r225d249c95a22eea-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Store Profile Text
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary" data-api-unique-id="admindashboardview-rd724a207ee6484e8-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Editable Area
                </span>
              </div>

              <form onSubmit={e => {
              e.preventDefault();
              handlers.handleSaveProfile(e, state.profileFormData);
            }} className="space-y-6" data-api-unique-id="admindashboardview-r8986aa84fd605b50-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <div className="space-y-2" data-api-unique-id="admindashboardview-r72a888232c1892e3-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground" data-api-unique-id="admindashboardview-r73fbbeacd0c61414-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Restaurant Title
                  </label>
                  <input type="text" value={state.profileFormData.name} onChange={e => handlers.handleProfileFormChange('name', e.target.value)} className="w-full bg-muted/30 border border-secondary/30 rounded-none px-4 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring outline-none transition-all font-semibold" required data-api-unique-id="admindashboardview-rfd3a8234839da705-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                </div>

                <div className="space-y-2" data-api-unique-id="admindashboardview-rb8889facaa73635b-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground" data-api-unique-id="admindashboardview-rded603eefdaf8541-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Homepage Editorial Bio
                  </label>
                  <textarea rows={8} value={state.profileFormData.brandStory} onChange={e => handlers.handleProfileFormChange('brandStory', e.target.value)} className="w-full bg-muted/30 border border-secondary/30 rounded-none px-4 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring outline-none transition-all text-sm leading-relaxed" required data-api-unique-id="admindashboardview-r72dec1f0c7e1c9a7-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  <p className="text-[11px] text-muted-foreground" data-api-unique-id="admindashboardview-r22199bc9fc6c4060-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Describe Tavola&apos;s warm brown, creamy white, and tomato red accents, lunch menu options, and overall guest appeal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-api-unique-id="admindashboardview-r4094d60a8914bb95-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <div className="space-y-2" data-api-unique-id="admindashboardview-r2a875a4e2603f830-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground" data-api-unique-id="admindashboardview-re55a53dd47d0fa28-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                      Phone Number
                    </label>
                    <div className="relative" data-api-unique-id="admindashboardview-rd84baec69b047462-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                      <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" data-api-unique-id="admindashboardview-ra07aba0058d26f8e-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                      <input type="text" value={state.profileFormData.phone} onChange={e => handlers.handleProfileFormChange('phone', e.target.value)} className="w-full bg-muted/30 border border-secondary/30 rounded-none pl-10 pr-4 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring outline-none" required data-api-unique-id="admindashboardview-r3c7566f5759c1275-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    </div>
                  </div>

                  <div className="space-y-2" data-api-unique-id="admindashboardview-r7ab0d5703c1eed57-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground" data-api-unique-id="admindashboardview-rdbfa5b00d7130e9b-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                      Official Domain URL
                    </label>
                    <div className="relative" data-api-unique-id="admindashboardview-r94970b5122445cce-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                      <Globe className="absolute left-3 top-3 size-4 text-muted-foreground" data-api-unique-id="admindashboardview-r2ecc4fbfb9f550d6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                      <input type="url" value={state.profileFormData.website} onChange={e => handlers.handleProfileFormChange('website', e.target.value)} className="w-full bg-muted/30 border border-secondary/30 rounded-none pl-10 pr-4 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring outline-none" required data-api-unique-id="admindashboardview-r9fa5a490817df7ff-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2" data-api-unique-id="admindashboardview-r5ef3a1117361ebf1-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground" data-api-unique-id="admindashboardview-r2e1282713851177d-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Physical Location Address
                  </label>
                  <div className="relative" data-api-unique-id="admindashboardview-r7acdd72885bb508e-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" data-api-unique-id="admindashboardview-r07957d6022232962-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                    <input type="text" value={state.profileFormData.address} onChange={e => handlers.handleProfileFormChange('address', e.target.value)} className="w-full bg-muted/30 border border-secondary/30 rounded-none pl-10 pr-4 py-2.5 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring outline-none" required data-api-unique-id="admindashboardview-rcc1899cb20abbc66-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  </div>
                </div>

                <div className="pt-4 border-t border-secondary/10 flex items-center justify-between" data-api-unique-id="admindashboardview-rd7a11dd2c4c3dda6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <p className="text-xs text-muted-foreground" data-api-unique-id="admindashboardview-r3b3fec87e1f99484-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Ensure to verify typos before submitting live data.
                  </p>
                  <div className="flex items-center gap-3" data-api-unique-id="admindashboardview-r241f8fa6fac67223-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    {state.saveSuccess && <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5" data-api-unique-id="admindashboardview-r40921d0270de9764-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                        <Check className="size-4" data-api-unique-id="admindashboardview-rb661d70c22c09496-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" /> Saved Successfully!
                      </span>}
                    <button type="submit" disabled={state.isSaving} className="bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary transition-all px-6 py-2.5 font-bold tracking-widest text-xs uppercase inline-flex items-center gap-2" data-api-unique-id="admindashboardview-r76374c380a90f934-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                      {state.isSaving ? <>
                          <RotateCw className="size-3.5 animate-spin" data-api-unique-id="admindashboardview-r421fc7d1a8b6c706-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                          <span data-api-unique-id="admindashboardview-r90137de965da2ee9-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Updating...</span>
                        </> : <span data-api-unique-id="admindashboardview-r842525db11b7fe35-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Publish Changes</span>}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            <section data-controller-name="BusinessHoursManager" className="bg-card border border-secondary/20 p-8 space-y-6" data-api-unique-id="admindashboardview-r63ead82116d7883f-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div className="flex items-center justify-between border-b border-secondary/10 pb-4" data-api-unique-id="admindashboardview-rf7120500f0b7916a-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <div className="flex items-center gap-2" data-api-unique-id="admindashboardview-r9325fd6dd9a9b5f4-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <Clock className="size-4 text-primary" data-api-unique-id="admindashboardview-r03eed6d684666b3d-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  <h3 className="font-header font-bold text-lg text-foreground" data-api-unique-id="admindashboardview-r747a5f0c7ef3ec77-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                    Business Hours
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary" data-api-unique-id="admindashboardview-reb09b57d80bc719b-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  7 Days
                </span>
              </div>

              <div className="space-y-4" data-api-unique-id="admindashboardview-rc7f1281c0f6aae13-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                {state.isLoading ? <div className="text-sm text-muted-foreground py-4 text-center" data-api-unique-id="admindashboardview-r3484ebd29435f5da-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Loading business hours...</div> : !state.dashboardData?.hours || state.dashboardData.hours.length === 0 ? <div className="text-sm text-muted-foreground py-4 text-center" data-api-unique-id="admindashboardview-r1ecac3c16837a327-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">No business hours scheduled.</div> : state.dashboardData.hours.map((line, index) => <div key={line.id} className="flex items-center justify-between py-2 border-b border-secondary/10 last:border-0 hover:bg-muted/10 transition-colors px-1" data-api-unique-id="admindashboardview-re0e730da29de9d94-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <div className="flex items-center gap-2" data-api-unique-id="admindashboardview-r5c44e5ce2d456e1e-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        <span className="size-1.5 bg-primary" data-api-unique-id="admindashboardview-rbea6e4a8e5bec109-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1" />
                        <span className="text-xs font-bold text-foreground" data-api-unique-id="admindashboardview-ra0c3f7fc3c029012-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                          {line.weekday}
                        </span>
                      </div>
                      <div className="flex items-center gap-3" data-api-unique-id="admindashboardview-re0306ba4093f14c5-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        <span className="text-xs font-mono text-muted-foreground line-clamp-1 max-w-[120px]" data-api-unique-id="admindashboardview-r2922a05f96d811fa-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                          {line.fullLine}
                        </span>
                        <button type="button" onClick={() => handlers.handleNavigateToBusinessInfo()} className="text-[10px] uppercase font-bold tracking-wider text-secondary hover:text-primary" data-api-unique-id="admindashboardview-r2aa22a4621954764-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                          Edit
                        </button>
                      </div>
                    </div>)}
              </div>

              <div className="bg-muted/30 p-4 border border-secondary/20 space-y-2" data-api-unique-id="admindashboardview-r8c83317696c327ab-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground" data-api-unique-id="admindashboardview-r5f8e2d065d7f59ec-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  <Calendar className="size-4 text-secondary" data-api-unique-id="admindashboardview-rfac1cb63bddf4887-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                  <span data-api-unique-id="admindashboardview-r88e13d76825e4b5f-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Holiday Overrides</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed" data-api-unique-id="admindashboardview-r1c5bc2c4a406fb56-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Special event schedules or holiday closure overrides will notify patrons in the homepage reservation section.
                </p>
              </div>
            </section>
          </div>

          <section data-controller-name="StorefrontGalleryManager" className="bg-card border border-secondary/20 p-8 space-y-6" data-api-unique-id="admindashboardview-r8a902c817e094ab5-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-secondary/10 pb-4" data-api-unique-id="admindashboardview-r91be54ade112efa1-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div className="flex items-center gap-2" data-api-unique-id="admindashboardview-rc56b3b0a990a03d5-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <ImageIcon className="size-4 text-primary" data-api-unique-id="admindashboardview-r119ec7491b38913a-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                <h3 className="font-header font-bold text-lg text-foreground" data-api-unique-id="admindashboardview-r5e7373211b4ec319-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Storefront Gallery Manager
                </h3>
              </div>
              <div className="flex items-center gap-4" data-api-unique-id="admindashboardview-ra2d84c36d18d5167-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="admindashboardview-rb61ec415e7e0a28c-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Display Limit: 10 Photos
                </span>
                <button type="button" onClick={() => handlers.handleNavigateToPhotosManagement()} className="bg-secondary text-primary-foreground hover:bg-transparent hover:text-secondary border border-secondary transition-all px-4 py-1.5 font-bold tracking-widest text-[10px] uppercase" data-api-unique-id="admindashboardview-r569bdacd676f8c02-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Add Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-api-unique-id="admindashboardview-r9c4b63a1ae96c026-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              {state.isLoading ? <div className="col-span-full py-8 text-center text-sm text-muted-foreground" data-api-unique-id="admindashboardview-r3a484731f53d1386-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Loading gallery...</div> : !state.dashboardData?.photos || state.dashboardData.photos.length === 0 ? <div className="col-span-full py-8 text-center text-sm text-muted-foreground" data-api-unique-id="admindashboardview-r4405741a4cf59eed-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">No active photos available.</div> : state.dashboardData.photos.map((img, index) => <div key={img.id} className="group relative p-1.5 border border-secondary/20 bg-background hover:border-primary transition-colors overflow-hidden" data-api-unique-id="admindashboardview-r9864dbcfac4b4da1-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                    <div className="relative aspect-square overflow-hidden bg-stone-200" data-api-unique-id="admindashboardview-rd91f07c9bbc71763-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <EditableImg propKey={`gallery-${img.id}`} keywords={img.imageUrl} description={img.description || "Storefront photo asset"} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" style={{
                  aspectRatio: '1/1'
                }} data-api-unique-id="admindashboardview-r9ada9d2f9ad1508d-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5" data-api-unique-id="admindashboardview-reace5645ce22f4d0-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        <p className="text-[9px] text-primary-foreground leading-tight line-clamp-2 mb-2 font-light" data-api-unique-id="admindashboardview-r14ac603749bca117-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                          {img.description ?? img.alt ?? "Gallery Image"}
                        </p>
                        <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-2" data-api-unique-id="admindashboardview-r7bdb779a9c3fbabe-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                          <button type="button" onClick={() => handlers.handleNavigateToPhotoDetail(img.id)} className="text-[9px] font-bold uppercase text-primary-foreground hover:text-primary" data-api-unique-id="admindashboardview-r9a9defa16ef233d1-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                            Details
                          </button>
                          <button type="button" onClick={() => handlers.handleRemovePhoto(img.id)} className="text-[9px] font-bold uppercase text-red-400 hover:text-red-500" data-api-unique-id="admindashboardview-rfc8a8ef5cd85c77e-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground" data-api-unique-id="admindashboardview-r3424a40c1adaf036-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <span className="font-mono" data-api-unique-id="admindashboardview-rf976d0e619adcd5b-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">Asset #{img.sortOrder ?? img.id.slice(-4)}</span>
                      <span className="uppercase tracking-widest font-bold" data-api-unique-id="admindashboardview-r233c6273d9a3a1e9-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">Active</span>
                    </div>
                  </div>)}
            </div>
          </section>

          <section data-controller-name="LiveGuestReviewFeed" className="bg-card border border-secondary/20 p-8 space-y-6" data-api-unique-id="admindashboardview-rb190368cfac03097-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-secondary/10 pb-4" data-api-unique-id="admindashboardview-rbd0e3f18cf0cc443-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              <div className="flex items-center gap-2" data-api-unique-id="admindashboardview-r7c63c4e9aa85f7ef-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                <MessageSquare className="size-4 text-primary" data-api-unique-id="admindashboardview-r5f66f9c4f191b5ad-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" />
                <h3 className="font-header font-bold text-lg text-foreground" data-api-unique-id="admindashboardview-radc0899210d692e6-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                  Live Guest Review Feed
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" data-api-unique-id="admindashboardview-r8767f545dcd5617e-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
                Showing Latest Testimonials
              </span>
            </div>

            <div className="space-y-6 divide-y divide-secondary/10" data-api-unique-id="admindashboardview-r45a94d13fd4016be-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">
              {state.isLoading ? <div className="py-6 text-sm text-muted-foreground text-center" data-api-unique-id="admindashboardview-rb8694cfff89ad4e9-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">Loading reviews...</div> : !state.dashboardData?.reviews || state.dashboardData.reviews.length === 0 ? <div className="py-6 text-sm text-muted-foreground text-center" data-api-unique-id="admindashboardview-r89c4ec1e9bbf5c97-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView">No reviews available yet.</div> : state.dashboardData.reviews.map((rev, index) => <div key={rev.id} className="pt-6 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-4" data-api-unique-id="admindashboardview-re47c40cef9406664-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                    <div className="w-full md:w-1/4 shrink-0" data-api-unique-id="admindashboardview-ra704212889c9033c-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <span className="text-xs uppercase tracking-[0.15em] font-bold text-secondary block line-clamp-1" data-api-unique-id="admindashboardview-r20be774ba91b8fa7-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        {rev.authorName}
                      </span>
                      <div className="flex items-center text-amber-500 mt-1" data-api-unique-id="admindashboardview-reb6651425be071e1-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        {Array.from({
                    length: 5
                  }).map((_, index1) => <Star key={index1} className={`size-3.5 ${index1 < Math.floor(rev.rating) ? "fill-current" : "text-muted-foreground/30"}`} data-api-unique-id="admindashboardview-ra2271771aacad3bc-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1" />)}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1.5 block" data-api-unique-id="admindashboardview-r5edb15a9cd0d40a8-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        Verified Guest Reviewer
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 mt-1 block" data-api-unique-id="admindashboardview-rfba2d974302fd4cc-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        {rev.relativeTime}
                      </span>
                    </div>

                    <div className="flex-1" data-api-unique-id="admindashboardview-rf4427697faae8048-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <blockquote className="font-header italic text-base text-foreground leading-relaxed relative pl-4 border-l border-primary/40 line-clamp-4" data-api-unique-id="admindashboardview-rd63a4027f607f145-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        &ldquo;{rev.content}&rdquo;
                      </blockquote>
                    </div>

                    <div className="shrink-0 flex items-center gap-3" data-api-unique-id="admindashboardview-r3cc3e8e4da7da277-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                      <button type="button" onClick={() => handlers.handleNavigateToReviewDetail(rev.reviewSlot)} className="text-[10px] uppercase font-bold tracking-wider text-secondary hover:text-primary" data-api-unique-id="admindashboardview-r53cb44e854c8b1a0-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        Feature
                      </button>
                      <span className="text-stone-300" data-api-unique-id="admindashboardview-r8d3463dbe429d532-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">|</span>
                      <button type="button" onClick={() => handlers.handleHideReview(rev.id)} className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-primary" data-api-unique-id="admindashboardview-r4c8e85c015cecdc9-s1975089797" data-api-unique-page-name="src/backend/components/AdminDashboardView" data-api-in-loop="1">
                        Hide
                      </button>
                    </div>
                  </div>)}
            </div>
          </section>
        </main>
      </div>
    </div>;
}