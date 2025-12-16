'use client'


import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, User, Search, Scale } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";
import { logoutUser } from "@/service/userService";
import { clearUserData } from "@/redux/userSlice";

const UserHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
      } else {
        showToast("error", result.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("error", "Logout failed. Please try again later.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Lawyers", href: "/user/lawyers" },
    { name: "Bookings", href: "/bookings" },
    { name: "Messages", href: "/messages" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 via-white/90 to-green-50/90 border-b border-green-200 shadow-[0_4px_20px_rgba(16,185,129,0.08)] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl text-white font-bold shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              LegalConnect
            </span>
            <span className="text-[10px] font-medium text-green-600 -mt-1">Legal Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors group"
            >
              {link.name}
              <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center bg-white/60 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:border-green-300 transition-all group">
            <Search className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors" />
            <input
              type="text"
              placeholder="Search lawyers..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 ml-2 placeholder-gray-500 w-32 focus:w-44 transition-all focus:placeholder-gray-400"
            />
          </div>

          <div className="relative cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all"></div>
            <div className="relative p-2.5 rounded-lg hover:bg-green-100/50 transition-colors">
              <Bell className="w-5 h-5 text-gray-700 group-hover:text-green-600 transition-colors" />
              <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                2
              </span>
            </div>
          </div>

          {/* User Section */}
          {user?.name ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-green-200 rounded-full text-gray-700 hover:text-green-600 hover:border-green-400 hover:bg-white/80 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-sm border border-green-200 rounded-2xl shadow-xl overflow-hidden animate-slideDown z-50">
                  <div className="px-4 py-3 border-b border-green-100">
                    <p className="text-xs text-gray-600">Logged in as</p>
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                  </div>
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-green-100"
                  >
                    <X className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                href="/login"
                className="px-5 py-2 border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 font-semibold text-sm transition-all hover:border-green-600"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-green-100 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-sm border-t border-green-200 py-4 px-6 space-y-2 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-2 text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

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
