"use client";

import React from "react";
import Link from "next/link";
import { Compass, Utensils, Flame, Star, MapPin, Clock, ArrowRight, Phone, Quote } from "lucide-react";
import EditableImg from "@/@base/EditableImg";
import type { UseHomeState as HomeState, UseHomeHandlers as HomeHandlers } from "@/frontend/hooks/useHome";
import { WeekdayKey } from "@/frontend/types/Home";
interface Props {
  state: HomeState;
  handlers: HomeHandlers;
}
const GALLERY_VISUALS = [{
  aspect: "md:col-span-8 md:row-span-2 aspect-[16/10]",
  frameStyle: true,
  tag: "Ambiance"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-square",
  frameStyle: false,
  tag: "Plated"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-[4/3]",
  frameStyle: false,
  tag: "Signature"
}, {
  aspect: "md:col-span-4 md:row-span-2 aspect-[3/4]",
  frameStyle: true,
  tag: "Detail"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-square",
  frameStyle: false,
  tag: "Plated"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-[4/3]",
  frameStyle: false,
  tag: "Plated"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-[4/3]",
  frameStyle: false,
  tag: "Signature"
}, {
  aspect: "md:col-span-8 md:row-span-2 aspect-[16/10]",
  frameStyle: true,
  tag: "Ambiance"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-[4/3]",
  frameStyle: false,
  tag: "Ambiance"
}, {
  aspect: "md:col-span-4 md:row-span-1 aspect-square",
  frameStyle: false,
  tag: "Signature"
}];
export default function HomeView({
  state,
  handlers
}: Props) {
  const weekdayMap: Record<WeekdayKey, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday"
  };
  if (state.isLoading) {
    return <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center text-[#2D2926] font-body" data-api-unique-id="homeview-r90d299a3a8edd3d0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <span className="text-sm tracking-widest uppercase" data-api-unique-id="homeview-r4eacd7b4c144a657-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">Loading...</span>
      </div>;
  }
  if (state.errorMsg) {
    return <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center text-[#B43A2B] font-body" data-api-unique-id="homeview-rc569871cca79060c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <span className="text-sm tracking-widest uppercase" data-api-unique-id="homeview-r08533d39c6fe64f2-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">{state.errorMsg}</span>
      </div>;
  }
  return <main className="min-h-screen bg-background text-foreground" data-api-unique-id="homeview-r6fe77639ad362c4a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
      {/* Hero Section */}
      <section data-controller-name="hero" className="w-full bg-[#F7F3E8] relative overflow-hidden" data-api-unique-id="homeview-r5b89207d782d8476-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} data-api-unique-id="homeview-r12e7804ba39c8233-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />

        <div className="container mx-auto px-6 py-12 md:py-16 lg:px-12 relative z-10" data-api-unique-id="homeview-rf30a366f1fbf9f28-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[580px]" data-api-unique-id="homeview-r725167149df80dbb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="lg:col-span-7 flex flex-col justify-center relative pl-0 md:pl-10 lg:pl-12" data-api-unique-id="homeview-r6940ad0c39e5e154-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-xs font-bold tracking-[0.25em] text-[#A87C4E] opacity-70" data-api-unique-id="homeview-r647f0748e990fc82-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                EST. BEIJING 2008
              </div>

              <div className="space-y-6 max-w-2xl animate-[fadeInSlideUp_0.7s_cubic-bezier(0.22,1,0.36,1)_both]" data-api-unique-id="homeview-r28da4883f2748d2e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <div className="inline-flex items-center gap-2 bg-[#E8E2D2]/50 border border-[#A87C4E]/20 px-3 py-1.5 rounded-sm" data-api-unique-id="homeview-rdebf53c906e2f85a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <span className="flex items-center gap-1 text-[#B43A2B]" data-api-unique-id="homeview-r21f0e193c86dbebe-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <Star className="size-4 fill-current" data-api-unique-id="homeview-r326dee904f02c5a0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <Star className="size-4 fill-current" data-api-unique-id="homeview-r5822fbaa5db2e1b8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <Star className="size-4 fill-current" data-api-unique-id="homeview-rc49c4f34459478c8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <Star className="size-4 fill-current" data-api-unique-id="homeview-r66a4db210175f79b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <Star className="size-4 fill-current" data-api-unique-id="homeview-r3ede63fdc8241cdb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  </span>
                  <span className="text-xs font-body font-bold text-[#2D2926] tracking-wider uppercase" data-api-unique-id="homeview-r8fc38e86574e4adc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    {state.profile?.rating ?? "4.6"} Rating
                  </span>
                  <span className="inline-block w-1.5 h-1.5 bg-[#B43A2B] rounded-full mx-1" data-api-unique-id="homeview-r200001393c967331-s386415978" data-api-unique-page-name="src/frontend/components/HomeView"></span>
                  <span className="text-xs font-body font-medium text-[#6B645E]" data-api-unique-id="homeview-rda17f8e76db8e311-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    {state.profile?.reviewCount ?? "59"} Guest Reviews
                  </span>
                </div>

                <div className="space-y-2" data-api-unique-id="homeview-r884013c43140c75c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <p className="text-xs font-body font-bold tracking-[0.3em] text-[#A87C4E] uppercase" data-api-unique-id="homeview-r93c9137ef74ebd7e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Fine Italian Craftsmanship
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[#2D2926] uppercase font-display leading-[0.95]" data-api-unique-id="homeview-re5474d17dc95c1f5-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    {state.profile?.name ?? <>
                        Tavola <br data-api-unique-id="homeview-r74582812a01c922e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                        <span className="text-[#B43A2B]" data-api-unique-id="homeview-r5963d4dcd95d18b3-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">Italian Dining</span>
                      </>}
                  </h1>
                </div>

                <p className="text-[#2D2926] font-body text-base md:text-lg leading-relaxed max-w-xl break-words line-clamp-4" data-api-unique-id="homeview-rb27ebec1d0d5398a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  {state.profile?.brandStory ?? "A refined destination for authentic Italian cuisine in Beijing. Experience our sunlit dining room, outstanding wood-fired pizza, affordable prefix lunch menus, and beautifully curated courses crafted with classic rustic passion."}
                </p>

                <div className="flex flex-wrap gap-2 pt-2" data-api-unique-id="homeview-rdf82d2b789d777e9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  {state.profile?.highlights && state.profile.highlights.length > 0 ? state.profile.highlights.map((h, index) => <span key={index} className="text-xs font-body text-[#6B645E] bg-[#E8E2D2]/30 px-3 py-1 border border-[#A87C4E]/10" data-api-unique-id="homeview-r974b97ed47411785-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                        {h}
                      </span>) : <>
                      <span className="text-xs font-body text-[#6B645E] bg-[#E8E2D2]/30 px-3 py-1 border border-[#A87C4E]/10" data-api-unique-id="homeview-r1fd7a1ec43ce9716-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Wood-Fired Pizza
                      </span>
                      <span className="text-xs font-body text-[#6B645E] bg-[#E8E2D2]/30 px-3 py-1 border border-[#A87C4E]/10" data-api-unique-id="homeview-rf3afffefdfede578-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Affordable Prefix Lunch
                      </span>
                      <span className="text-xs font-body text-[#6B645E] bg-[#E8E2D2]/30 px-3 py-1 border border-[#A87C4E]/10" data-api-unique-id="homeview-r1024af08d037d3ff-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Premium Wine Pairing
                      </span>
                    </>}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4" data-api-unique-id="homeview-r3df0bd373afcbe29-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <Link href="#booking" className="inline-flex items-center justify-center transition-all duration-300 font-body text-sm font-bold tracking-widest uppercase bg-[#B43A2B] text-[#F7F3E8] border border-[#B43A2B] hover:bg-transparent hover:text-[#B43A2B] px-8 py-4 shadow-md" data-api-unique-id="homeview-re1d9b44faa9bb2a1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Book a Table
                  </Link>
                  <Link href="#menu" className="inline-flex items-center justify-center transition-all duration-300 font-body text-sm font-bold tracking-widest uppercase bg-transparent text-[#A87C4E] border border-[#A87C4E] hover:bg-[#A87C4E] hover:text-[#F7F3E8] px-8 py-4" data-api-unique-id="homeview-racb60f938f0744b2-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Explore Menu
                  </Link>
                </div>

                <div className="pt-6 border-t border-[#A87C4E]/20 flex flex-col sm:flex-row sm:items-center gap-4 text-[#6B645E] text-xs font-body" data-api-unique-id="homeview-r72c8a8bc1a1c644c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <div className="flex items-center gap-2" data-api-unique-id="homeview-r87cc66f82374d3ad-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <MapPin className="size-4 shrink-0 text-[#B43A2B]" data-api-unique-id="homeview-r7a1ecc2bca8b3940-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <span className="truncate" data-api-unique-id="homeview-rbb4d396b1b19419b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      {state.profile?.address ?? "Diplomatic Apartments, Liangmaqiao, Beijing"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-[#A87C4E]/40" data-api-unique-id="homeview-r370006185f4b936d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">|</div>
                  <div className="flex items-center gap-2" data-api-unique-id="homeview-r55cae33b410f65ee-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <Clock className="size-4 shrink-0 text-[#B43A2B]" data-api-unique-id="homeview-r96e5222415ff9a5e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    <span data-api-unique-id="homeview-r136e6fc14a91748f-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">Open Daily: 10:00 AM – 10:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center" data-api-unique-id="homeview-r8d29b3374726b018-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="w-full h-full min-h-[350px] md:min-h-[450px] lg:min-h-[500px] p-2 border border-[#A87C4E]/20 bg-[#FDFBFA] shadow-card relative overflow-hidden group" data-api-unique-id="homeview-rd5f40fadc724cbb9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <div className="relative w-full h-full overflow-hidden" data-api-unique-id="homeview-ree205539541279b1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <EditableImg propKey="hero-image" keywords="https://lh3.googleusercontent.com/place-photos/AG9NLjDVEyeuSfZ31zI012CF0pBfw7awf8USHJIIX01d4gBUBYVmlSAGdbtA6bD--MsCfWMQYtroHhlloe5zATTXotF0kF696NSPrc9C1bQ_PvDzfT23AVKV6DixVeM3JeMF_JKfc9hlhwjp2nj2RQ=s4800-w1200" className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.02]" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: 'unset'
                }} description="Tavola Sunlit Dining Room" data-api-unique-id="homeview-r527fcf5e86eca3eb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />

                  <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBFA]/95 p-4 border border-[#A87C4E]/20 backdrop-blur-xs" data-api-unique-id="homeview-r615806033811ddd9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <span className="text-[#B43A2B] text-2xl font-display italic block line-height-none leading-none mb-1" data-api-unique-id="homeview-rd503eec147d580c0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">“</span>
                    <p className="text-xs text-[#2D2926] font-body italic line-clamp-2 leading-relaxed" data-api-unique-id="homeview-rcfe49d7272fc485d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      "Probably the best Italian restaurant in Beijing. Highly classy and cozy."
                    </p>
                    <p className="text-[10px] font-bold text-[#A87C4E] uppercase tracking-wider mt-2 block" data-api-unique-id="homeview-r7b94c35fd104c541-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      — Kae Anchalee, Verified Guest
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Highlights Section */}
      <section data-controller-name="culinary-highlights" className="w-full bg-[#F7F3E8] relative overflow-hidden py-14 md:py-20 border-t border-[#A87C4E]/20" data-api-unique-id="homeview-r8a73bde6b01abcb1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} data-api-unique-id="homeview-rb9a5513e911bd9c8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10" data-api-unique-id="homeview-r2f376058f36e9724-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" data-api-unique-id="homeview-r3ea6068d208877bf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="inline-flex items-center gap-2" data-api-unique-id="homeview-rb8b46e02fcd133d9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <span className="w-1.5 h-1.5 bg-[#B43A2B] rounded-full" data-api-unique-id="homeview-rf51fb76fa8aaa776-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#A87C4E] uppercase font-body" data-api-unique-id="homeview-r788c548a8e86b375-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                L'Arte della Cucina
              </span>
              <span className="w-1.5 h-1.5 bg-[#B43A2B] rounded-full" data-api-unique-id="homeview-r8e56cba49d7cbe37-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#2D2926] uppercase font-display" data-api-unique-id="homeview-rb61d5b6c431dc3fd-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              Culinary Highlights
            </h2>

            <div className="flex items-center justify-center gap-4 my-2" data-api-unique-id="homeview-r0d402e5bab2c2362-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="h-[1px] bg-[#A87C4E]/30 flex-1 max-w-[80px]" data-api-unique-id="homeview-r94c19c8f06e83c50-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
              <Flame className="size-5 text-[#B43A2B] stroke-[1.25]" data-api-unique-id="homeview-r9d6da94ceee99ff8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
              <div className="h-[1px] bg-[#A87C4E]/30 flex-1 max-w-[80px]" data-api-unique-id="homeview-r5e8b8476e209bd15-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
            </div>

            <p className="text-base text-[#6B645E] font-body leading-relaxed max-w-2xl mx-auto" data-api-unique-id="homeview-rc593f11042697edf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              Experience the vibrant essence of traditional Italian gastronomy in the heart of Beijing.
              We blend imported heirloom ingredients with refined Roman culinary techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch" data-api-unique-id="homeview-r33b148103b1d09f0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <article className="flex flex-col h-full bg-[#FDFBFA] border border-[#A87C4E]/20 shadow-card p-6 md:p-8 space-y-6 justify-between group transition-all duration-300 hover:border-[#A87C4E]/40" data-api-unique-id="homeview-r978318f230d8d5a4-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="space-y-6" data-api-unique-id="homeview-r21b5536567baace1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <div className="p-2 border border-[#A87C4E]/20 bg-[#F7F3E8] relative overflow-hidden aspect-[4/3]" data-api-unique-id="homeview-rc6f96033fb914ac8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <EditableImg propKey="culinary-lunch" keywords="https://lh3.googleusercontent.com/place-photos/AG9NLjDI-klgjpWDjIUPgOD9vfUdYJgIJbZYraztXkLaWEhuXLV0yu34mFnzASNbXHC2bUFKajFvXS-zlWlj7IjXXDd0YJlGQWgoGzpdFf2p9qjfT4X2l8WM1hFbZ_HkyMPIWb-fruy_aeEQ2BRW-8DPVSys=s4800-w1200" className="w-full h-full object-cover grayscale-0 transition-transform duration-500 group-hover:scale-[1.01]" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '4/3'
                }} description="Authentic Prefix Lunch appetizer at Tavola" data-api-unique-id="homeview-re884af513c38c8d7-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  <div className="absolute top-4 left-4 bg-[#B43A2B] text-[#F7F3E8] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-md font-body" data-api-unique-id="homeview-rcdb18672f328f99d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Midday Special
                  </div>
                </div>

                <div className="space-y-4" data-api-unique-id="homeview-rc304088f5abf670b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <div className="flex items-center justify-between border-b border-[#A87C4E]/20 pb-3" data-api-unique-id="homeview-rd4d5d3d4326676e8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#2D2926] font-header tracking-tight" data-api-unique-id="homeview-r8d64fe48403ca025-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Authentic Prefix Lunch
                    </h3>
                    <Utensils className="size-5 text-[#A87C4E] shrink-0 stroke-[1.25]" data-api-unique-id="homeview-r77716c1a2daa70af-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  </div>

                  <p className="text-sm md:text-base text-[#6B645E] font-body leading-relaxed" data-api-unique-id="homeview-re807d7b87752c5ea-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Designed for a refined midday escape, our highly praised prefix lunch menu offers premium flexibility and unmatched value. Guests can customize their dining experience with a curated selection of delicate appetizers, exquisite mains, and handcrafted desserts. It is the perfect portion size for business meetings or relaxed social gatherings.
                  </p>

                  <ul className="space-y-2 text-xs md:text-sm text-[#2D2926] font-body font-medium pt-2" data-api-unique-id="homeview-r401b1113a931746d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-r999bfec8df135cff-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Available as a tailored 2-course or a decadent 3-course set
                    </li>
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-r7eb1647b713deda0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Complemented beautifully by our refreshing sparkling juices
                    </li>
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-r5ff6d6c66ebcd7bf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Menu rotates weekly to feature fresh, peak-season ingredients
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-[#A87C4E]/10" data-api-unique-id="homeview-r9d6e14bfa5395607-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <Link href="/#menu" className="inline-flex w-full items-center justify-center transition-all duration-300 font-body text-xs md:text-sm font-bold tracking-widest uppercase bg-transparent text-[#A87C4E] border border-[#A87C4E] hover:bg-[#A87C4E] hover:text-[#F7F3E8] px-8 py-4" data-api-unique-id="homeview-rb72d339a92b5c4e7-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  View Lunch Menu
                </Link>
              </div>
            </article>

            <article className="flex flex-col h-full bg-[#FDFBFA] border border-[#A87C4E]/20 shadow-card p-6 md:p-8 space-y-6 justify-between group transition-all duration-300 hover:border-[#A87C4E]/40" data-api-unique-id="homeview-r7ca8e062632748a5-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="space-y-6" data-api-unique-id="homeview-r4e0d2e692921a42c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <div className="p-2 border border-[#A87C4E]/20 bg-[#F7F3E8] relative overflow-hidden aspect-[4/3]" data-api-unique-id="homeview-r02947d408b792691-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <EditableImg propKey="culinary-pizza" keywords="https://lh3.googleusercontent.com/place-photos/AG9NLjDxGoYvPxmlnwfXlJjbj7DLQJ-oE_mpzBfDsTVLlsLwon2MOcbzNn0wCCpSuOUy8UbHH-KUxaJhHDwD7wRarpMrpd-WqdKhxs4iE7puZwdDnxyr7l7_QenGWE9xLqAFhAORHURfXKH1PY3-H6nT69cFEw=s4800-w1200" className="w-full h-full object-cover grayscale-0 transition-transform duration-500 group-hover:scale-[1.01]" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '4/3'
                }} description="Artisan wood-fired pizza at Tavola" data-api-unique-id="homeview-r01254db78bd561f6-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  <div className="absolute top-4 left-4 bg-[#B43A2B] text-[#F7F3E8] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-md font-body" data-api-unique-id="homeview-r6561ba6d445ecfaf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Signature Dish
                  </div>
                </div>

                <div className="space-y-4" data-api-unique-id="homeview-r2447f4c5d075aa37-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <div className="flex items-center justify-between border-b border-[#A87C4E]/20 pb-3" data-api-unique-id="homeview-r22dcc62da836d1a8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#2D2926] font-header tracking-tight" data-api-unique-id="homeview-rfef57d2f778bdcba-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Artisan Wood-Fired Pizza
                    </h3>
                    <Compass className="size-5 text-[#A87C4E] shrink-0 stroke-[1.25]" data-api-unique-id="homeview-r551ffdf00178c05c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  </div>

                  <p className="text-sm md:text-base text-[#6B645E] font-body leading-relaxed" data-api-unique-id="homeview-r1a09f6988f432613-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    Renowned as the finest pizza in Beijing, our creations are built on a foundation of time-honored Roman techniques. We slow-ferment our dough for 48 hours, then bake it in a custom stone oven to achieve a blistered, airy crust that is crispy yet beautifully tender. Each pie is finished with curated, imported Italian cured meats, wild mushrooms, and creamy cheese.
                  </p>

                  <ul className="space-y-2 text-xs md:text-sm text-[#2D2926] font-body font-medium pt-2" data-api-unique-id="homeview-r352d829fcd45054b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-rc4f833a8c20ebee2-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Crafted with premium Italian flour and San Marzano tomatoes
                    </li>
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-r0152975d65304f2c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Baked at 400°C for the ultimate traditional crust texture
                    </li>
                    <li className="flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#B43A2B] before:inline-block before:mr-2" data-api-unique-id="homeview-r82a77e9a720c5e47-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Perfect centerpiece for cozy dates or family gatherings
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-[#A87C4E]/10" data-api-unique-id="homeview-r864ea06f46c6f4c5-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <Link href="/#menu" className="inline-flex w-full items-center justify-center transition-all duration-300 font-body text-xs md:text-sm font-bold tracking-widest uppercase bg-transparent text-[#A87C4E] border border-[#A87C4E] hover:bg-[#A87C4E] hover:text-[#F7F3E8] px-8 py-4" data-api-unique-id="homeview-r85afe3cb9aa4cf5e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  View Pizza Menu
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto border-t border-[#A87C4E]/30 pt-10" data-api-unique-id="homeview-ra85077ad339d92d5-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <p className="font-display italic text-[#A87C4E] text-xl md:text-2xl leading-relaxed" data-api-unique-id="homeview-r5833330dd1bc637a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              "A perfect marriage of rustic soul and modern elegance, transforming every meal into an authentic celebration."
            </p>
          </div>
        </div>
      </section>

      {/* Atmosphere Gallery Section */}
      <section data-controller-name="atmosphere-gallery" className="w-full bg-[#F7F3E8] relative overflow-hidden py-16 md:py-20" data-api-unique-id="homeview-r2d9f3e6a5f6c6b60-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} data-api-unique-id="homeview-r8ecd3e5e6f7cdf88-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10" data-api-unique-id="homeview-r61989bfc12010ec9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
          <div className="text-center max-w-3xl mx-auto mb-16" data-api-unique-id="homeview-rfcf88a20f76398a4-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="inline-flex items-center gap-3 mb-4" data-api-unique-id="homeview-r6f3d2c7841d3430c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <span className="h-[1px] w-8 bg-[#A87C4E]/40" data-api-unique-id="homeview-r091e612c5bb6e56d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B43A2B] font-body" data-api-unique-id="homeview-r905265d1c9399519-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                VISUAL CHRONICLES
              </span>
              <span className="h-[1px] w-8 bg-[#A87C4E]/40" data-api-unique-id="homeview-rb2fb3ad3a0ff4f36-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#2D2926] font-display uppercase mb-4" data-api-unique-id="homeview-r75d8beab1b4ce81c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              The Tavola Experience
            </h2>

            <p className="text-[#6B645E] text-base leading-relaxed font-body max-w-xl mx-auto" data-api-unique-id="homeview-r10803930490c4c33-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              A visual narrative of our rustic-refined culinary sanctuary in Beijing. Experience the delicate harmony of authentic Italian tradition and modern Roman style.
            </p>

            <div className="border-t border-[#A87C4E]/30 w-16 mx-auto mt-6" data-api-unique-id="homeview-r8badde2cf08adf65-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
          </div>

          {!state.profile?.photos || state.profile.photos.length === 0 ? <div className="text-center py-20 text-[#6B645E] font-body tracking-wider text-sm uppercase" data-api-unique-id="homeview-r50e5cd495b489215-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              Visuals coming soon
            </div> : <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch" data-api-unique-id="homeview-rb0f1ce445010ce75-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              {state.profile.photos.map((image, index) => {
            const visual = GALLERY_VISUALS[index % GALLERY_VISUALS.length];
            return <div key={image.id} className={`group relative flex flex-col justify-between overflow-hidden bg-[#FDFBFA] transition-all duration-300 ${visual.aspect} ${visual.frameStyle ? "p-3 border border-[#A87C4E]/30 shadow-card" : "border border-[#A87C4E]/10"}`} data-api-unique-id="homeview-r7dab6df46f382db2-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                    <div className="relative w-full h-full overflow-hidden flex-1 bg-[#E8E2D2]" data-api-unique-id="homeview-r9982e24d9b8bcdc2-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                      <EditableImg propKey={`gallery-${image.id}`} keywords={image.imageUrl} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: 'unset'
                }} description={image.description ?? image.alt} data-api-unique-id="homeview-r7a1cde3fa1ad962e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1" />

                      <div className="absolute top-3 left-3 bg-[#2D2926]/90 backdrop-blur-xs text-[#F7F3E8] text-[9px] font-bold tracking-widest uppercase py-1 px-2" data-api-unique-id="homeview-rc4db75ecdd5a6b4b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                        {visual.tag}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/80 via-[#2D2926]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" data-api-unique-id="homeview-r2e806cdb45f495ce-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1" />
                    </div>

                    <div className="p-3 bg-[#FDFBFA] border-t border-[#A87C4E]/10 shrink-0" data-api-unique-id="homeview-r69d3efa25f8f47be-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                      <p className="text-xs text-[#2D2926] font-body line-clamp-1 italic tracking-wide" data-api-unique-id="homeview-ra9a832b864a0cfb8-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                        &ldquo;{image.description ?? image.alt}&rdquo;
                      </p>
                    </div>
                  </div>;
          })}
            </div>}

          <div className="mt-20 py-10 border-t border-b border-[#A87C4E]/30 max-w-4xl mx-auto text-center" data-api-unique-id="homeview-r5836ea4aac752c39-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <p className="font-display italic text-[#A87C4E] text-2xl md:text-3xl leading-relaxed px-4" data-api-unique-id="homeview-r04d234c839404368-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              &ldquo;Probably the best Italian restaurant in Beijing. Perfect for a classy date night or a leisurely family lunch.&rdquo;
            </p>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#B43A2B] mt-4 font-body" data-api-unique-id="homeview-rc958098cd677c1ee-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              — Guest Sentiment ({state.profile?.rating ?? "4.6"} ★ Rated Venue)
            </p>
          </div>

          <div className="mt-16 text-center" data-api-unique-id="homeview-r3baeea8edbe30405-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center" data-api-unique-id="homeview-r5773f47f357189da-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <Link href="/" className="inline-flex items-center justify-center transition-all duration-300 font-body text-xs font-bold tracking-widest uppercase bg-[#B43A2B] text-[#F7F3E8] border border-[#B43A2B] hover:bg-transparent hover:text-[#B43A2B] px-8 py-4" data-api-unique-id="homeview-r47a18113305cad99-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                Reserve a Table
              </Link>
              <a href={`tel:${state.profile?.phone ?? "01085325068"}`} className="inline-flex items-center justify-center transition-all duration-300 font-body text-xs font-bold tracking-widest uppercase bg-transparent text-[#A87C4E] border border-[#A87C4E] hover:bg-[#A87C4E] hover:text-[#F7F3E8] px-8 py-4" data-api-unique-id="homeview-rf63f02092b41f149-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                Call {state.profile?.phone ?? "010 8532 5068"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews And Contact Section */}
      <section data-controller-name="reviews-and-contact" className="w-full bg-[#E8E2D2]/70 relative overflow-hidden py-16 md:py-20 border-t border-[#A87C4E]/20" data-api-unique-id="homeview-r1bf140f78cb68179-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} data-api-unique-id="homeview-r6c31d9d4ee5befb9-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />

        <div className="container mx-auto px-6 md:px-8" data-api-unique-id="homeview-re412ba7ee1ccb967-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
          <div className="mb-12 md:mb-16 border-b border-[#A87C4E]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6" data-api-unique-id="homeview-rc21ca899eee94fd0-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="space-y-3" data-api-unique-id="homeview-r9c3db452eda2cb7c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="inline-flex items-center gap-1.5 bg-[#B43A2B]/10 text-[#B43A2B] px-3 py-1 rounded-sm text-xs font-bold tracking-[0.2em] uppercase" data-api-unique-id="homeview-r8268afe2d665d3c1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <Star className="size-3 fill-current" data-api-unique-id="homeview-r48a787dde29758b5-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                <span data-api-unique-id="homeview-r3cd6c776e40fad5f-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">{state.profile?.rating ?? "4.6"} Guest Rating • {state.profile?.reviewCount ?? "59"} Reviews</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#2D2926] tracking-tight" data-api-unique-id="homeview-r64b0452b119eb482-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                Guest Reflections & Visit Us
              </h2>
            </div>
            <p className="font-body text-[#6B645E] text-base max-w-md leading-relaxed" data-api-unique-id="homeview-rcb243869590f1fab-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              Honest experiences shared by our visitors. Discover why Tavola remains Beijing's favorite corner for authentic Italian traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch" data-api-unique-id="homeview-r0489dab91733db1b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
            <div className="lg:col-span-7 flex flex-col justify-between" data-api-unique-id="homeview-rae0928f181402038-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              {!state.profile?.reviews || state.profile.reviews.length === 0 ? <div className="h-full flex items-center justify-center border border-[#A87C4E]/20 bg-[#FDFBFA] p-8 text-[#6B645E] text-sm uppercase tracking-widest font-body" data-api-unique-id="homeview-r1990250d914f29cb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  No reviews available
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" data-api-unique-id="homeview-r5f8ddb0f626f6729-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  {state.profile.reviews.map((t, index) => <div key={t.id} className={`bg-[#FDFBFA] border border-[#A87C4E]/20 p-6 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(168,124,78,0.05)] transition-all duration-300 ${index === 2 ? "md:col-span-2" : ""}`} data-api-unique-id="homeview-r196c21f1770cf639-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                      <div className="space-y-4" data-api-unique-id="homeview-r87aeead0107c5bfc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                        <div className="relative" data-api-unique-id="homeview-rc3569392fb0d24db-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                          <Quote className="size-8 text-[#A87C4E]/10 absolute -top-4 -left-3" data-api-unique-id="homeview-r71eeddddb47e80cb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1" />
                          <p className="font-header italic text-lg text-[#2D2926] leading-relaxed relative z-10 pl-2 line-clamp-6" data-api-unique-id="homeview-r12f51aeb3f06428c-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                            "{t.content}"
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#A87C4E]/10 flex items-center justify-between" data-api-unique-id="homeview-ra2cdb1bfb17b1719-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                        <span className="font-body text-xs font-bold tracking-wider text-[#A87C4E] uppercase truncate max-w-[60%]" data-api-unique-id="homeview-r997e142a6b72681b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                          {t.authorName}
                        </span>
                        <div className="flex gap-0.5 shrink-0" data-api-unique-id="homeview-rb72aa1f41b496922-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                          {[...Array(Math.floor(t.rating || 5))].map((_, index1) => <Star key={index1} className="size-3 fill-[#B43A2B] text-[#B43A2B]" data-api-unique-id="homeview-redcaf31280613a99-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1" />)}
                        </div>
                      </div>
                    </div>)}
                </div>}
            </div>

            <div className="lg:col-span-5 flex flex-col h-full" data-api-unique-id="homeview-r5a3e01c5cf1deccc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
              <div className="bg-[#2D2926] text-[#F7F3E8] p-8 h-full flex flex-col justify-between relative overflow-hidden border border-[#A87C4E]/30" data-api-unique-id="homeview-r56f0ff0afa55e979-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                <div className="space-y-8 relative z-10" data-api-unique-id="homeview-r716e56138d4cab97-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <div className="border-b border-[#F7F3E8]/10 pb-6" data-api-unique-id="homeview-r752aabfb30c95768-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <h3 className="font-display text-2xl text-[#D9C5A3] mb-2 tracking-wide" data-api-unique-id="homeview-r0aacaf51b609649b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      {state.profile?.name ?? "Tavola Italian Dining"}
                    </h3>
                    <p className="text-xs text-[#F7F3E8]/60 font-body uppercase tracking-widest" data-api-unique-id="homeview-rb161975ec17a55fc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      Beijing Ambassador District
                    </p>
                  </div>

                  <div className="flex gap-4 items-start" data-api-unique-id="homeview-rfc6d25c72873caac-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <div className="size-10 rounded-none border border-[#D9C5A3]/30 flex items-center justify-center text-[#D9C5A3] shrink-0 mt-0.5" data-api-unique-id="homeview-rd56a93f0b7e22c7e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <MapPin className="size-5" data-api-unique-id="homeview-r4406f6497fd8ad66-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    </div>
                    <div data-api-unique-id="homeview-r4d244b7b11adcdcc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <h4 className="font-body text-xs font-bold tracking-widest uppercase text-[#D9C5A3] mb-1" data-api-unique-id="homeview-r9b9f7072e17cf989-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Our Address
                      </h4>
                      <p className="font-body text-sm leading-relaxed text-[#F7F3E8]/90" data-api-unique-id="homeview-re5c54cf9df5d0cc1-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        {state.profile?.address ?? "China, Bei Jing Shi, Chao Yang Qu, Dong Fang Dong Lu, 19号亮马桥外交公寓B区会所2层 邮政编码: 100028"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start" data-api-unique-id="homeview-r0d9bd0b29b1aa73a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <div className="size-10 rounded-none border border-[#D9C5A3]/30 flex items-center justify-center text-[#D9C5A3] shrink-0 mt-0.5" data-api-unique-id="homeview-r6aef654fcc6b4970-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <Phone className="size-5" data-api-unique-id="homeview-rb81b0dd9815c2a8b-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    </div>
                    <div data-api-unique-id="homeview-r81e647df436986cf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <h4 className="font-body text-xs font-bold tracking-widest uppercase text-[#D9C5A3] mb-1" data-api-unique-id="homeview-rffc0b5dce989ecc4-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Reservations & Inquiries
                      </h4>
                      <a href={`tel:${state.profile?.phone ?? "01085325068"}`} className="font-header text-xl text-[#F7F3E8] hover:text-[#B43A2B] transition-colors tracking-wide block truncate" data-api-unique-id="homeview-ra1f3bb8db3c45162-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        {state.profile?.phone ?? "010 8532 5068"}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start" data-api-unique-id="homeview-reddd7820eb400373-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <div className="size-10 rounded-none border border-[#D9C5A3]/30 flex items-center justify-center text-[#D9C5A3] shrink-0 mt-0.5" data-api-unique-id="homeview-r8221ac085fcd0b37-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <Clock className="size-5" data-api-unique-id="homeview-r2b4c98e5158a0c96-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                    </div>
                    <div className="w-full" data-api-unique-id="homeview-r53df81c295d2c7eb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                      <h4 className="font-body text-xs font-bold tracking-widest uppercase text-[#D9C5A3] mb-2" data-api-unique-id="homeview-r554630f766a9fe13-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        Opening Hours
                      </h4>
                      <ul className="space-y-1.5 font-body text-xs text-[#F7F3E8]/95 divide-y divide-[#F7F3E8]/5" data-api-unique-id="homeview-r002d516651e1c33d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                        {state.profile?.hours && state.profile.hours.length > 0 ? state.profile.hours.map((hour, index) => <li key={hour.id} className="flex justify-between py-1" data-api-unique-id="homeview-r2c6033640e7dfd6a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">
                              <span data-api-unique-id="homeview-r4538696b2aaea0bf-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">{weekdayMap[hour.weekday]}</span>
                              <span className="font-bold text-right ml-4 break-words max-w-[60%]" data-api-unique-id="homeview-rbdd64deaa24bbe5e-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" data-api-in-loop="1">{hour.fullLine}</span>
                            </li>) : <li className="flex justify-between py-1" data-api-unique-id="homeview-rc0a5c31f2bdd46bc-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                            <span data-api-unique-id="homeview-r75086f75ef56181d-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">Monday – Sunday</span>
                            <span className="font-bold" data-api-unique-id="homeview-r4531efdc2d7b49fb-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">10:00 AM – 10:30 PM</span>
                          </li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F7F3E8]/10 relative z-10" data-api-unique-id="homeview-r86a582ac81834497-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <a href={state.profile?.website ?? "https://ditu.amap.com/search?query=Tavola+Italian+Dining+亮马桥"} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-transparent text-[#D9C5A3] border border-[#D9C5A3] hover:bg-[#D9C5A3] hover:text-[#2D2926] transition-all duration-300 font-body text-xs font-bold tracking-widest uppercase py-4" data-api-unique-id="homeview-raf032534649b1897-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                    <span data-api-unique-id="homeview-r3968c2735084c99a-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">Get Directions</span>
                    <ArrowRight className="size-4" data-api-unique-id="homeview-r41ec64f08d652437-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                  </a>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-44 opacity-25 pointer-events-none" data-api-unique-id="homeview-r34933cd4a66cf440-s386415978" data-api-unique-page-name="src/frontend/components/HomeView">
                  <EditableImg propKey="contact-bg-decor" keywords="https://lh3.googleusercontent.com/place-photos/AG9NLjD--K4TP4ekNIF8n8VvwKY1Wcg8tpiMi_5ZZCumM5MitZWGLjMUf0m6VPDR59wc11oNtQRZ6XvaHRdKgBh92QXkKt3EAZz_hEvmP2ibrMY-odZLnqk3CJlgrdLCFgS9nxSygYILn6NxpHWn_bkQxf4l=s4800-w1200" className="w-full h-full object-cover object-bottom" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'bottom',
                  aspectRatio: 'unset'
                }} description="Atmospheric warm wax candles on wooden bar at Tavola" data-api-unique-id="homeview-r281f189ef318f3f4-s386415978" data-api-unique-page-name="src/frontend/components/HomeView" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>;
}