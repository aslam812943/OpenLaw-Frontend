'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { X, Calendar, Clock, Send, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getallslots, setFollowUp, Slot } from '@/service/lawyerService'
import { toast } from 'sonner'

interface FollowUpSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    lawyerId?: string;
    onSuccess: () => void;
    feedback?: string;
}

const FollowUpSelectionModal: React.FC<FollowUpSelectionModalProps> = ({
    isOpen,
    onClose,
    appointmentId,
    lawyerId,
    onSuccess,
    feedback
}) => {
    const [followUpType, setFollowUpType] = useState<'specific' | 'deadline'>('specific')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [slots, setSlots] = useState<Slot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    useEffect(() => {
        const fetchSlots = async () => {
            if (!isOpen || !lawyerId) return;
            setLoadingSlots(true);
            try {
                const res = await getallslots(lawyerId);
                if (res.success) {
                    setSlots(res.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [isOpen, lawyerId]);

    const availableDates = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dates = Array.from(new Set(
            slots.filter((s: Slot) => {
                if (s.isBooked) return false;
                const slotDate = new Date(s.date);
                slotDate.setHours(0, 0, 0, 0);
                return slotDate >= today;
            }).map((s: Slot) => s.date)
        ));
        return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [slots]);


    const slotsForSelectedDate = useMemo(() => {
        return slots.filter((s: Slot) => s.date === date && !s.isBooked);
    }, [slots, date]);

    const handleSubmit = async () => {
        if (followUpType === 'specific' && (!date || !time)) {
            toast.error('Please select both date and time')
            return
        }
        if (followUpType === 'deadline' && !date) {
            toast.error('Please select a deadline date')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await setFollowUp(appointmentId, followUpType, date, time, feedback)
            if (res.success) {
                toast.success('Consultation completed with follow-up')
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || 'Failed to set follow-up')
            }
        } catch (error) {
            toast.error('An error occurred while setting follow-up')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
                    >
                        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="text-lg font-bold">Set Follow-up Consultation</h3>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex p-1 bg-slate-100 rounded-2xl">
                                <button
                                    onClick={() => setFollowUpType('specific')}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${followUpType === 'specific' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Specific Date/Time
                                </button>
                                <button
                                    onClick={() => setFollowUpType('deadline')}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${followUpType === 'deadline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Flexible (Deadline)
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loadingSlots ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        {followUpType === 'specific' ? (
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Available Date</label>
                                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                                        {availableDates.length > 0 ? (
                                                            availableDates.map((d) => (
                                                                <button
                                                                    key={d}
                                                                    onClick={() => setDate(d)}
                                                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${date === d ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'}`}
                                                                >
                                                                    {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="w-full text-center py-4 bg-slate-50 rounded-2xl text-slate-400 text-xs italic">
                                                                No available dates found. Please update your schedule.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {date && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Time Slot</label>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {slotsForSelectedDate.map((s: Slot) => (
                                                                <button
                                                                    key={s.id}
                                                                    onClick={() => setTime(s.startTime)}
                                                                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${time === s.startTime ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-200'}`}
                                                                >
                                                                    {s.startTime}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex gap-3">
                                                    <AlertCircle className="w-5 h-5 text-teal-600 shrink-0" />
                                                    <p className="text-xs text-teal-800 leading-relaxed font-medium">
                                                        Client will be able to book any of your available slots before the deadline date you select.
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Booking Deadline</label>
                                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                                        {availableDates.length > 0 ? (
                                                            availableDates.map((d) => (
                                                                <button
                                                                    key={d}
                                                                    onClick={() => setDate(d)}
                                                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${date === d ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'}`}
                                                                >
                                                                    {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="w-full text-center py-4 bg-slate-50 rounded-2xl text-slate-400 text-xs italic">
                                                                No available dates found. Please update your schedule.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || (followUpType === 'specific' && (!date || !time)) || (followUpType === 'deadline' && !date)}
                                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${isSubmitting || (followUpType === 'specific' && (!date || !time)) || (followUpType === 'deadline' && !date) ? 'bg-slate-300 text-white cursor-not-allowed shadow-none' : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-teal-100'}`}
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        SET FOLLOW-UP & COMPLETE
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}


export default FollowUpSelectionModal
