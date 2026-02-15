'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, Home, Search, Gavel, Scale, FileText, CheckCircle } from 'lucide-react';


export default function NotFound() {
    const router = useRouter();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">


            <div className="flex-1 relative flex items-center justify-center py-12 px-6 overflow-hidden">
                {/* Background Image with Light Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/404.png"
                        alt="Background Illustration"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-white/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-[#fafafa]"></div>
                </div>

                {/* Content Container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-4xl w-full text-center"
                >
                    {/* Hero Badge */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-8">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100">
                            <CheckCircle className="h-5 w-5 text-teal-600 fill-teal-600 text-white" />
                            <span className="text-sm font-bold text-teal-700">OpenLaw Verified Portal</span>
                        </div>
                    </motion.div>

                    {/* Main Error Text */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-[12rem] sm:text-[15rem] font-bold text-slate-900/10 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] select-none z-[-1]"
                    >
                        404
                    </motion.h1>

                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Justice Delayed, <br />
                            <span className="text-teal-800">Page Not Found.</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-white-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                            The legal resource you're searching for seems to have been dismissed. Let's get you back to the right path.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <button
                            onClick={() => router.back()}
                            className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-200 text-slate-800 font-bold rounded-xl hover:border-teal-600 hover:text-teal-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5 active:scale-95"
                        >
                            <ArrowLeft size={20} />
                            Return Back
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full sm:w-auto px-10 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-600/20 active:scale-95"
                        >
                            <Home size={20} />
                            Back to Home
                        </button>
                    </motion.div>

                </motion.div>

                {/* Aesthetic Background Detail */}
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-200/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none"></div>
            </div>


        </div>
    );
}