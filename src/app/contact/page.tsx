"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import UserHeader from "@/components/user/userHeader";
import UserFooter from "@/components/user/userFooter";
import { showToast } from "@/utils/alerts";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast("success", "Your message has been sent! Our team will respond shortly.");
      setFormData({ name: "", email: "", topic: "General Inquiry", message: "" });
    }, 800);
  };

  const contactChannels = [
    {
      icon: <Mail className="w-6 h-6 text-teal-600" />,
      title: "Email Support",
      description: "Our dedicated team responds within 2 business hours.",
      detail: "support@openlaw.com",
      action: "mailto:support@openlaw.com",
      actionText: "Send an email"
    },
    {
      icon: <Phone className="w-6 h-6 text-teal-600" />,
      title: "Client Hotline",
      description: "Speak directly with our support specialists.",
      detail: "+1 (800) 555-0199",
      action: "tel:+18005550199",
      actionText: "Call us now"
    },
    {
      icon: <Clock className="w-6 h-6 text-teal-600" />,
      title: "Consultation Hours",
      description: "Lawyers are available across global timezones.",
      detail: "Monday – Saturday: 8:00 AM – 9:00 PM EST",
      action: "/user/lawyers",
      actionText: "Browse schedules"
    }
  ];

  const faqs = [
    {
      q: "How fast can I connect with an attorney?",
      a: "Most consultations can be scheduled within the same day. For urgent matters, instant chat and video availability are highlighted on lawyers' profiles."
    },
    {
      q: "Is my consultation and communication confidential?",
      a: "Yes, 100%. All chats, calls, and document exchanges on OpenLaw are end-to-end encrypted and covered by strict attorney-client privilege guidelines."
    },
    {
      q: "How does payment and fee transparency work?",
      a: "Lawyers publish their consultation rates upfront. Payments are held securely in escrow and only released once your consultation session is successfully delivered."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-900">
      <UserHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-[#fafafa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-teal-100/70 text-teal-800 text-xs sm:text-sm font-semibold">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>We're Here to Help</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-slate-900 mb-6 tracking-tight">
                Contact <span className="text-teal-600">OpenLaw</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Have questions about our legal network, booking a consultation, or need help with your account? Reach out to our dedicated support team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Channels Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((channel, idx) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{channel.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{channel.description}</p>
                  <p className="text-base font-semibold text-slate-800 mb-6">{channel.detail}</p>
                </div>

                <a
                  href={channel.action}
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors group"
                >
                  <span>{channel.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form and FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg shadow-slate-900/5"
            >
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2">Send us a message</h2>
                <p className="text-sm text-slate-600">Fill in your information and we will get back to you promptly.</p>
              </div>

              {submitted ? (
                <div className="py-12 text-center bg-teal-50/50 rounded-2xl border border-teal-200 p-8">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm">
                    Thank you for reaching out. A client support specialist has been assigned to your message and will respond shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Consultation & Bookings">Consultation & Bookings</option>
                      <option value="Lawyer Partnership">Join as a Lawyer</option>
                      <option value="Billing & Refunds">Billing & Refunds</option>
                      <option value="Technical Support">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe how we can assist you..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* FAQs & Trust Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Frequently Asked</h3>
                </div>

                <div className="space-y-5">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-bold text-slate-900 mb-1.5">{faq.q}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to find lawyer card */}
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-3xl p-8 shadow-xl shadow-teal-700/20">
                <h3 className="text-xl font-bold mb-2">Need immediate legal advice?</h3>
                <p className="text-teal-100 text-sm mb-6 leading-relaxed">
                  Skip the contact form and browse hundreds of verified attorneys available for consultation right now.
                </p>
                <Link
                  href="/user/lawyers"
                  className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Find a Lawyer Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <UserFooter />
    </div>
  );
};

export default ContactPage;
