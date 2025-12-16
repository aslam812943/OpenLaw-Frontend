'use client'

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Scale, Shield, Mail, UserCheck } from 'lucide-react';
import { showToast } from '@/utils/alerts';

const OtpVerifyPage = () => {
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

  // ✅ Real-time validation for OTP
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

  // ✅ Submit handler
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
    } catch (err:any) {
      showToast('error',err.response?.data?.message||'OTP verification failed.');
    }
    setLoading(false);
  };

  // ✅ Resend OTP handler
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-200 p-4 overflow-hidden relative">
      {/* Animated background icons for consistency */}
      <div className="absolute top-20 left-14 animate-float">
        <Scale className="w-20 h-14 text-emerald-200" />
      </div>
      <div className="absolute top-36 right-28 animate-float animation-delay-2000">
        <Mail className="w-12 h-12 text-green-300" />
      </div>
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 animate-float animation-delay-1500">
        <Shield className="w-10 h-10 text-green-300 text-emerald-200" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="w-full bg-white/80 shadow-xl backdrop-blur-lg border border-green-100 rounded-3xl px-8 py-10 relative"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center w-16 h-16 mb-1 rotate-6">
              <UserCheck className="w-9 h-9 text-white" />
            </div>
          </div>

          <h2 className="font-bold text-2xl text-center text-gray-900 mb-2">
            OTP Verification
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter the verification code sent to your email
          </p>

          {/* ✅ OTP input field with live validation */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              One Time Password (OTP)
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                error ? 'border-red-400' : 'border-gray-200'
              } focus:border-emerald-400 text-lg font-mono tracking-widest bg-white/80 outline-none transition-all duration-300`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* ✅ Verify button */}
          <button
            type="submit"
            disabled={loading || !!error || otp.length < 6}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                Verify OTP <UserCheck className="w-5 h-5" />
              </>
            )}
          </button>

          {/* ✅ Resend OTP logic */}
          <div className="mt-6 flex flex-col items-center text-center">
            <button
              type="button"
              disabled={!canResend || resendLoading}
              onClick={handleResend}
              className={`text-sm font-semibold underline px-3 py-2 rounded ${
                canResend && !resendLoading
                  ? 'text-green-600 hover:text-emerald-700 hover:bg-green-50 transition'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {resendLoading
                ? 'Resending OTP...'
                : canResend
                ? 'Resend OTP'
                : `Resend available in ${timer}s`}
            </button>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-all duration-300"
                onClick={() => router.push('/login')}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4 text-sm text-green-700">
          <span>Didn&apos;t receive the code? </span>
          <span className="font-semibold">
            Check your spam/promotions folder
          </span>
        </div>
      </div>

      {/* ✅ Float Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-18px);}
        }
        .animate-float {
          animation: float 3.2s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default OtpVerifyPage;
