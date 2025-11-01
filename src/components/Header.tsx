"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, User, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
// import Cookies from "js-cookie";
// import { logoutUser } from "@/redux/slices/userSlice";

const UserHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  // const handleLogout = () => {
  //   Cookies.remove("token");
  //   dispatch(logoutUser());
  // };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Lawyers", href: "/find-lawyers" },
    { name: "Bookings", href: "/bookings" },
    { name: "Messages", href: "/messages" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-emerald-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all">
      {/* Gradient Top Accent */}
      {/* <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400"></div> */}

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-md text-white font-bold text-lg shadow-md transition-transform group-hover:scale-110">
            ⚖️
          </div>
          <span className="font-semibold text-xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            LegalConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-gray-700 hover:text-emerald-600 transition group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Bar (Desktop Only) */}
          <div className="hidden lg:flex items-center bg-white/80 border border-emerald-100 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 ml-2 placeholder-gray-400 w-32 focus:w-44 transition-all"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700 hover:text-emerald-600 transition-transform hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm">
              2
            </span>
          </div>

          {/* User Dropdown */}
          {user?.name ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/70 border border-emerald-100 rounded-full text-gray-700 hover:text-emerald-600 hover:border-emerald-300 transition shadow-sm"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden animate-slideDown z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    // onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-1.5 border border-emerald-500 text-emerald-600 rounded-full hover:bg-emerald-50 font-medium text-sm transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-medium text-sm hover:shadow-lg hover:scale-105 transition"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-6 space-y-3 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 font-medium hover:text-emerald-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.25s ease-out; }
      `}</style>
    </header>
  );
};

export default UserHeader;
