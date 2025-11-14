'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logoutAdmin } from '@/service/authService';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';



import { showToast } from '@/utils/alerts';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  title?: string;
  items?: SidebarItem[];
  className?: string;
  collapsed: boolean;
  onToggle: () => void;
}

const defaultItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'user-management', label: 'User Management', href: '/admin/users', icon: <Users size={20} /> },
  { id: 'lawyer-management', label: 'Lawyer Management', href: '/admin/lawyers', icon: <Briefcase size={20} /> },
  { id: 'appointments', label: 'Appointments Management', href: '/admin/appointments', icon: <Calendar size={20} /> },
  { id: 'payments', label: 'Payments & Transactions', href: '/admin/payments', icon: <DollarSign size={20} /> },
  { id: 'reports', label: 'Reports & Complaints', href: '/admin/reports', icon: <FileText size={20} /> },
  { id: 'notifications', label: 'Notifications & Messaging', href: '/admin/notifications', icon: <Bell size={20} /> },
  { id: 'settings', label: 'Settings & Security', href: '/admin/settings', icon: <Settings size={20} /> },
];

export default function AdminSidebar({
  title = 'Admin Dashboard',
  items = defaultItems,
  className = '',
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const router = useRouter();
  const pathname = usePathname();
  

  // ✅ Automatically detect current active route
  useEffect(() => {
    const currentItem = items.find(item => pathname.startsWith(item.href));
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname, items]);

  const handleItemClick = (id: string, href: string) => {
    setActiveItem(id);
    router.push(href);
  };

 const handleLogout = async () => {
  try {
    const result = await logoutAdmin();

    if (result.success) {
  
      showToast("success", result.message);
  router.push('/admin/login')
    } else {
      showToast("error", result.message);
    }
  } catch (error) {
    console.error("Logout error:", error);
    showToast("error", "Logout failed. Please try again later.");
  }
};

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[#0a0a0a] text-white h-screen flex flex-col border-r border-gray-800 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        {!collapsed && <h1 className="text-lg font-semibold">{title}</h1>}
        <button
          onClick={onToggle}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id, item.href)}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center' : 'gap-3'
                  } px-3 py-2.5 rounded-lg transition-colors duration-200 text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400'
                    } transition-colors`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ✅ Logout Section */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center' : 'gap-3'
          } px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
