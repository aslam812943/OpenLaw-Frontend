"use client";

import React, { useEffect, useState } from "react";
import {
    ShieldCheck,
    CheckCircle2,
    Circle,
    AlertCircle,
    Lock,
    CreditCard,
    UserCheck,
    FileText,
    Clock,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { getprofile, Lawyer } from "@/service/lawyerService";
import { useRouter } from "next/navigation";

const VisibilityStatusPage = () => {
    const [profile, setProfile] = useState<Lawyer | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getprofile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch visibility status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    const requirements = [
        {
            id: "verification",
            title: "Admin Verification",
            description: "Admin must review and approve your documents.",
            status: profile?.isAdminVerified && profile?.verificationStatus === "Approved",
            icon: <ShieldCheck className="w-6 h-6" />,
         
        },
        {
            id: "subscription",
            title: "Active Subscription",
            description: "You need an active plan to be listed.",
            status: profile?.paymentVerify,
            icon: <CreditCard className="w-6 h-6" />,
            actionLabel: "Manage Plans",
            actionPath: "/lawyer/subscriptions",
        },
        {
            id: "block",
            title: "Account Status",
            description: "Ensure your account is not blocked.",
            status: !profile?.isBlock,
            icon: <Lock className="w-6 h-6" />,
            negative: true,
        },
        {
            id: "profile",
            title: "Profile Completion",
            description: "Basic profile details must be completed.",
            status: profile?.isVerified,
            icon: <UserCheck className="w-6 h-6" />,
            actionLabel: "Edit Profile",
            actionPath: "/lawyer/profile",
        },
        {
            id: "bio",
            title: "Professional Bio",
            description: "Write a brief bio about your practice.",
            status: !!profile?.bio && profile.bio.length > 10,
            icon: <FileText className="w-6 h-6" />,
            actionLabel: "Update Bio",
            actionPath: "/lawyer/profile",
        }
    ];

    const allReady = requirements.every(req => req.negative ? req.status : req.status);
    const completedCount = requirements.filter(req => req.status).length;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Visibility Dashboard</h1>
                <p className="text-slate-500">Track your progress to appear in the client search results.</p>
            </motion.div>

            {/* Main Status Hero */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-3xl p-8 mb-10 text-white shadow-xl ${allReady
                        ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-200"
                        : "bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-200"
                    }`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-2xl bg-white/20 backdrop-blur-md`}>
                            {allReady ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {allReady ? "You are visible!" : "Visibility in Progress"}
                            </h2>
                            <p className="text-white/80 mt-1">
                                {allReady
                                    ? "Your profile is now live and searchable by potential clients."
                                    : `Complete ${requirements.length - completedCount} more ${requirements.length - completedCount === 1 ? 'step' : 'steps'} to go live.`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
                        <span className="font-mono text-xl font-bold">{completedCount} / {requirements.length}</span>
                        <span className="ml-2 text-sm opacity-80 uppercase tracking-wider font-semibold text-white">Tasks</span>
                    </div>
                </div>
            </motion.div>

            {/* Requirement List */}
            <div className="grid gap-4">
                {requirements.map((req, index) => (
                    <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${req.status
                                ? "bg-white border-teal-100 shadow-sm"
                                : "bg-slate-50 border-slate-200"
                            }`}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`p-3 rounded-xl ${req.status ? "bg-teal-50 text-teal-600" : "bg-slate-200 text-slate-500"
                                }`}>
                                {req.icon}
                            </div>
                            <div>
                                <h3 className={`font-bold ${req.status ? "text-slate-900" : "text-slate-600"}`}>
                                    {req.title}
                                </h3>
                                <p className="text-sm text-slate-500">{req.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {req.status ? (
                                <div className="flex items-center gap-2 text-teal-600 font-bold text-sm bg-teal-50 px-4 py-2 rounded-lg border border-teal-100">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    {!req.negative && req.actionPath && (
                                        <button
                                            onClick={() => router.push(req.actionPath!)}
                                            className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1 group"
                                        >
                                            {req.actionLabel}
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                                        <AlertCircle className="w-4 h-4" />
                                        Pending
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {!allReady && (
                <div className="mt-12 p-8 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900">Why am I not visible yet?</h4>
                        <p className="text-amber-800/80 text-sm mt-1 leading-relaxed">
                            To maintain a high-quality platform, we require all lawyers to complete verification and subscription. Once you satisfy all the conditions listed above, our system automatically adds your profile to the public search results within 10-15 minutes.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisibilityStatusPage;
