'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Calendar, Menu, X, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUserData } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/service/userService';

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUserData());
            router.push('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        { icon: <User size={20} />, label: 'Profile', path: '/user/profile' },
        { icon: <Calendar size={20} />, label: 'Appointments', path: '/user/appointments' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={toggleSidebar}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center px-8 border-b border-slate-100">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                            User Dashboard
                        </h1>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto py-6">
                        <ul className="space-y-2 px-4">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            href={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                                ? 'bg-teal-50 text-teal-700 shadow-sm'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default UserSidebar;
