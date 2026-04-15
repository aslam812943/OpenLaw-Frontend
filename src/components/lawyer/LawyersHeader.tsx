'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, ChevronDown, User, Shield, X, Calendar, AlertTriangle, CheckCircle, CheckCheck } from 'lucide-react';
import { useSelector } from "react-redux";
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
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('unread');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const lawyer = useSelector((state: RootState) => state.lawyer);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { notifications, unreadCount, markAsRead, clearNotifications } = useSocket();

  const filteredNotifications = notifications.filter(n =>
    notifFilter === 'all' ? true : !n.isRead
  );

  const getNotifIcon = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('booking') || lower.includes('appointment')) return <Calendar className="w-4 h-4 text-teal-500" />;
    if (lower.includes('penalty') || lower.includes('deducted') || lower.includes('cancel')) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <CheckCircle className="w-4 h-4 text-blue-500" />;
  };

  const getNotifBg = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('booking') || lower.includes('appointment')) return 'bg-teal-50';
    if (lower.includes('penalty') || lower.includes('deducted') || lower.includes('cancel')) return 'bg-amber-50';
    return 'bg-blue-50';
  };

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

        {/* Right Side */}
        <div className="flex items-center space-x-3">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
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
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-slate-900/5"
                >
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white flex justify-between items-start">
                    <div className="flex gap-3.5">
                      <div className="p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/20">
                        <Bell className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Notification</h3>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">{unreadCount} unread notifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tabs & Actions */}
                  <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-50">
                    <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl">
                      <button
                        onClick={() => setNotifFilter('unread')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${notifFilter === 'unread' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Unread
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${notifFilter === 'unread' ? 'bg-teal-50 text-teal-600' : 'bg-slate-200 text-slate-600'}`}>
                          {unreadCount}
                        </span>
                      </button>
                      <button
                        onClick={() => setNotifFilter('all')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${notifFilter === 'all' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        All
                      </button>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAsRead()}
                        className="p-2 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-all flex items-center"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                    {filteredNotifications.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        {filteredNotifications.map((notif) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative flex items-start gap-4 px-6 py-5 hover:bg-slate-50/80 transition-all cursor-default group"
                          >
                            <div className={`p-2.5 rounded-2xl mt-0.5 ${getNotifBg(notif.message)}`}>
                              {getNotifIcon(notif.message)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-800 font-bold'}`}>
                                  {notif.message}
                                </p>
                                {!notif.isRead && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2 ring-4 ring-teal-500/10" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                                {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center px-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 ring-1 ring-slate-100 shadow-inner">
                          <Bell className="w-8 h-8 text-slate-200" />
                        </div>
                        <h4 className="text-base font-black text-slate-900 mb-2">All caught up!</h4>
                        <p className="text-sm text-slate-400 font-medium">No new notifications in this category.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">OpenLaw Notification Center</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => clearNotifications()}
                          className="text-rose-500 hover:text-rose-600 uppercase tracking-widest"
                        >
                          Clear History
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-50 bg-slate-50/30">
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