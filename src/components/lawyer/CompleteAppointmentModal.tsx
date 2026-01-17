'use client'

import React, { useState } from 'react'
import { X, CheckCircle, FileText, User, Calendar, Clock, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Appointment {
    id: string;
    userName: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    desctiption: string;
    status: string;
    lawyerFeedback?: string;
}

interface CompleteAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (feedback: string) => void;
    appointment: Appointment | null;
    isSubmitting: boolean;
}

const CompleteAppointmentModal: React.FC<CompleteAppointmentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    appointment,
    isSubmitting
}) => {
    const isReadOnly = appointment?.status === 'completed';
    const [feedback, setFeedback] = useState(appointment?.lawyerFeedback || '')

    React.useEffect(() => {
        if (appointment) {
            setFeedback(appointment.lawyerFeedback || '');
        }
    }, [appointment]);

    if (!appointment) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {isReadOnly ? (
                                    <FileText className="w-6 h-6 text-teal-400" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 text-teal-400" />
                                )}
                                <h2 className="text-xl font-bold tracking-tight">
                                    {isReadOnly ? 'Consultation Summary' : 'Complete Consultation'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Appointment Details Summary */}
                            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <User className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Client</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.userName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Calendar className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Clock className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Duration</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.startTime} - {appointment.endTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <CreditCard className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Fee Earned</p>
                                            <p className="text-sm font-bold text-slate-900">₹{appointment.consultationFee}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description from Client */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Client's Description</h3>
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-xl text-sm text-slate-600 italic">
                                    "{appointment.desctiption || 'No description provided.'}"
                                </div>
                            </div>

                            {/* Feedback Field */}
                            <div className="space-y-3">
                                <label className="text-xs uppercase font-extrabold tracking-widest text-slate-500 flex justify-between">
                                    Post-Consultation Notes & Feedback
                                    {!isReadOnly && <span className="text-slate-300 font-medium">Required for completion</span>}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    readOnly={isReadOnly}
                                    placeholder={isReadOnly ? "No feedback provided." : "Enter a summary of the consultation, advice given, or next steps for the client..."}
                                    className={`w-full min-h-[120px] p-5 rounded-2xl border-2 transition-all text-sm placeholder:text-slate-300 ${isReadOnly
                                        ? 'bg-slate-50 border-slate-100 text-slate-600 focus:outline-none'
                                        : 'border-slate-100 focus:border-teal-500 focus:outline-none'
                                        }`}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-10">
                                {isReadOnly ? (
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition-all"
                                    >
                                        CLOSE WINDOW
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={!feedback.trim() || isSubmitting}
                                            onClick={() => onConfirm(feedback)}
                                            className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg ${!feedback.trim() || isSubmitting
                                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                                                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200 active:scale-[0.98]'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    COMPLETE & SUBMIT
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default CompleteAppointmentModal
