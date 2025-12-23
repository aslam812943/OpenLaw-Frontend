'use client'

import React, { useState } from 'react';
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
} from 'lucide-react';

import { useRouter } from "next/navigation";
import { showToast } from '@/utils/alerts';
import { logoutLawyer } from '../service/lawyerService';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${active
          ? 'bg-purple-600 text-white rounded-lg'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const route = useRouter()
  // ✅ Logout function
  const handleLogout = async () => {
    try {
      const response = await logoutLawyer();
      if (response) {
        showToast('success', 'Logout successful');

        route.push('/login');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/lawyer/dashboard' },
    { icon: <FolderOpen size={20} />, label: 'Schedule', path: '/lawyer/cases' },
    { icon: <Calendar size={20} />, label: 'Appointments', path: '/lawyer/appointments' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/lawyer/messages' },
    { icon: <FileText size={20} />, label: 'Documents', path: '/lawyer/documents' },
    { icon: <DollarSign size={20} />, label: 'Earnings', path: '/lawyer/earnings' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/lawyer/reports' },
  ];


  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-950 transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}
      >
        <div className="flex flex-col h-full py-6 justify-between">
          {/* Top Section */}
          <div>
            {/* App Title */}
            <div className="px-6 mb-6 text-white text-xl font-semibold tracking-wide">
              Lawyer Panel
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={activeItem === item.label}
                  onClick={() => { setActiveItem(item.label), route.push(item.path) }}
                />
              ))}
            </nav>
          </div>

          {/* ✅ Logout Section */}
          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
