'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, UserPlus, LayoutDashboard, ImageIcon, MessageSquare, Settings, ShoppingBag, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useAdminSession } from '@/tools/BackendSession';

// 导航菜单展平配置
const NAV_ITEMS = [{
  id: 'B01',
  label: 'Admin Login',
  href: '/adminlogin',
  icon: LogIn,
  role: 'GUEST'
}, {
  id: 'B02',
  label: 'Admin Register',
  href: '/adminregister',
  icon: UserPlus,
  role: 'GUEST'
}, {
  id: 'B03',
  label: 'Admin Dashboard',
  href: '/admindashboard',
  icon: LayoutDashboard,
  role: 'ADMIN'
}, {
  id: 'B04',
  label: 'Photos Management',
  href: '/photosmanagement',
  icon: ImageIcon,
  role: 'ADMIN'
}, {
  id: 'B05',
  label: 'Reviews Management',
  href: '/reviewsmanagement',
  icon: MessageSquare,
  role: 'ADMIN'
}, {
  id: 'B06',
  label: 'Business Info',
  href: '/businessinfomanagement',
  icon: Settings,
  role: 'ADMIN'
}, {
  id: 'B07',
  label: 'Orders Management',
  href: '/ordersmanagement',
  icon: ShoppingBag,
  role: 'ADMIN'
}];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    token,
    reset
  } = useAdminSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 简单权限判断：存在 token 视为 ADMIN，否则为 GUEST
  const isGuest = !token;
  const currentRole = isGuest ? 'GUEST' : 'ADMIN';

  // 过滤当前角色可见的菜单项
  const visibleNavItems = NAV_ITEMS.filter(item => item.role === currentRole);
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };
  const handleLogout = () => {
    reset();
    router.push('/adminlogin');
  };
  return <aside className={`sticky top-0 h-screen flex flex-col border-r border-border bg-card text-foreground transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* 顶部 Logo 与折叠控制区 */}
      <div className="flex shrink-0 items-center justify-between h-[60px] px-4 border-b border-border">
        {!isCollapsed && <div className="font-display font-semibold text-lg tracking-wide whitespace-nowrap overflow-hidden text-ellipsis mr-2 text-primary">
            Admin Panel
          </div>}
        <button onClick={toggleSidebar} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0" aria-label="Toggle Sidebar">
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 滚动导航区域 */}
      <nav className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
        {visibleNavItems.map((item, index) => {
        // 匹配当前激活路径 (忽略尾随斜杠以及匹配子路径)
        const isActive = pathname.startsWith(item.href);
        return <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-150 hover:translate-x-1 ${isActive ? 'bg-primary text-primary-foreground shadow-xs font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} title={isCollapsed ? item.label : undefined}>
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis font-body">
                  {item.label}
                </span>}
            </Link>;
      })}
      </nav>

      {/* 底部退出登录操作区 (仅 ADMIN 显示) */}
      {!isGuest && <div className="shrink-0 p-3 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-md transition-all duration-150 hover:translate-x-1 text-muted-foreground hover:bg-muted hover:text-destructive" title={isCollapsed ? "Logout" : undefined}>
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis font-body font-medium">
                Logout
              </span>}
          </button>
        </div>}
    </aside>;
}
