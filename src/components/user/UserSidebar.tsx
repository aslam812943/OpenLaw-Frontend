'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Calendar, Menu, X, LogOut, MessageSquare, LayoutDashboard, Scale } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUserData } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/service/userService';
import { motion, AnimatePresence } from 'framer-motion';

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // const handleLogout = async () => {
    //     try {
    //         await logoutUser();
    //         dispatch(clearUserData());
    //         router.push('/login');
    //     } catch (error) {
    //         console.error("Logout failed", error);
    //     }
    // };

    const menuItems = [
        { icon: <User size={22} />, label: 'Profile', path: '/user/profile' },
        { icon: <Calendar size={22} />, label: 'bookings', path: '/user/bookings' },
        { icon: <MessageSquare size={22} />, label: 'Messages', path: '/user/chat' },
        { icon: <MessageSquare size={22} />, label: 'Wallet', path: '/user/wallet' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-[90px] left-4 z-50 p-3 bg-teal-600 text-white rounded-xl shadow-xl hover:bg-teal-700 active:scale-95 transition-all border border-teal-500/20"
                onClick={toggleSidebar}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative left-0 z-40 h-full w-72 bg-white border-r border-slate-100 transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } shadow-[20px_0_70px_-50px_rgba(0,0,0,0.1)]`}
            >
                <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm">
                    {/* Branding Area */}


                    {/* Navigation Section */}
                    <div className="px-6 mb-4 mt-5">

                        <nav className="space-y-1.5">
                            {menuItems.map((item, idx) => {
                                const isActive = pathname.startsWith(item.path);
                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={item.path}
                                            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 group ${isActive
                                                ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/20'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'} transition-colors`}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Visual Card / Decoration */}
                    {/* <div className="mt-auto px-6 mb-6">
                        <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
                            <p className="text-white font-bold text-sm relative z-10 leading-relaxed">
                                Need expert<br />legal advice?
                            </p>
                            <button className="mt-4 bg-teal-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-teal-400 transition-colors relative z-10 active:scale-95 shadow-lg shadow-teal-500/20">
                                Get help now
                            </button>
                        </div>
                    </div> */}


                </div>
            </aside>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default UserSidebar;
