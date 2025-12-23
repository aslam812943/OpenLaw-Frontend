'use client';

import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthWrapperProps {
    initialView?: 'login' | 'register';
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ initialView = 'login' }) => {
    const router = useRouter();
    const [view, setView] = useState<'login' | 'register'>(initialView);


    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 font-sans text-slate-900">
            {/* Main Card Container */}
            <div
                className="w-full max-w-[1100px] h-165 min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative"
                style={{ backgroundImage: "url('/homemiddle.png')" }}
            >

                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white z-10 order-2 lg:order-1">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {view === 'login' ? 'Welcome Back' : 'Create an Account'}
                        </h1>
                        <p className="text-slate-500">
                            {view === 'login'
                                ? 'Enter your details to access your account'
                                : 'Join us today and get started with OpenLaw'}
                        </p>
                    </div>

                    <AnimatePresence mode='wait'>
                        {view === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RegisterForm />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle View Footer */}
                    <div className="mt-8 text-center bg-slate-50 p-4 rounded-2xl">
                        <p className="text-slate-600 font-medium">
                            {view === 'login' ? "Don't have an account yet?" : "Already have an account?"}
                            <button
                                onClick={() => router.push(view === 'login' ? '/sign-up' : '/login')}
                                className="ml-2 text-teal-600 hover:text-teal-700 font-bold hover:underline transition-all"
                            >
                                {view === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Visual/Info Section */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-teal-900 relative items-center justify-center overflow-hidden order-1 lg:order-2">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/bgimage.png"
                            alt="Lawyer Background"
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80'}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 opacity-60 z-0"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    {/* Content */}
                    <div className="relative z-10 p-12 text-white max-w-lg">
                        <div className="mb-8 p-4 bg-teal-800/50 backdrop-blur-sm rounded-2xl w-fit border border-teal-700/50 shadow-xl">
                            <Gavel className="w-10 h-10 text-teal-200" />
                        </div>

                        <h2 className="text-4xl font-bold mb-6 leading-tight font-serif tracking-wide">
                            {view === 'login' ? 'Welcome to OpenLaw' : 'Join the Legal Revolution'}
                        </h2>

                        <p className="text-teal-100 text-lg leading-relaxed mb-8 font-light">
                            {view === 'login'
                                ? 'Connect with top-tier legal experts and manage your consultations seamlessly. Your legal journey continues here.'
                                : 'Create your account to access a network of verified lawyers, schedule consultations, and get the legal justice you deserve.'}
                        </p>

                        {/* Mini Stats or Trust Badges */}
                        <div className="flex gap-6 pt-8 border-t border-teal-700/50">
                            <div>
                                <p className="text-3xl font-bold text-teal-300">15k+</p>
                                <p className="text-xs text-teal-200/70 uppercase tracking-wider mt-1">Clients Served</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-teal-300">98%</p>
                                <p className="text-xs text-teal-200/70 uppercase tracking-wider mt-1">Success Rate</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-teal-300">4.9</p>
                                <p className="text-xs text-teal-200/70 uppercase tracking-wider mt-1">Avg Rating</p>
                            </div>
                        </div>

                        {/* Floating Card Animation */}
                        {/* <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-16 top-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-2xl max-w-[200px]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Verified</p>
                                    <p className="text-xs text-teal-100">Professionals</p>
                                </div>
                            </div>
                        </motion.div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthWrapper;
