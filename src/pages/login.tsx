import { useState,useEffect } from 'react';
import { Scale, Mail, Lock, ArrowRight, Shield, Users, Gavel, FileText, Award, BookOpen } from 'lucide-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import {showToast} from '../utils/alerts'
const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};


const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const fullText = 'LegalConnect';


  const [displayed,setDisplayed] = useState(fullText)

const typingSpeed = 150;         // time between each letter
  const holdAfterTyping = 1500;    // time to hold full text before clearing
  const holdBeforeRestart = 3000;  // ⏳ extra delay before typing again

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutIds: NodeJS.Timeout[] = [];

    const startAnimation = () => {
      setDisplayed(""); // reset before typing
      let index = -1;

      intervalId = setInterval(() => {
        setDisplayed((prev) => prev + fullText.charAt(index));
        index++;

        if (index === fullText.length) {
          clearInterval(intervalId);

          // Hold full text before restarting
          const afterTypingTimeout = setTimeout(() => {
            setDisplayed(fullText);

            // Add extra delay before restarting the animation
            const beforeRestartTimeout = setTimeout(() => {
              startAnimation();
            }, holdBeforeRestart);

            timeoutIds.push(beforeRestartTimeout);
          }, holdAfterTyping);

          timeoutIds.push(afterTypingTimeout);
        }
      }, typingSpeed);
    };

    // Start animation initially after showing full text briefly
    const initialTimeout = setTimeout(startAnimation, holdBeforeRestart);
    timeoutIds.push(initialTimeout);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      timeoutIds.forEach(clearTimeout);
    };
  }, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Live validation
    let error = "";
    if (name === "email") {
      if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }
    }
    if (name === "password") {
      if (!validatePassword(value)) {
        error = "Password must be at least 6 characters";
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation before submit
    const emailError = !validateEmail(form.email) ? "Please enter a valid email address" : "";
    const passwordError = !validatePassword(form.password) ? "Password must be at least 6 characters" : "";
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      let response = await axios.post('http://localhost:8080/api/user/login', form, { withCredentials: true });
     showToast('success', 'Login successful.');
      const { user } = response.data;
      dispatch(setUserData({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }))
      if (user.role === 'lawyer') {
        if(user.hasSubmittedVerification){
   router.push('/lawyer/dashbord');
        }else{
 router.push('/lawyer/verification');
        }
       
      } else {
        router.push('/home');
      }
    } catch (err:any) {
      console.log(err);
    
      showToast('error',err.message)
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 animate-float">
        <Shield className="w-8 h-8 text-green-200" />
      </div>
      <div className="absolute top-40 right-32 animate-float animation-delay-1000">
        <Gavel className="w-10 h-10 text-green-200" />
      </div>
      <div className="absolute bottom-32 left-40 animate-float animation-delay-2000">
        <Users className="w-9 h-9 text-green-200" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start space-y-8 flex-1 animate-slide-in-left">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-green-800">{displayed}</h1>
                <p className="text-green-600 text-lg">Your Trusted Legal Partner</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Secure & Confidential</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Connect with Experts</h3>
                <p className="text-gray-600">Access verified lawyers across all specializations</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <Gavel className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Professional Service</h3>
                <p className="text-gray-600">Quality legal assistance at your fingertips</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md w-full animate-slide-in-right">
          {/* Animated Circle with Icons Around Login Box */}
          <div className="relative">
            {/* Rotating Circle */}
            <div className="absolute inset-0 animate-rotate-slow pointer-events-none">
              {/* Icon 1 - Shield (Top) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Icon 2 - Scale (Top Right) */}
              <div className="absolute top-8 right-0 translate-x-8 -translate-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow animation-delay-500">
                  <Scale className="w-7 h-7 text-white" />
                </div>
              </div>
              {/* Icon 3 - Gavel (Right) */}
              <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-1000">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Icon 4 - FileText (Bottom Right) */}
              <div className="absolute bottom-8 right-0 translate-x-8 translate-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow animation-delay-1500">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              {/* Icon 5 - Award (Bottom) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-2000">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Icon 6 - BookOpen (Bottom Left) */}
              <div className="absolute bottom-8 left-0 -translate-x-8 translate-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow animation-delay-2500">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              {/* Icon 7 - Users (Left) */}
              <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow animation-delay-3000">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Icon 8 - Shield Check (Top Left) */}
              <div className="absolute top-8 left-0 -translate-x-8 -translate-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow animation-delay-3500">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            {/* Animated Circle Border */}
            <div className="absolute inset-0 -m-16 pointer-events-none">
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-green-100 hover:shadow-green-100/50 transition-all duration-500 relative z-10">
              {/* Logo for Mobile */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6">
                  <Scale className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to continue to your account</p>
              </div>
              <form onSubmit={handleSubmit} noValidate className=" space-y-6">
                {/* Email Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedInput === 'email' ? 'text-green-600' : 'text-gray-400'
                      }`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 bg-white/50 hover:bg-white"
                    />
                  </div>
                  {/* Live validation error */}
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2">{errors.email}</p>
                  )}
                </div>
                {/* Password Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedInput === 'password' ? 'text-green-600' : 'text-gray-400'
                      }`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 bg-white/50 hover:bg-white"
                    />
                  </div>
                  {/* Live validation error */}
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-2">{errors.password}</p>
                  )}
                </div>
                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-all duration-300"
                    onClick={() => router.push('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">New to LegalConnect?</span>
                  </div>
                </div>
                {/* Sign Up Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 hover:underline"
                    onClick={() => router.push('/register')}
                  >
                    Create an account
                  </button>
                </div>
              </form>
            </div>
            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Protected by enterprise-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.09);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-left 0.9s ease-out;
        }
        .animate-rotate-slow {
          animation: rotate-slow 30s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-2500 {
          animation-delay: 2.5s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;



