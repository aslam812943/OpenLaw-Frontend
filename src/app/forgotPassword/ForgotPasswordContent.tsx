'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Mail, ChevronLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { showToast } from '@/utils/alerts';
import { motion } from "framer-motion";

const ForgotPasswordContent = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Email validation function
    const validateEmail = (email: string) =>
        /\S+@\S+\.\S+/.test(email) ? '' : 'Please enter a valid email address';

    // Handle change with live validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setError(validateEmail(value));
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/user/forget-password', { email });

            showToast('success', 'Password reset OTP sent! Please check your email.');
            router.push('/resetPassword');
        } catch (err: any) {
            showToast('error', err.response?.data?.message || 'Failed to send password reset email.');
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
                            src="/forgotpassword.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        // onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80'}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 opacity-60 z-0"></div>

                    {/* Decorative Elements (Blobs) */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    {/* Content Overlay */}
                    <div className="relative z-10 p-12 text-white max-w-lg flex flex-col items-center text-center">
                        <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20">
                            <img
                                src="/"
                                alt="Security"
                                className="w-40 h-auto object-contain"
                                onError={(e) => {
                                   
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                         
                            <Mail className="w-24 h-24 text-teal-200 hidden" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4 font-serif tracking-wide">
                            Forgot your password?
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed font-light">
                            No worries! It happens. Please enter the email address associated with your account and we’ll send you an OTP to reset your password.
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
                            <h1 className="text-3xl font-bold text-slate-900 mb-3">Forgot Password</h1>
                            <p className="text-slate-500">
                                Enter the email address you used to register with OpenLaw.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="Please enter your email id"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'
                                            } rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                                    />
                                </div>
                                {error && <p className="text-xs text-red-500">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send me Instructions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs text-slate-400">
                            <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms & Conditions</span>
                            <span className="mx-2">•</span>
                            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy policy</span>
                        </div>
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

export default ForgotPasswordContent;
