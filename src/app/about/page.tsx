"use client";

import React from "react";
import { Scale, Users, Shield, Zap, Heart, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import UserHeader from '@/components/user/userHeader'

const AboutPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const values = [
        {
            icon: <Shield className="w-8 h-8 text-teal-600" />,
            title: "Trusted Protection",
            description: "Our platform ensures the highest standards of security and confidentiality for all legal consultations."
        },
        {
            icon: <Zap className="w-8 h-8 text-teal-600" />,
            title: "Rapid Connection",
            description: "Connect with specialized legal professionals in minutes, not days, through our streamlined platform."
        },
        {
            icon: <Users className="w-8 h-8 text-teal-600" />,
            title: "Expert Network",
            description: "We vet every lawyer on our platform to ensure you receive advice from top-tier professionals."
        }
    ];

    const stats = [
        { label: "Active Lawyers", value: "500+" },
        { label: "Successful Consultations", value: "10k+" },
        { label: "User Satisfaction", value: "99%" },
        { label: "Practice Areas", value: "25+" }
    ];

    return (
        <div className="min-h-screen bg-white">
             <UserHeader />
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px] opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div {...fadeIn}>
                        <span className="text-teal-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Story</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-6 leading-tight">
                            Making Quality Legal Advice <br />
                            <span className="text-teal-600">Accessible to Everyone</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            OpenLaw was founded with a single mission: to bridge the gap between complex legal systems and the people who need them most. We believe that justice should be approachable, transparent, and digital-first.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/user/lawyers"
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                            >
                                Find a Lawyer <ArrowRight className="w-4 h-4" />
                            </Link>
                            {/* <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
                                Our Services
                            </button> */}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-5xl font-serif font-black text-teal-500 mb-2">{stat.value}</div>
                                <div className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div {...fadeIn}>
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-8 leading-tight">
                                Built on Trust, <br />
                                <span className="text-teal-600">Driven by Ethics</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-teal-500/20 hover:bg-white hover:shadow-2xl hover:shadow-teal-900/5 transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 mb-1">Human-Centric Approach</h3>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">We prioritize human connection and empathy in every interaction on our platform.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-teal-500/20 hover:bg-white hover:shadow-2xl hover:shadow-teal-900/5 transition-all group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 mb-1">Transparency First</h3>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">No hidden fees, no complex jargon. Just clear communication and transparent pricing.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/20 to-transparent"></div>
                                <div className="absolute inset-x-8 bottom-8 p-8 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                                    <p className="text-slate-900 font-bold italic text-lg mb-4">
                                        "OpenLaw isn't just a platform; it's a movement towards a more equitable legal future."
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-600"></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Sarah Jenkins</p>
                                            <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Founder & CEO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-600 rounded-3xl -z-10 animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-4 tracking-tight">Why Choose OpenLaw?</h2>
                        <p className="text-slate-600 font-medium tracking-tight">We bring the best of legal technology to your fingertips.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                {...fadeIn}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-teal-50 w-fit rounded-2xl group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    {React.cloneElement(value.icon as React.ReactElement<{ className?: string }>, {
                                        className: "w-8 h-8 group-hover:text-white"
                                    })}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-teal-600 rounded-[4rem] px-8 py-20 text-center relative overflow-hidden shadow-2xl shadow-teal-600/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <motion.div {...fadeIn}>
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-8">Ready to get started?</h2>
                            <p className="text-teal-50 text-lg mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                                Join thousands of satisfied clients who have found expert legal advice through our platform. No commitment required.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {/* <Link
                                    href="/login"
                                    className="bg-white text-teal-600 px-10 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl shadow-black/10 active:scale-95"
                                >
                                    Create Account
                                </Link> */}
                                <Link
                                    href="/user/lawyers"
                                    className="bg-teal-700 text-white px-10 py-4 rounded-2xl font-black hover:bg-teal-800 transition-all border border-white/20 active:scale-95"
                                >
                                    Browse Lawyers
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
