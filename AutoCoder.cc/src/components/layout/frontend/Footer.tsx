'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram, Facebook, UtensilsCrossed } from 'lucide-react';
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <footer className="w-full bg-foreground text-background relative overflow-hidden">
      
      {/* 顶部分隔线 */}
      <div className="w-full h-[1px] bg-border/40" />

      <div className="container mx-auto px-8 py-14 lg:py-20 relative z-10">
        
        {/* 核心信息网格：按原样还原列数与宽度比例 (5:4:3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* 列 1: 品牌与理念 (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center shrink-0 text-primary">
                <UtensilsCrossed className="w-5 h-5" />
              </span>
              <span className="font-display text-2xl font-bold uppercase tracking-widest text-card">
                Tavola
              </span>
            </div>
            <p className="max-w-md break-words leading-relaxed font-body text-sm text-muted/80">
              An authentic expression of culinary heritage. Every dish is a canvas of organic Italian ingredients, handcrafted traditions, and contemporary Roman excellence curated in the heart of Beijing.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a href="https://instagram.com/tavola_dining" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/30 flex items-center justify-center text-muted/70 hover:text-primary hover:border-primary transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/tavoladining" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/30 flex items-center justify-center text-muted/70 hover:text-primary hover:border-primary transition-colors duration-200" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 列 2: 位置与联系方式 (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-4">
            <h4 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Inquiries & Location
            </h4>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                <span className="leading-relaxed break-words font-body text-sm text-muted/90">
                  China, Bei Jing Shi, Chao Yang Qu, Dong Fang Dong Lu, 19号亮马桥外交公寓B区会所2层
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-primary" />
                <a href="tel:01085325068" className="font-body text-sm text-muted/90 hover:text-primary transition-colors duration-200">
                  010 8532 5068
                </a>
              </div>
            </div>
          </div>

          {/* 列 3: 营业时间 (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Hours of Service
            </h4>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                <div className="flex flex-col gap-1">
                  <p className="font-body text-sm font-medium text-muted/90">Lunch Service</p>
                  <p className="font-body text-xs text-muted/60">Daily: 11:30 AM — 2:30 PM</p>
                  <p className="font-body text-sm font-medium text-muted/90 pt-1">Dinner Service</p>
                  <p className="font-body text-xs text-muted/60">Daily: 5:30 PM — 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 分隔线 */}
        <div className="border-t border-border/20 w-full mt-12 mb-8" />

        {/* 底部：版权及附加导航 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-body text-xs tracking-wider text-center md:text-left text-muted/50">
            <span>© {currentYear} Tavola Italian Dining. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" onClick={scrollToTop} className="font-body text-xs uppercase tracking-widest text-muted/70 hover:text-primary transition-colors duration-200">
              Back To Top
            </Link>
          </div>
        </div>
      </div>
    </footer>;
}
