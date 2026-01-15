'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Star, AlertCircle } from 'lucide-react';
import { getSubscriptionPlans, getCurrentSubscription, createSubscriptionCheckout } from '@/service/lawyerService';
import { showToast } from '@/utils/alerts';

interface SubscriptionPlan {
    id: string;
    planName: string;
    duration: number;
    durationUnit: string;
    price: number;
    commissionPercent: number;
    isActive: boolean;
}

interface CurrentSubscription {
    id: string;
    planName: string;
    duration: number;
    durationUnit: string;
    price: number;
    commissionPercent: number;
    isActive: boolean;
    expiryDate?: string;
}

const SubscriptionsPage = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansResponse, currentResponse] = await Promise.all([
                    getSubscriptionPlans(),
                    getCurrentSubscription()
                ]);

                if (plansResponse?.data) {
                    setPlans(plansResponse.data);
                }

                if (currentResponse?.data) {
                    setCurrentSubscription(currentResponse.data);
                }
            } catch (error: any) {
                showToast('error', error.message || 'Failed to load subscription data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        try {
            setProcessingId(plan.id);

            const profileData = await import('@/service/lawyerService').then(m => m.getprofile());

            if (!profileData) {
                throw new Error("Could not fetch user profile");
            }
            const user = profileData;

            const response = await createSubscriptionCheckout(
                user.id,
                user.email,
                plan.planName,
                plan.price,
                plan.id
            );

            if (response && response.data?.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("Invalid checkout session URL");
            }


        } catch (error: any) {
            showToast('error', error.message || 'Failed to initiate checkout');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-7xl mx-auto p-8 md:p-12">

                {/* Header */}
                <header className="mb-10 pl-2">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Subscription Plans</h1>
                    <p className="text-slate-500 text-lg">Choose the perfect plan to grow your legal practice.</p>
                </header>

                {/* Current Subscription Section - Dark Hero Card */}
                {currentSubscription && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 bg-[#1e293b] rounded-[2rem] p-10 relative overflow-hidden shadow-2xl text-white"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Shield size={220} className="text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                                        Active Plan
                                    </span>
                                    {currentSubscription.expiryDate && (
                                        <span className="text-slate-300 text-sm flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                            Expires: <span className="text-white font-medium">{new Date(currentSubscription.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">{currentSubscription.planName}</h2>
                                <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                                    Your current subscription duration is <span className="text-white font-semibold">{currentSubscription.duration} {currentSubscription.durationUnit}</span>.
                                    Enjoy premium dashboard access and enhanced visibility.
                                </p>
                            </div>

                            <div className="flex flex-col items-end bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="text-5xl font-bold text-white tracking-tight">
                                    ₹{currentSubscription.price}
                                    <span className="text-lg text-slate-400 font-medium ml-1">/{currentSubscription.durationUnit}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                                    Commission Rate: <span className="text-white">{currentSubscription.commissionPercent}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Available Plans Grid - White Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const isCurrent = currentSubscription?.id === plan.id;
                        const getMonths = (duration: number, unit: string) => {
                            return unit === 'year' ? duration * 12 : duration;
                        };

                        const currentMonths = currentSubscription ? getMonths(currentSubscription.duration, currentSubscription.durationUnit) : 0;
                        const planMonths = getMonths(plan.duration, plan.durationUnit);

                        const isDowngrade = currentMonths > 0 && planMonths < currentMonths;
                        const isDisabled = isCurrent || !!processingId || isDowngrade;

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: isDowngrade ? 0 : -8 }}
                                className={`relative bg-white rounded-[2rem] p-8 flex flex-col h-full transition-all duration-300 border ${isCurrent
                                    ? 'border-teal-500 shadow-[0_10px_40px_-10px_rgba(20,184,166,0.2)] ring-1 ring-teal-500'
                                    : isDowngrade
                                        ? 'border-slate-100 opacity-60 bg-slate-50'
                                        : 'border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
                                    }`}
                            >
                                {isCurrent && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-1.5 tracking-wide uppercase">
                                        <Check size={14} strokeWidth={3} /> Current Plan
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{plan.planName}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-slate-900 tracking-tight">₹{plan.price}</span>
                                        <span className="text-slate-400 font-medium">/{plan.durationUnit}</span>
                                    </div>
                                </div>

                                <ul className="space-y-5 mb-10 flex-grow">
                                    <li className="flex items-start gap-4 text-slate-600 group">
                                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                            <Zap size={18} />
                                        </div>
                                        <div className="py-1">
                                            <span className="font-semibold text-slate-900 block">{plan.duration} {plan.durationUnit}</span>
                                            <span className="text-sm">Duration</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 text-slate-600 group">
                                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                            <Star size={18} />
                                        </div>
                                        <div className="py-1">
                                            <span className="font-semibold text-slate-900 block">{plan.commissionPercent}%</span>
                                            <span className="text-sm">Commission Rate</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 text-slate-600 group">
                                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                            <Check size={18} />
                                        </div>
                                        <div className="py-1">
                                            <span className="font-semibold text-slate-900 block">Active</span>
                                            <span className="text-sm">Dashboard Access</span>
                                        </div>
                                    </li>
                                </ul>

                                <div className="space-y-3 mt-auto">
                                    <button
                                        onClick={() =>  handleSubscribe(plan)}
                                        disabled={isDisabled}
                                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide ${isCurrent
                                            ? 'bg-slate-100 text-slate-400 cursor-default'
                                            : isDowngrade
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10'
                                            }`}
                                    >
                                        {processingId === plan.id ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isCurrent ? (
                                            <>ACTIVE</>
                                        ) : isDowngrade ? (
                                            <>UNAVAILABLE</>
                                        ) : (
                                            <>SUBSCRIBE NOW</>
                                        )}
                                    </button>
                                    {isDowngrade && (
                                        <p className="text-[11px] font-medium text-red-500/70 text-center flex items-center justify-center gap-1.5 uppercase tracking-wide">
                                            <AlertCircle size={12} /> Plan duration too short
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {plans.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Plans Available</h3>
                        <p className="text-slate-500">Check back later for new subscription options.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionsPage;
