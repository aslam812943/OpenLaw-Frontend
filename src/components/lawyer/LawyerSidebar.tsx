'use client'

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from "next/navigation";
import { showToast } from '@/utils/alerts';
import { logoutLawyer } from '../../service/lawyerService';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active, onClick, collapsed }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group truncate ${active
        ? 'bg-teal-500/10 text-white shadow-[inset_0_0_0_1px_rgba(20,184,166,0.1)]'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
        }`}
    >
      {active && (
        <motion.div
          layoutId="activeSide"
          className="absolute left-0 top-2 bottom-2 w-1 bg-teal-500 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.5)]"
        />
      )}
      <span className={`flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="text-sm font-bold tracking-wide">{label}</span>
      )}
      {active && !collapsed && (
        <ChevronRight size={14} className="ml-auto opacity-50" />
      )}
    </motion.button>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await logoutLawyer();
      if (response) {
        showToast('success', 'Logout successful');
        router.push('/login');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/lawyer/dashboard' },
    { icon: <FolderOpen size={20} />, label: 'Cases', path: '/lawyer/cases' },
    { icon: <Calendar size={20} />, label: 'Appointments', path: '/lawyer/appointments' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/lawyer/chat' },
    { icon: <Star size={20} />, label: 'Reviews', path: '/lawyer/reviews' },
    { icon: <Zap size={20} />, label: 'Subscriptions', path: '/lawyer/subscriptions' },

    { icon: <DollarSign size={20} />, label: 'Earnings', path: '/lawyer/earnings' },

  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-5 left-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 hover:bg-slate-800 transition-all active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-[80px] left-0 h-[calc(100vh-80px)] bg-slate-950 transition-all duration-500 z-40 border-r border-slate-900/50 shadow-2xl
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} 
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full py-4 justify-between">
          {/* Top Section */}
          <div className="flex-1 px-4 overflow-y-auto no-scrollbar">

            {/* Menu Items */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={pathname.startsWith(item.path)}
                  collapsed={isCollapsed}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.path);
                  }}
                />
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="px-4 mt-auto space-y-4">

            {/* Collapse Toggle (Desktop Only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500 hover:text-teal-400 hover:border-teal-400/30 transition-all"
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
                <ChevronRight size={18} />
              </motion.div>
            </button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-red-500/20 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white group truncate font-bold text-sm ${isCollapsed ? 'justify-center' : ''
                }`}
            >
              <LogOut size={18} className="flex-shrink-0 transition-transform group-hover:-translate-x-1" />
              {!isCollapsed && <span>Sign Out</span>}
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
