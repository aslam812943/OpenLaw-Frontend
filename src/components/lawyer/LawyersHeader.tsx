'use client'

import React, { useState } from 'react';
import { Bell, Settings, LogOut, ChevronDown, User, HelpCircle, Shield, Search } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from "@/context/SocketContext";

interface HeaderProps {
  lawyerName?: string;
  profilePic?: string;
  role?: string;
}

const Header: React.FC<HeaderProps> = ({
  role = "Senior Attorney"
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter()
  const lawyer = useSelector((state: RootState) => state.lawyer);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }

    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { notifications, unreadCount, markAsRead } = useSocket();

  return (
    <header className="sticky top-0 right-0 bg-white/70 backdrop-blur-xl z-50 border-b border-slate-100/50 w-full">
      <div className="flex justify-between items-center px-6 py-3 h-20">

        {/* Logo / Brand */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-11 h-11 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/10 border border-slate-800"
          >
            <Shield className="w-6 h-6 text-teal-500" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Open<span className="text-teal-600">Law</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRO DASHBOARD</p>
          </div>
        </div>

        {/* Global Search (Added for style) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-10">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Quick search Cases, Clients..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500/20 transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">


          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAsRead();
              }}
              className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative group"
            >
              <Bell className="w-5 h-5 group-hover:text-teal-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white z-50">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-slate-900/5"
                >
                  <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Notifications</p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif: any) => (
                        <div
                          key={notif.id}
                          className="px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <p className={`text-sm leading-snug ${notif.isRead ? 'text-slate-500' : 'text-slate-900 font-semibold'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 font-medium">No new notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings icon */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button> */}

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200/50 mx-2" />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center space-x-3 pl-1 pr-3 py-1 rounded-xl transition-all ${showProfileMenu ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'
                }`}
            >
              <div className="relative">
                {lawyer.profileImage ? (
                  <img
                    src={lawyer.profileImage as string}
                    alt="Profile"
                    className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
                    {lawyer.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{lawyer.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden shadow-slate-200/50"
                >
                  <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">{lawyer.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{lawyer.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setShowProfileMenu(false); router.push("/lawyer/profile"); }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 group transition-colors"
                    >
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-teal-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-600 group-hover:text-slate-900">My Profile</span>
                    </button >
                    {/* <button
                      className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 group transition-colors"
                    >
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-teal-600">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-600 group-hover:text-slate-900">Account Settings</span>
                    </button>
                    <button
                      className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 group transition-colors"
                    >
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-teal-600">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-600 group-hover:text-slate-900">Help Center</span>
                    </button> */}
                  </div>
                  <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                    {/* <button
                      className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 group transition-colors"
                    >
                      <div className="p-1.5 bg-red-100/50 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all text-red-600">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-red-600">Sign Out</span>
                    </button> */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;