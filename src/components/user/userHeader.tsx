"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, User, FileText, MessageSquare, LogOut, ChevronDown, Menu, X, Bell, Calendar, AlertTriangle, CheckCircle, CheckCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/alerts";
import { logoutUser, Notification as UserNotification } from "@/service/userService";
import { clearUserData } from "@/redux/userSlice";
import { clearLawyerData } from "@/redux/lawyerSlice";
import { useSocket } from "@/context/SocketContext";

const UserHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const { notifications, unreadCount, clearNotifications, markAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('unread');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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

  const handleLogout = async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        dispatch(clearUserData());
        dispatch(clearLawyerData());
        localStorage.removeItem("userData");
        showToast("success", result.message);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/login");
      } else {
        showToast("error", result.message);
      }
    } catch (error) {

      showToast("error", "Logout failed. Please try again later.");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-teal-600 p-1.5 rounded-xl group-hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
              Open<span className="text-teal-600">Law</span>
            </span>
          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {[
              { label: "Find Lawyers", href: "/user/lawyers" },
              { label: "About", href: "/about" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-all hover:-translate-y-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user?.id && (
              <Link
                href="/user/bookings"
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                Consultation
              </Link>
            )}

            {/* Notification Section */}
            {user?.name && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                  }}
                  className="p-2.5 text-slate-600 hover:bg-slate-50 hover:text-teal-600 rounded-xl transition-all relative group"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

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
                            {filteredNotifications.map((notif: UserNotification) => (
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
                        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[11px] font-bold">
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
            )
            }

            {/* Auth Section */}
            {user?.name ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-xs font-black text-slate-900">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Client</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 origin-top-right z-50 ring-1 ring-slate-900/5"
                    >
                      <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email || user.name}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        {[
                          { label: "Profile", href: "/user/profile", icon: User },
                          { label: "My Bookings", href: "/user/bookings", icon: FileText },
                          { label: "Messages", href: "/user/chat", icon: MessageSquare }
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all group"
                          >
                            <item.icon className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="h-px bg-slate-100 my-1 mx-2"></div>

                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="border border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  Register
                </Link>
              </>
            )}


          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-100 py-6"
            >
              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-6 px-2">
                {[
                  { label: "Find Lawyers", href: "/user/lawyers" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" }
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-bold text-slate-900 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              {user?.name ? (
                <div className="space-y-2 pt-6 border-t border-slate-100 px-2">
                  <div className="px-5 py-4 bg-slate-50 rounded-2xl mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email || user.name}</p>
                  </div>

                  {[
                    { label: "Profile", href: "/user/profile", icon: User },
                    { label: "My Bookings", href: "/user/bookings", icon: FileText },
                    { label: "Messages", href: "/user/chat", icon: MessageSquare }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 text-base font-bold text-slate-900 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all"
                    >
                      <item.icon className="w-5 h-5 text-slate-400" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="pt-4 px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 text-base font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-500/20 shadow-red-500/20"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-slate-100 px-2">
                  <Link
                    href="/consultation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-slate-900 text-white px-4 py-4 rounded-2xl text-base font-bold hover:bg-slate-800 transition-all text-center shadow-xl shadow-slate-900/10"
                  >
                    Consultation
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full border border-slate-200 text-slate-900 px-4 py-4 rounded-2xl text-base font-bold hover:bg-slate-50 transition-all text-center"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UserHeader;
