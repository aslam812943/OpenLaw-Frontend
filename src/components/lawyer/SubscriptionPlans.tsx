import React, { useEffect, useState } from "react";
import { getSubscriptionPlans, createSubscriptionCheckout, getprofile } from "@/service/lawyerService";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";
import { motion } from 'framer-motion';
import { Check, Zap, Star, Shield } from 'lucide-react';

interface Subscription {
    id: string;
    planName: string;
    duration: number;
    durationUnit: string;
    price: number;
    commissionPercent: number;
}

const SubscriptionPlans: React.FC = () => {
    const [plans, setPlans] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getSubscriptionPlans();
                if (response.success) {
                    setPlans(response.data);
                } else {
                    showToast("error", "Failed to load plans.");
                }
            } catch (err: any) {
                showToast("error", err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleBuy = async (plan: Subscription) => {
        setProcessingId(plan.id);
        try {
            const lawyer = await getprofile();

            if (!lawyer) {
                showToast("error", "Could not fetch lawyer details. Please try logging in again.");
                return;
            }

            const response = await createSubscriptionCheckout(
                lawyer.id,
                lawyer.email,
                plan.planName,
                plan.price,
                plan.id
            );

            if (response?.data?.url) {
                window.location.href = response.data.url;
            } else {
                showToast("error", "Failed to initiate checkout");
            }

        } catch (err: any) {
            console.error(err);
            showToast("error", err.message || "Checkout failed");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Choose a Subscription Plan
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Unlock exclusive features to grow your legal practice and reach more clients.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-[2rem] p-8 flex flex-col border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                    >
                        <div className="mb-8">
                            <div className="flex justify-start mb-4">
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-50 text-teal-600 border border-teal-100">
                                    {plan.planName}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-slate-900 tracking-tight">₹{plan.price}</span>
                                <span className="text-slate-400 font-medium">/ {plan.duration} {plan.durationUnit}</span>
                            </div>
                        </div>

                        <ul className="space-y-5 mb-10 flex-grow">
                            <li className="flex items-start gap-4 text-slate-600 group">
                                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                    <Zap size={18} />
                                </div>
                                <div className="py-1">
                                    <span className="font-semibold text-slate-900 block">Full Access</span>
                                    <span className="text-sm">Dashboard & Features</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 group">
                                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                    <Star size={18} />
                                </div>
                                <div className="py-1">
                                    <span className="font-semibold text-slate-900 block">{100 - plan.commissionPercent}% Revenue</span>
                                    <span className="text-sm">Platform Commission: {plan.commissionPercent}%</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 group">
                                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                                    <Shield size={18} />
                                </div>
                                <div className="py-1">
                                    <span className="font-semibold text-slate-900 block">Verified Status</span>
                                    <span className="text-sm">Trust badge on profile</span>
                                </div>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleBuy(plan)}
                            disabled={processingId === plan.id}
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide ${processingId === plan.id
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-lg shadow-teal-600/20"
                                }`}
                        >
                            {processingId === plan.id ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Get Access"
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
