"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, User, FileText, MessageSquare, LogOut, ChevronDown, Menu, X, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/alerts";
import { logoutUser } from "@/service/userService";
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
              // { label: "Contact", href: "/contact" }
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
            {/* Consultation Button */}
            <Link
              href="/user/bookings"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Consultation
            </Link>

            {/* Notification Section */}
            {user?.name && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    markAsRead();
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
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-slate-900/5"
                    >
                      <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Notifications</p>
                        {notifications.length > 0 && (
                          <button
                            onClick={() => clearNotifications()}
                            className="text-[10px] font-bold text-teal-600 hover:text-teal-700"
                          >
                            Clear all
                          </button>
                        )}
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
            )}

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
              <Link
                href="/login"
                className="border border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Log in
              </Link>
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
