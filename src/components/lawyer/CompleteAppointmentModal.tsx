'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, FileText, User, Calendar, Clock, CreditCard, ExternalLink, Image } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getChatRoom, getMessages, Message } from '@/service/chatService'
import ImageModal from '@/components/ui/ImageModal'
import FollowUpSelectionModal from './FollowUpSelectionModal'

const isImageUrl = (url: string): boolean => {
    if (!url) return false;
    return url.includes('cloudinary.com') &&
        (url.includes('/image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url));
};

interface Appointment {
    id: string;
    userId: string;
    userName: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    desctiption: string;
    status: string;
    lawyerFeedback?: string;
    bookingId?: string;
    lawyerId?: string;
    followUpType?: 'none' | 'specific' | 'deadline';
    followUpDate?: string;
    followUpTime?: string;
    followUpStatus?: 'none' | 'pending' | 'booked';
}


interface CompleteAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (feedback: string) => void;
    appointment: Appointment | null;
    isSubmitting: boolean;
    onSuccess?: () => void;
}

const CompleteAppointmentModal: React.FC<CompleteAppointmentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    appointment,
    isSubmitting,
    onSuccess
}) => {
    const isReadOnly = appointment?.status === 'completed' || appointment?.status === 'follow-up';
    const [feedback, setFeedback] = useState(appointment?.lawyerFeedback || '')
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentImageModal, setCurrentImageModal] = useState<string | null>(null);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [isFollowUpDone, setIsFollowUpDone] = useState(false);

    useEffect(() => {
        if (isOpen && appointment?.id) {
            setFeedback(appointment.lawyerFeedback || '');
            fetchCaseHistory();
        }
    }, [isOpen, appointment]);

    const fetchCaseHistory = async () => {
        if (!appointment?.id) return;
        setLoadingHistory(true);
        try {
            const roomRes = await getChatRoom({ bookingId: appointment.id, userId: appointment.userId });
            if (roomRes.success && roomRes.data.id) {
                const msgRes = await getMessages(roomRes.data.id, 'lawyer');
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

    const documents = messages.filter(m =>
        m.type === 'document' ||
        m.type === 'image' ||
        m.type === 'file' ||
        isImageUrl(m.content)
    );

    return (
        <>
            <AnimatePresence mode="wait">
                {isOpen && (
                    <div key="consultation-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
                        >
                            {/* Header */}
                            <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
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

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
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
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <FileText className="w-4 h-4 text-teal-600" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Booking Id</p>
                                                <p className="text-sm font-bold text-slate-900">{appointment.bookingId || 'N/A'}</p>
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

                                {/* Case History / Documents */}
                                <div className="mb-8 pt-8 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-teal-600" />
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Shared Documents & Media</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{documents.length} Items</span>
                                    </div>

                                    {loadingHistory ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-600"></div>
                                        </div>
                                    ) : documents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                            {documents.map((doc) => (
                                                <div key={doc.id} className="group relative flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-all">
                                                    <div
                                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 cursor-zoom-in group-hover:brightness-90 transition-all"
                                                        onClick={() => (doc.type === 'image' || isImageUrl(doc.content)) && setSelectedImage(doc.content || doc.fileUrl || '')}
                                                    >
                                                        {doc.type === 'image' || isImageUrl(doc.content) ? (
                                                            <img src={doc.content || doc.fileUrl} alt={doc.fileName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[11px] font-bold text-slate-900 truncate pr-6">{doc.fileName || 'Shared File'}</p>
                                                        <p className="text-[9px] text-slate-500 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-slate-400 hover:text-teal-600 transition-colors"
                                                        >
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-xs text-slate-400 font-medium">No documents shared during this consultation.</p>
                                        </div>
                                    )}
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

                                {/* Follow-up Details Summary (for lawyer) */}
                                {isReadOnly && appointment.followUpType && appointment.followUpType !== 'none' && (
                                    <div className="space-y-3 mt-8 pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-teal-600" />
                                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Proposed Follow-up</h3>
                                        </div>
                                        <div className="w-full p-6 rounded-2xl bg-teal-50 border border-teal-100 shadow-sm">
                                            <div className="flex flex-wrap gap-4">
                                                {appointment.followUpType === 'specific' && (
                                                    <>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-teal-100 text-xs font-bold text-teal-700">
                                                            <Calendar size={14} />
                                                            {appointment.followUpDate}
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-teal-100 text-xs font-bold text-teal-700">
                                                            <Clock size={14} />
                                                            {appointment.followUpTime}
                                                        </div>
                                                    </>
                                                )}
                                                {appointment.followUpType === 'deadline' && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-teal-100 text-xs font-bold text-teal-700">
                                                        <Clock size={14} />
                                                        Deadline: {appointment.followUpDate}
                                                    </div>
                                                )}
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase ${appointment.followUpStatus === 'booked' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                                    Status: {appointment.followUpStatus}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>

                            {/* Actions Footer */}
                            <div className="px-8 py-5 border-t border-slate-100 bg-white shrink-0 flex items-center gap-4">
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
                                            className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        {!isReadOnly && !isFollowUpDone && (
                                            <button
                                                disabled={!feedback.trim() || isSubmitting}
                                                onClick={() => setIsFollowUpModalOpen(true)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${!feedback.trim() || isSubmitting
                                                    ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                                    : 'border-teal-600 text-teal-600 hover:bg-teal-50 shadow-sm active:scale-[0.98]'
                                                    }`}
                                            >
                                                FOLLOW-UP
                                            </button>
                                        )}
                                        <button
                                            disabled={!feedback.trim() || isSubmitting}
                                            onClick={() => onConfirm(feedback)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg ${!feedback.trim() || isSubmitting
                                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                                                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200 active:scale-[0.98]'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    COMPLETE & SUBMIT
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div >
                    </div >
                )}
            </AnimatePresence >
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage || ''}
            />
            {appointment && (
                <FollowUpSelectionModal
                    isOpen={isFollowUpModalOpen}
                    onClose={() => setIsFollowUpModalOpen(false)}
                    appointmentId={appointment.id}
                    lawyerId={appointment.lawyerId}
                    onSuccess={() => {
                        setIsFollowUpDone(true);
                        onClose(); // Close the main modal as it's now completed
                        if (onSuccess) onSuccess(); // Trigger refresh in parent
                    }}
                    feedback={feedback}
                />
            )}


        </>
    )
}

export default CompleteAppointmentModal
