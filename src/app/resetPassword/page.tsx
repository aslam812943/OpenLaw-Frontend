'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Shield, Scale, CheckCircle } from 'lucide-react';
import { showToast } from '@/utils/alerts';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [errors, setErrors] = useState({ email: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  // ✅ Validation Functions
  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email) ? '' : 'Please enter a valid email address';

  const validateOTP = (otp: string) =>
    otp.length === 6 ? '' : 'OTP must be 6 digits';

  const validatePassword = (password: string) =>
    password.length >= 6
      ? ''
      : 'Password must be at least 6 characters long';

  // ✅ Handle real-time change
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

  // ✅ Final validation + API submit
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
      await axios.post('http://localhost:8080/api/user/reset-password', form);

      showToast('success', 'Password reset successful! Please login with your new password.');
      router.push('/login');
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Password reset failed. Please check your OTP and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 overflow-hidden relative">
      {/* Floating background icons */}
      <div className="absolute top-20 left-16 animate-float">
        <Shield className="w-12 h-12 text-emerald-200" />
      </div>
      <div className="absolute top-44 right-24 animate-float animation-delay-1000">
        <Scale className="w-14 h-14 text-green-300" />
      </div>
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-float animation-delay-2000">
        <CheckCircle className="w-10 h-10 text-green-200" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md transition-colors duration-300">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="w-full bg-white/80 shadow-xl backdrop-blur-lg rounded-3xl px-8 py-10 border border-green-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center w-16 h-16 mb-1 rotate-6">
              <Lock className="w-9 h-9 text-white" />
            </div>
          </div>

          <h2 className="text-2xl mb-4 font-bold text-center text-gray-900">Reset Password</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your registered email, OTP and a new password below.
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your registered email"
              required
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.email ? 'border-red-400' : 'border-gray-200'
              } focus:border-green-400 bg-white/80 outline-none transition-all duration-300`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* OTP */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.otp ? 'border-red-400' : 'border-gray-200'
              } focus:border-green-400 bg-white/80 outline-none transition-all duration-300`}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              required
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.newPassword ? 'border-red-400' : 'border-gray-200'
              } focus:border-green-400 bg-white/80 outline-none transition-all duration-300`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <Lock className="w-5 h-5" />
              </>
            )}
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
        </form>
      </div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-18px);}
        }
        .animate-float {
          animation: float 3.2s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
