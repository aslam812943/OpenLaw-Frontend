"use client"
import React from "react"
import { Scale, Clock, AlertTriangle, Wallet, Info, FileText, ArrowLeft, ShieldAlert, CheckCircle2, ChevronRight, Zap, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const ComplianceCard = ({ icon: Icon, title, description, colorClass, delay }: { icon: any, title: string, description: string, colorClass: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl transition-all duration-300 group"
    >
        <div className="flex gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-3 ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-[15px] mb-2 tracking-tight transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    </motion.div>
);

const LawyerServicePolicyPage = () => {
    const router = useRouter();

    const standards = [
        {
            icon: Clock,
            title: "Response Latency",
            description: "Accept or reject bookings before the scheduled start time. Non-action triggers automatic cancellation.",
            colorClass: "bg-teal-50 text-teal-600",
            delay: 0.1
        },
        {
            icon: ShieldAlert,
            title: "Penalty Protocol",
            description: "Expired bookings due to non-response incur a penalty based on tier, ensuring 99.9% reliability.",
            colorClass: "bg-rose-50 text-rose-600",
            delay: 0.15
        },
        {
            icon: Scale,
            title: "Professional No-Show",
            description: "Failing to join a confirmed call without notice is a critical violation, resulting in a full refund.",
            colorClass: "bg-amber-50 text-amber-600",
            delay: 0.2
        },
        {
            icon: Wallet,
            title: "Escrow Finalization",
            description: "Funds are released only after 'Completion'. Delayed completion (>48h) results in automated audit.",
            colorClass: "bg-blue-50 text-blue-600",
            delay: 0.25
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pb-24">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8"
            >
                {/* Hero Header */}
                <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl border border-slate-700">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-slate-600/20 to-transparent rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-slate-300 text-sm font-medium">Platform Standards,</p>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">Professional Service Policy</h1>
                            </div>
                        </div>

                        <p className="text-slate-300 text-lg max-w-2xl mb-8 leading-relaxed">
                            Maintaining the integrity of the legal profession through strict accountability and reliability protocols.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Policy Compliant
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard-like grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Standards Left */}
                    <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
                        {standards.map((standard, idx) => (
                            <ComplianceCard key={idx} {...standard} />
                        ))}
                    </div>

                    {/* Warning Right */}
                    <motion.div
                        variants={item}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                            <AlertTriangle className="w-32 h-32 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Compliance Notice</h3>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-6">
                                Tier-based penalties are calculated per cancellation. Maintain a 95%+ completion rate to ensure priority platform visibility.
                            </p>
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between group cursor-pointer">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">View Tier Details</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Technical Guidelines Section */}
                <div className="grid lg:grid-cols-12 gap-8">
                    <motion.div variants={item} className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-8 shadow-lg">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-[1.1]">Execution <br />Manual.</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                            Underlying system hooks governing your account activity.
                        </p>
                        <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                            Sync Account Profile
                        </button>
                    </motion.div>

                    <div className="lg:col-span-8 space-y-4">
                        {[
                            { title: "Automated Expiration", desc: "System fires validation at exactly T-0. Non-acceptance move status to 'AUTO_CANCELED'." },
                            { title: "Atomic Wallet Rollback", desc: "User refunds and penalty debits are processed simultaneously using ACID transactions." },
                            { title: "Escrow Finalization window", desc: "Earnings remain in hold for 48 hours to accommodate any potential user disputes." }
                        ].map((guideline, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="bg-white/50 border border-gray-100 p-6 rounded-2xl hover:border-teal-200 transition-colors flex items-center gap-6"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs shrink-0">{idx + 1}</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{guideline.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{guideline.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Marketplace Footer */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Marketplace Integrity Division — Protocol 2.1</span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="hover:text-teal-600 cursor-pointer transition-colors leading-relaxed">Dispute Resolution</span>
                        <span className="hover:text-teal-600 cursor-pointer transition-colors leading-relaxed">System Status</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LawyerServicePolicyPage;
