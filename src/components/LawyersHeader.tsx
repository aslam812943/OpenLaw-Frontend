'use client'

import React, { useState } from 'react';
import { Bell, Settings, LogOut, ChevronDown, User, HelpCircle, Shield } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

interface HeaderProps {
  lawyerName: string;
  profilePic?: string;
  role?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  lawyerName = "Sarah Johnson", 
  profilePic,
  role = "Senior Attorney"
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
const router = useRouter()
 const lawyer = useSelector((state: RootState) => state.lawyer);
  const notifications = [
    { id: 1, text: "New case assigned: Johnson v. Smith", time: "5 min ago", unread: true },
    { id: 2, text: "Court hearing scheduled for tomorrow", time: "1 hour ago", unread: true },
    { id: 3, text: "Document uploaded by client", time: "2 hours ago", unread: true },
    { id: 4, text: "Payment received for Case #2847", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3 h-16">
        {/* Logo / Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              LegalConnect
            </h1>
            <p className="text-xs text-gray-500">Professional Dashboard</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Help Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notification Dropdown */}
          <div className="relative">
            <button 
             onClick={() => setShowProfileMenu(prev => !prev)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notif.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-center">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
onClick={() => setShowProfileMenu(prev => !prev)}


              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {lawyerName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{lawyer.name}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">{lawyerName}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
                <div className="py-2">
                  <button   onClick={() => router.push("/lawyer/profile")}
  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                    <User className="w-4 h-4" />
                    <span>  My Profile</span>
                  </button >
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  {/* <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;