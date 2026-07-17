'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall } from 'lucide-react';

// 扁平化的路由配置
const NAV_ITEMS = [{
  id: 'F01',
  label: 'Home',
  href: '/'
}, {
  id: 'F02',
  label: 'Order Online',
  href: '/foodorder'
}];
export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`sticky top-0 z-50 w-full h-[60px] min-h-[60px] max-h-[60px] border-b transition-colors duration-300 isolate ${isScrolled ? 'bg-card border-border/20 shadow-sm' : 'bg-background border-border/10'}`}>
      <div className="container mx-auto px-8 h-full flex items-center justify-between">
        
        {/* 左侧：Logo */}
        <Link href="/" className="flex items-center h-full gap-3 shrink-0 focus-visible:outline-none">
          <div className="w-[40px] h-[40px] border border-border bg-foreground relative overflow-hidden flex items-center justify-center shrink-0">
            <img src="https://www.autocoder.cc/background/zaki_prod/generated/3354c2d1a0d64820a7c0c2e4ead9d48c.png" alt="Tavola Logo" className="w-full h-full object-cover" />
          </div>
          <span className="uppercase hidden sm:block tracking-widest font-display text-lg font-black text-foreground">
            Tavola
          </span>
        </Link>

        {/* 中间：导航菜单 (PC端) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          return <Link key={item.id} href={item.href} className={`font-body text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 py-2 border-b-2 ${isActive ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-primary hover:border-primary'}`}>
                <span className="truncate">{item.label}</span>
              </Link>;
        })}
        </nav>

        {/* 右侧：辅助按钮/移动端触发器 */}
        <div className="flex items-center gap-4 shrink-0">
          {/* PC端预留结构 */}
          <Link href="/foodorder" className="hidden md:inline-flex items-center justify-center border px-5 py-2 uppercase tracking-widest transition-all duration-300 font-body text-xs font-bold bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary">
            <PhoneCall className="mr-2 w-4 h-4" />
            <span>Order Pickup</span>
          </Link>

          {/* 移动端菜单开关 */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 flex items-center justify-center text-foreground hover:text-primary focus-visible:outline-none transition-colors" aria-expanded={isOpen} aria-label="Toggle navigation menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 移动端侧边抽屉遮罩 */}
      {isOpen && <div className="md:hidden fixed inset-0 top-[60px] z-40 backdrop-blur-sm bg-foreground/40 transition-opacity" onClick={() => setIsOpen(false)} />}

      {/* 移动端抽屉菜单 */}
      <div className={`fixed top-[60px] right-0 bottom-0 w-4/5 max-w-[300px] bg-card border-l border-border/20 z-50 p-8 flex flex-col justify-between transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-8">
          <div className="border-b border-border/10 pb-4 flex flex-col gap-1">
            <span className="uppercase tracking-widest font-display text-xl font-bold text-foreground">
              Tavola
            </span>
            <span className="text-xs text-muted-foreground italic font-header">
              L'arte di vivere
            </span>
          </div>

          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            return <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)} className={`font-body text-sm font-bold uppercase tracking-[0.15em] block py-1 transition-colors ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                  {item.label}
                </Link>;
          })}
          </nav>
        </div>

        <div className="pt-8 border-t border-border/10">
          <Link href="/foodorder" onClick={() => setIsOpen(false)} className="w-full inline-flex items-center justify-center border px-6 py-4 uppercase tracking-widest transition-all duration-300 font-body text-xs font-bold bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary">
            <PhoneCall className="mr-2 w-4 h-4" />
            <span>Order Pickup</span>
          </Link>
        </div>
      </div>
    </header>;
}
