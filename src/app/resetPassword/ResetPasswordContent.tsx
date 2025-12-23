'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckCircle, ArrowRight, ChevronLeft, KeyRound } from 'lucide-react';
import { showToast } from '@/utils/alerts';
import { motion } from "framer-motion";

const ResetPasswordContent = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
    const [errors, setErrors] = useState({ email: '', otp: '', newPassword: '' });
    const [loading, setLoading] = useState(false);

    // Validation Functions
    const validateEmail = (email: string) =>
        /\S+@\S+\.\S+/.test(email) ? '' : 'Please enter a valid email address';

    const validateOTP = (otp: string) =>
        otp.length === 6 ? '' : 'OTP must be 6 digits';

    const validatePassword = (password: string) =>
        password.length >= 6
            ? ''
            : 'Password must be at least 6 characters long';

    // Handle real-time change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Real-time validation
        let errorMsg = '';
        if (name === 'email') errorMsg = validateEmail(value);
        if (name === 'otp') errorMsg = validateOTP(value);
        if (name === 'newPassword') errorMsg = validatePassword(value);

        setErrors({ ...errors, [name]: errorMsg });
    };

    // Final validation + API submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(form.email);
        const otpError = validateOTP(form.otp);
        const passwordError = validatePassword(form.newPassword);

        if (emailError || otpError || passwordError) {
            setErrors({
                email: emailError,
                otp: otpError,
                newPassword: passwordError,
            });
            return;
        }

        setLoading(true);
        try {
            // Keeping original API endpoint and payload
            await axios.post('http://localhost:8080/api/user/reset-password', form);

            showToast('success', 'Password reset successful! Please login with your new password.');
            router.push('/login');
        } catch (err: any) {
            showToast('error', err.response?.data?.message || 'Password reset failed. Please check your OTP and try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-165 min-h-[600px]">

                {/* LEFT SIDE: Image Section */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-teal-900 relative items-center justify-center overflow-hidden">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/bgimage.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80'}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 opacity-60 z-0"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    {/* Content Overlay */}
                    <div className="relative z-10 p-12 text-white max-w-lg flex flex-col items-center text-center">
                        <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20">
                            <Lock className="w-16 h-16 text-teal-100" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4 font-serif tracking-wide">
                            Secure Your Account
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed font-light">
                            Create a strong, unique password to keep your legal matters verified and confidential.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-teal-600 transition-colors font-medium text-sm group"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="max-w-md w-full mx-auto">
                        <div className="text-center mb-10 lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 mb-3">Reset Password</h1>
                            <p className="text-slate-500">
                                Enter your details to create a new password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'
                                            } rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* OTP */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">OTP Code</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="otp"
                                        value={form.otp}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit OTP"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.otp ? 'border-red-500' : 'border-slate-200'
                                            } rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                                    />
                                </div>
                                {errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        placeholder="Create new password"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.newPassword ? 'border-red-500' : 'border-slate-200'
                                            } rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                                    />
                                </div>
                                {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Reset Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
         @keyframes blob {
           0% { transform: translate(0px, 0px) scale(1); }
           33% { transform: translate(30px, -50px) scale(1.1); }
           66% { transform: translate(-20px, 20px) scale(0.9); }
           100% { transform: translate(0px, 0px) scale(1); }
         }
         .animate-blob {
           animation: blob 7s infinite;
         }
         .animation-delay-2000 {
           animation-delay: 2s;
         }
      `}</style>
        </div>
    );
};

export default ResetPasswordContent;
