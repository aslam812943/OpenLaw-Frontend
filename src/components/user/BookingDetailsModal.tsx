'use client'

import React, { useEffect, useState } from 'react'
import { X, CheckCircle, FileText, User, Calendar, Clock, CreditCard, AlertCircle, Hash, Image, Download, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getChatRoom, getMessages, Message } from '@/service/chatService'

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
    paymentId?: string;
    bookingId?: string;
}

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    currentUserId?: string;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    isOpen,
    onClose,
    appointment,
    currentUserId
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (isOpen && appointment?.id) {
            fetchCaseHistory();
        }
    }, [isOpen, appointment?.id]);

    const fetchCaseHistory = async () => {
        if (!appointment?.id) return;
        setLoadingHistory(true);
        try {
            const roomRes = await getChatRoom({ bookingId: appointment.id });
            if (roomRes.success && roomRes.data.id) {
                const msgRes = await getMessages(roomRes.data.id);
                if (msgRes.success) {
                    setMessages(msgRes.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch case history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    if (!appointment) return null;

    const documents = messages.filter(m => m.type === 'document' || m.type === 'image' || m.type === 'file');

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
                                        <Hash className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Booking Id</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.bookingId || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <CreditCard className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Payment Id</p>
                                            <p className="text-sm font-bold text-slate-900">{appointment.paymentId || 'N/A'}</p>
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

                            {/* Case History / Documents */}
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-teal-600" />
                                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Consultation Documents & Media</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{documents.length} Items</span>
                                </div>

                                {loadingHistory ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
                                    </div>
                                ) : documents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="group relative flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-md transition-all">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                                                    {doc.type === 'image' ? (
                                                        <img src={doc.fileUrl} alt={doc.fileName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-900 truncate pr-6">{doc.fileName || 'Shared File'}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a
                                                        href={doc.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400 font-medium">No documents shared during this consultation.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lawyer Feedback */}
                            {appointment.status === 'completed' && (
                                <div className="space-y-3 mt-8 pt-8 border-t border-slate-100">
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
