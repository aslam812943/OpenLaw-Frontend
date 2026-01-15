'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { showToast } from '@/utils/alerts';
import { userRegister } from '@/service/userService';
import { lawyerRegister } from '@/service/lawyerService';
import { Mail, Lock, User, Phone, ArrowRight, Users, Gavel } from 'lucide-react';

// Validation Helpers
const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;
const validateName = (name: string): boolean => name.trim().length > 0;
const validatePhone = (phone: string): boolean => /^\d{10}$/.test(phone);

const RegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        conformpassword: '',
        role: 'user'
    });
    const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));

        let error = '';
        if (name === 'name' && !validateName(value)) error = 'Name is required';
        if (name === 'email' && !validateEmail(value)) error = 'Enter a valid email address';
        if (name === 'phone' && !validatePhone(value)) error = 'Enter a valid 10-digit phone number';
        if (name === 'password') {
            if (!validatePassword(value)) error = 'Password must be at least 6 characters';
            if (registerForm.conformpassword && value !== registerForm.conformpassword) {
                setRegisterErrors(prev => ({ ...prev, conformpassword: 'Passwords do not match' }));
            } else {
                setRegisterErrors(prev => ({ ...prev, conformpassword: '' }));
            }
        }
        if (name === 'conformpassword' && value !== registerForm.password) error = 'Passwords do not match';

        setRegisterErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleRegisterRoleChange = (role: 'user' | 'lawyer') => {
        setRegisterForm(prev => ({ ...prev, role }));
    };

    const onRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameError = !validateName(registerForm.name) ? 'Name is required' : '';
        const emailError = !validateEmail(registerForm.email) ? 'Enter a valid email address' : '';
        const phoneError = !validatePhone(registerForm.phone) ? 'Enter a valid 10-digit phone number' : '';
        const passwordError = !validatePassword(registerForm.password) ? 'Password must be at least 6 characters' : '';
        const conformPasswordError = registerForm.conformpassword !== registerForm.password ? 'Passwords do not match' : '';

        setRegisterErrors({
            name: nameError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            conformpassword: conformPasswordError,
        });

        if (nameError || emailError || phoneError || passwordError || conformPasswordError) return;

        setLoading(true);
        try {
            localStorage.setItem("registerEmail", registerForm.email);
            const apiData = { ...registerForm, phone: String(registerForm.phone) };

            if (registerForm.role === 'lawyer') {
                await lawyerRegister(apiData);
            } else {
                await userRegister(apiData);
            }

            showToast('success', 'Registration successful! OTP sent to your email/phone.');
            router.push('/verifyOtp');
        } catch (err: any) {
            showToast('error', err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onRegisterSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => handleRegisterRoleChange('user')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${registerForm.role === 'user' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-teal-300 text-slate-600'}`}
                >
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Client</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleRegisterRoleChange('lawyer')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${registerForm.role === 'lawyer' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-teal-300 text-slate-600'}`}
                >
                    <Gavel className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Lawyer</span>
                </button>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        placeholder="Full Name"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${registerErrors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                    />
                    {registerErrors.name && <p className="text-xs text-red-500 mt-1">{registerErrors.name}</p>}
                </div>

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="Email Address"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${registerErrors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                    />
                    {registerErrors.email && <p className="text-xs text-red-500 mt-1">{registerErrors.email}</p>}
                </div>

                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        placeholder="Phone Number"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${registerErrors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                    />
                    {registerErrors.phone && <p className="text-xs text-red-500 mt-1">{registerErrors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            name="password"
                            value={registerForm.password}
                            onChange={handleRegisterChange}
                            placeholder="Password"
                            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${registerErrors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            name="conformpassword"
                            value={registerForm.conformpassword}
                            onChange={handleRegisterChange}
                            placeholder="Confirm"
                            className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${registerErrors.conformpassword ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all`}
                        />
                    </div>
                </div>
                {(registerErrors.password || registerErrors.conformpassword) && <p className="text-xs text-red-500 mt-1">{registerErrors.password || registerErrors.conformpassword}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/30 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Create Account <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
};

export default RegisterForm;
