'use client'

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { UserCheck, Shield, Mail, ArrowRight, ChevronLeft, KeyRound } from 'lucide-react';
import { showToast } from '@/utils/alerts';

const VerifyOtpContent = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);


    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timer]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setOtp(value);

        if (value.length === 0) {
            setError('OTP is required');
        } else if (value.length !== 6) {
            setError('OTP must be 6 digits');
        } else {
            setError('');
        }
    };

   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const email = localStorage.getItem('registerEmail') || '';
            await axios.post('http://localhost:8080/api/user/verify-otp', { email, otp });

            showToast('success', 'OTP Verified! You are now verified.');
            router.push('/login');
        } catch (err: any) {
            showToast('error', err.response?.data?.message || 'OTP verification failed.');
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const email = localStorage.getItem('registerEmail') || '';
            await axios.post('http://localhost:8080/api/user/resend-otp', { email });
            showToast('success', 'OTP resent! Please check your email.');
            setTimer(30);
            setCanResend(false);
        } catch (err: any) {
            showToast('error', err.response?.data?.message || 'Error resending OTP.');
        }
        setResendLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-165 min-h-[600px]">

                {/* LEFT SIDE: Image Section */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-teal-900 relative items-center justify-center overflow-hidden">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/otp1.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 opacity-60 z-0"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    {/* Content Overlay */}
                    <div className="relative z-10 p-12 text-white max-w-lg flex flex-col items-center text-center">
                        <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20">
                            <Shield className="w-16 h-16 text-teal-100" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4 font-serif tracking-wide">
                            Verify Identity
                        </h2>
                        <p className="text-teal-100 text-lg leading-relaxed font-light">
                            To ensure the security of your legal accounts, please verify your email address.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
                    <button
                        onClick={() => router.push('/login')}
                        className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-teal-600 transition-colors font-medium text-sm group"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="max-w-md w-full mx-auto">
                        <div className="text-center mb-10 lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 mb-3">OTP Verification</h1>
                            <p className="text-slate-500">
                                Enter the 6-digit code sent to your email.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Verification Code</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        autoFocus
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'
                                            } rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none text-lg font-mono tracking-widest transition-all`}
                                    />
                                </div>
                                {error && <p className="text-xs text-red-500">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Verify Email <UserCheck className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Resend Logic */}
                            <div className="flex flex-col items-center gap-4 mt-6">
                                <p className="text-sm text-slate-500">
                                    Didn't receive the code?
                                </p>
                                <button
                                    type="button"
                                    disabled={!canResend || resendLoading}
                                    onClick={handleResend}
                                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${canResend && !resendLoading
                                        ? 'text-teal-600 hover:bg-teal-50'
                                        : 'text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {resendLoading
                                        ? 'Sending...'
                                        : canResend
                                            ? 'Resend OTP'
                                            : `Resend available in 00:${timer.toString().padStart(2, '0')}`}
                                </button>
                            </div>

                        </form>

                        <div className="mt-8 text-center text-xs text-slate-400">
                            Check your spam folder if you don&apos;t see the email.
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

export default VerifyOtpContent;
