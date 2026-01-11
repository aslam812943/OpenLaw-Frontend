import React, { useEffect, useState } from "react";
import { getSubscriptionPlans, createSubscriptionCheckout, getprofile } from "@/service/lawyerService";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/alerts";

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
                if (response.status) {
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

            const profileRes = await getprofile();
            const lawyer = profileRes?.data;

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

            if (response.success && response.url) {
                router.push(response.url);
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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Choose a Subscription Plan
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Unlock exclusive features to grow your legal practice.
                </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-2 lg:max-w-none">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300"
                    >
                        <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                            <div className="flex justify-center">
                                <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                                    {plan.planName}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-center text-6xl font-extrabold text-gray-900">
                                ₹{plan.price}
                            </div>
                            <div className="mt-4 flex justify-center text-xl font-medium text-gray-500">
                                / {plan.duration} {plan.durationUnit}
                            </div>
                        </div>
                        <div className="px-6 pt-6 pb-8 bg-gray-50 sm:px-10 sm:py-10">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-base font-medium text-gray-500">
                                        Platform Commission: {plan.commissionPercent}% (Standard)
                                    </p>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <div className="rounded-lg shadow-md">
                                    <button
                                        onClick={() => handleBuy(plan)}
                                        disabled={processingId === plan.id}
                                        className={`block w-full text-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white ${processingId === plan.id
                                            ? "bg-indigo-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700"
                                            }`}
                                    >
                                        {processingId === plan.id ? "Processing..." : "Get Access"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
