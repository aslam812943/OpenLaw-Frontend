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
} from 'lucide-react';

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
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
        active
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

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <FolderOpen size={20} />, label: 'My Cases' },
    { icon: <Calendar size={20} />, label: 'Appointments' },
    { icon: <MessageSquare size={20} />, label: 'Messages' },
    { icon: <FileText size={20} />, label: 'Documents' },
    { icon: <DollarSign size={20} />, label: 'Earnings' },
    { icon: <BarChart3 size={20} />, label: 'Reports' },
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
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full py-6">
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
                onClick={() => setActiveItem(item.label)}
              />
            ))}
          </nav>
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
