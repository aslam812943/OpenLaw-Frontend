"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifySubscriptionPayment } from "@/service/lawyerService";
import { CheckCircle } from "lucide-react";

const SubscriptionSuccessPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError("Invalid session ID");
                setLoading(false);
                return;
            }

            try {
                await verifySubscriptionPayment(sessionId);
               
                setTimeout(() => {
                    router.push("/lawyer/dashboard");
                }, 2000);
            } catch (err) {
                setError("Payment verification failed. Please contact support.");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                <p className="mt-4 text-gray-600">Verifying your subscription...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/lawyer/dashboard")}
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Active!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for subscribing. You now have full access to the dashboard. Redirecting...
                </p>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;
