"use client"
import React from "react"
import { ShieldCheck, Scale, Clock, RefreshCcw, Wallet, Info, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const PolicyCard = ({ icon: Icon, title, description, colorClass, delay }: { icon: any, title: string, description: string, colorClass: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl transition-all duration-300 group"
    >
        <div className="flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    </motion.div>
);

const UserServicePolicyPage = () => {
    const policies = [
        {
            icon: Clock,
            title: "Guaranteed Acceptance",
            description: "If a lawyer does not respond by the scheduled time, your booking is automatically cancelled and funds are cleared.",
            colorClass: "bg-blue-50 text-blue-600",
            delay: 0.1
        },
        {
            icon: ShieldCheck,
            title: "No-Show Protection",
            description: "Your session is secured. If a lawyer fails to attend a confirmed appointment, your wallet balance is protected.",
            colorClass: "bg-teal-50 text-teal-600",
            delay: 0.15
        },
        {
            icon: RefreshCcw,
            title: "Instant Refunds",
            description: "No manual requests needed. Refunds are processed instantly back to your wallet based on automated rules.",
            colorClass: "bg-indigo-50 text-indigo-600",
            delay: 0.2
        },
        {
            icon: Scale,
            title: "Fair Payout System",
            description: "We enforce strict accountability for lawyers, ensuring you only pay for completed legal consultations.",
            colorClass: "bg-rose-50 text-rose-600",
            delay: 0.25
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-6 md:p-10 space-y-12 pb-24">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Client Protection Protocol
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                        Legal Service <br /><span className="text-teal-600">Guaranteed.</span>
                    </h1>
                    <p className="text-base text-slate-500 font-medium leading-relaxed">
                        At OpenLaw, we prioritize your security. Every consultation is managed by automated escrow systems and professional accountability rules.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl lg:min-w-[400px]"
                >
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Automated Escrow Secure</h3>
                        <p className="text-[13px] text-teal-100/60 leading-relaxed max-w-[280px]">
                            Your funds are protected until the session is successfully completed.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Rules Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {policies.map((policy, idx) => (
                    <PolicyCard key={idx} {...policy} />
                ))}
            </div>

            {/* Detailed Operation Area */}
            <div className="grid lg:grid-cols-3 gap-8 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-1 border-l-4 border-teal-500 pl-6 py-2"
                >
                    <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight uppercase tracking-tighter">Operational <br />Transparency.</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Complete clarity on how our protection layer handles your transactions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 grid gap-6"
                >
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 flex gap-6 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Secure Holding Mechanism</h4>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                                consultation fees are held in a secure bridge account. Funds are released only after the lawyer initiates the call and completes the session. If the session fails to start, the system triggers an immediate rollback.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 flex gap-6 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Dispute Resolution</h4>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                                Encountered a no-show? You can report an issue directly from your dashboard. Our admin team will investigate and process manual refunds if necessary within 24 business hours.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* System Status Footer */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Protection Layer Active — v2.10</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> PCI-DSS Secure</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <span>Verified Professionals</span>
                </div>
            </div>
        </div>
    );
};

export default UserServicePolicyPage;
