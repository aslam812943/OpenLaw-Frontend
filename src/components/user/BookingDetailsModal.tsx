'use client'

import React from 'react'
import { X, CheckCircle, FileText, User, Calendar, Clock, CreditCard, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Appointment {
    id: string;
    lawyerName?: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    description?: string;
    lawyerFeedback?: string;
    status: string;
    cancellationReason?: string;
}

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    isOpen,
    onClose,
    appointment
}) => {
    if (!appointment) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-teal-600 bg-teal-50 border-teal-100';
            case 'completed': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'rejected': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

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
                                <FileText className="w-6 h-6 text-teal-400" />
                                <h2 className="text-xl font-bold tracking-tight">Booking Details</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-h-[80vh] overflow-y-auto">
                            {/* Appointment Details Summary */}
                            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <User className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Lawyer</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.lawyerName || 'N/A'}</p>
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
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Time Slot</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.startTime} - {appointment.endTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <CreditCard className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Consultation Fee</p>
                                            <p className="text-sm font-bold text-slate-900">₹{appointment.consultationFee}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description from Client */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Your Description</h3>
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-xl text-sm text-slate-600">
                                    {appointment.description || 'No description provided.'}
                                </div>
                            </div>

                            {/* Cancellation Reason if any */}
                            {appointment.cancellationReason && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-4 h-4 text-rose-400" />
                                        <h3 className="text-xs uppercase font-extrabold tracking-widest text-rose-400">Cancellation Reason</h3>
                                    </div>
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-700">
                                        {appointment.cancellationReason}
                                    </div>
                                </div>
                            )}

                            {/* Lawyer Feedback */}
                            {appointment.status === 'completed' && (
                                <div className="space-y-3 mt-8">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-teal-600" />
                                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Lawyer's Feedback & Notes</h3>
                                    </div>
                                    <div className="w-full p-6 rounded-2xl bg-teal-50 border border-teal-100 text-sm text-slate-700 leading-relaxed shadow-sm">
                                        {appointment.lawyerFeedback ? (
                                            <p className="italic font-medium text-slate-700">"{appointment.lawyerFeedback}"</p>
                                        ) : (
                                            <p className="text-slate-400 italic">No feedback provided yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 mt-10">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default BookingDetailsModal
