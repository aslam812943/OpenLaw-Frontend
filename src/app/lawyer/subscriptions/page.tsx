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

            if (!profileData?.data) {
                throw new Error("Could not fetch user profile");
            }
            const user = profileData.data;

            const response = await createSubscriptionCheckout(
                user.id,
                user.email,
                plan.planName,
                plan.price,
                plan.id
            );

            if (response && response.url) {
                
                window.location.href = response.url;
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
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 font-sans">

            {/* Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Subscription Plans</h1>
                <p className="text-slate-400 text-lg">Choose the perfect plan to grow your legal practice.</p>
            </header>

            {/* Current Subscription Section */}
            {currentSubscription && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 bg-gradient-to-r from-teal-900/20 to-slate-900/40 border border-teal-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield size={120} className="text-teal-500" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                                    Active Plan
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{currentSubscription.planName}</h2>
                            <p className="text-slate-400">
                                You are currently subscribed to the <span className="text-teal-400 font-semibold">{currentSubscription.duration} {currentSubscription.durationUnit}</span> plan.
                            </p>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="text-3xl font-bold text-white">
                                ₹{currentSubscription.price}
                                <span className="text-sm text-slate-500 font-normal ml-1">/{currentSubscription.durationUnit}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Commission: {currentSubscription.commissionPercent}%
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Available Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const isCurrent = currentSubscription?.id === plan.id;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`relative bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${isCurrent
                                ? 'border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.1)]'
                                : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                        >
                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <Check size={12} strokeWidth={4} /> Current Plan
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.planName}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-teal-400">₹{plan.price}</span>
                                    <span className="text-slate-500">/{plan.durationUnit}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Zap size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                    <span>Duration: {plan.duration} {plan.durationUnit}</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Star size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                    <span>Commission Rate: {plan.commissionPercent}%</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <Check size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                    <span>Premium Visibility</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => !isCurrent && handleSubscribe(plan)}
                                disabled={isCurrent || !!processingId}
                                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isCurrent
                                    ? 'bg-slate-800 text-slate-500 cursor-default'
                                    : 'bg-teal-500 text-slate-950 hover:bg-teal-400 active:scale-95 shadow-lg shadow-teal-500/20'
                                    }`}
                            >
                                {processingId === plan.id ? (
                                    <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : isCurrent ? (
                                    <>Active Plan</>
                                ) : (
                                    <>Select Plan</>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {plans.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                    <AlertCircle size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">No Plans Available</h3>
                    <p className="text-slate-500">Check back later for new subscription options.</p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;
