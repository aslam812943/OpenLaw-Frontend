'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { setUserData } from '../../redux/userSlice';
import { setLawyerData } from '../../redux/lawyerSlice';
import { useDispatch } from 'react-redux';
import { userLogin, userGoogleAuth, CommonResponse, LoginResponse, User } from '@/service/userService';
import { API_ROUTES } from '@/constants/routes';
import { showToast } from '@/utils/alerts';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import RoleSelectionModal from '../RoleSelectionModal';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// Validation Helpers
const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;

const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [googleToken, setGoogleToken] = useState<string | null>(null);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));

        let error = "";
        if (name === "email" && !validateEmail(value)) error = "Please enter a valid email address";
        if (name === "password" && !validatePassword(value)) error = "Password must be at least 6 characters";
        setLoginErrors(prev => ({ ...prev, [name]: error }));
    };

    const processLoginSuccess = (data: CommonResponse<LoginResponse>) => {
        showToast("success", data.message || "Login successful");
        const user = data.data?.user;

        if (user.role === "lawyer") {
            dispatch(setLawyerData({
                id: user._id || (user as any).id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                hasSubmittedVerification: user.hasSubmittedVerification || false
            }));

            if (user.verificationStatus === "Rejected") {
                showToast("error", "Admin rejected your verification. Please submit valid information again.");
                router.replace("/lawyer/verification");
                return;
            }

            if (!user.hasSubmittedVerification) {
                router.replace("/lawyer/verification");
                return;
            }

            router.replace("/lawyer/dashboard");
            return
        } else if (user.role === "user") {
            dispatch(setUserData({
                id: user._id || (user as any).id,
                email: user.email,
                name: user.name,
                phone: user.phone as any,
                role: user.role
            }));
            window.location.href = "/";
            return
        }
    };

    const onLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = !validateEmail(loginForm.email) ? "Please enter a valid email address" : "";
        const passwordError = !validatePassword(loginForm.password) ? "Password must be at least 6 characters" : "";
        setLoginErrors({ email: emailError, password: passwordError });

        if (emailError || passwordError) return;

        setLoading(true);
        try {
            const response = await userLogin(loginForm);
            processLoginSuccess(response);
        } catch (err: any) {
            showToast('error', err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const token = credentialResponse.credential;
            if (!token) {
                showToast("error", "No credential received from Google");
                return;
            }
            await processGoogleLogin(token);
        } catch (error) {
            showToast("error", "Google Login failed");
        }
    };

    const processGoogleLogin = async (token: string, role?: string) => {
        try {
            const response = await userGoogleAuth(token, role);

            if (response.data?.needsRoleSelection) {
                setGoogleToken(token);
                setShowRoleModal(true);
                return;
            }

            const loginRes: CommonResponse<LoginResponse> = {
                success: response.success,
                message: response.message,
                data: {
                    user: response.data.user as User,
                }
            };

            processLoginSuccess(loginRes);
        } catch (error: any) {
            showToast("error", error.response?.data?.message || "Google Login failed");
        }
    };

    const handleRoleSelectModal = (role: 'user' | 'lawyer') => {
        setShowRoleModal(false);
        if (googleToken) {
            processGoogleLogin(googleToken, role);
        }
    };

    return (
        <>
            <RoleSelectionModal
                isOpen={showRoleModal}
                onSelect={handleRoleSelectModal}
                onClose={() => setShowRoleModal(false)}
            />
            <form onSubmit={onLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                            placeholder="you@example.com"
                            className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${loginErrors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                        />
                    </div>
                    {loginErrors.email && <p className="text-xs text-red-500">{loginErrors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <button type="button" onClick={() => router.push('/forgotPassword')} className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium">
                            Forgot Password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={loginForm.password}
                            onChange={handleLoginChange}
                            placeholder="Enter your password"
                            className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border ${loginErrors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {loginErrors.password && <p className="text-xs text-red-500">{loginErrors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500">Or continue with</span></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => showToast("error", "Google Login Failed")}
                        useOneTap={false}
                        shape="pill"
                        width="100%"
                        theme="outline"
                    />
                </div>
            </form>
        </>
    );
};

export default LoginForm;
