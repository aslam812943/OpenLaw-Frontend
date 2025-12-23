"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, User, FileText, MessageSquare, LogOut, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";
import { logoutUser } from "@/service/userService";
import { clearUserData } from "@/redux/userSlice";

const UserHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        dispatch(clearUserData());
        localStorage.removeItem("userData");
        showToast("success", result.message);
        setDropdownOpen(false);
        router.push("/login");
      } else {
        showToast("error", result.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("error", "Logout failed. Please try again later.");
    }
  };

  return (
    <div className="bg-[#fafafa] border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-teal-700" strokeWidth={2.5} />
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Open Law
            </span>
          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/user/lawyers"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Find Lawyers
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Consultation Button - Always Visible */}
            <Link href="/consultation" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all">
              Consultation
            </Link>

            {/* Auth Section */}
            {user?.name ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 border border-slate-200 rounded-full hover:bg-white hover:shadow-sm transition-all bg-white/50"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold border border-teal-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-700 leading-none mb-0.5">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-none">Client</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email || user.name}</p>
                    </div>

                    <div className="p-1">
                      <Link
                        href="/user/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </Link>
                      <Link
                        href="/messages"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        Messages
                      </Link>
                    </div>

                    <div className="h-px bg-slate-100 my-1"></div>

                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Log in
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserHeader;
