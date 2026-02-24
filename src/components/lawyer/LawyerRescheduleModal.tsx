'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { X, Calendar, Clock, Send, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getallslots, rescheduleAppointment, Slot } from '@/service/lawyerService'
import { showToast } from '@/utils/alerts'

interface LawyerRescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    lawyerId: string;
    onSuccess: () => void;
}

const LawyerRescheduleModal: React.FC<LawyerRescheduleModalProps> = ({
    isOpen,
    onClose,
    appointmentId,
    lawyerId,
    onSuccess
}) => {
    const [date, setDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
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
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [isOpen, lawyerId]);

    const formatTime12h = (time24: string) => {
        if (!time24) return "";
        try {
            const [hoursStr, minutesStr] = time24.split(":");
            let hours = parseInt(hoursStr, 10);
            const minutes = minutesStr;
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours}:${minutes} ${ampm}`;
        } catch (e) {
            return time24;
        }
    };

    const isPastSlot = (date: string, startTime: string) => {
        try {
            const now = new Date();
            const [year, month, day] = date.split('-').map(Number);
            const [hours, minutes] = startTime.split(':').map(Number);
            const slotDateTime = new Date(year, month - 1, day, hours, minutes);
            return slotDateTime <= now;
        } catch (e) {
            return false;
        }
    };

    const availableDates = useMemo(() => {
        const dates = Array.from(new Set(
            slots.filter((s: Slot) => {
                if (s.isBooked) return false;
                return !isPastSlot(s.date, s.startTime);
            }).map((s: Slot) => s.date)
        ));
        return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [slots]);


    const slotsForSelectedDate = useMemo(() => {
        return slots.filter((s: Slot) => s.date === date && !s.isBooked && !isPastSlot(s.date, s.startTime));
    }, [slots, date]);

    const handleReschedule = async () => {
        if (!selectedSlot) {
            showToast('error', 'Please select a time slot')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await rescheduleAppointment(appointmentId, selectedSlot.id)
            if (res.success) {
                showToast('success', 'Appointment rescheduled successfully')
                onSuccess()
                onClose()
            } else {
                showToast('error', res.message || 'Failed to reschedule appointment')
            }
        } catch (error) {
            showToast('error', 'An error occurred while rescheduling')
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
                            <h3 className="text-lg font-bold">Reschedule Appointment</h3>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs text-amber-900 font-bold uppercase tracking-tight">One-Time Rescheduling Limit</p>
                                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                        This appointment can only be rescheduled once. The client will be notified of this change immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loadingSlots ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-teal-600" />
                                                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select New Date</label>
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                                {availableDates.length > 0 ? (
                                                    availableDates.map((d) => (
                                                        <button
                                                            key={d}
                                                            onClick={() => {
                                                                setDate(d)
                                                                setSelectedSlot(null)
                                                            }}
                                                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${date === d ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'}`}
                                                        >
                                                            {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="w-full text-center py-4 bg-slate-50 rounded-2xl text-slate-400 text-xs italic">
                                                        No available dates found in your schedule.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {date && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-teal-600" />
                                                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select New Time Slot</label>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {slotsForSelectedDate.length > 0 ? (
                                                        slotsForSelectedDate.map((s: Slot) => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setSelectedSlot(s)}
                                                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedSlot?.id === s.id ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-200'}`}
                                                            >
                                                                {formatTime12h(s.startTime)}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-full py-4 text-center bg-slate-50 rounded-xl text-[10px] text-slate-400 font-medium italic">
                                                            No future slots available for this date.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                onClick={handleReschedule}
                                disabled={isSubmitting || !selectedSlot}
                                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${isSubmitting || !selectedSlot ? 'bg-slate-300 text-white cursor-not-allowed shadow-none' : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-teal-100'}`}
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        CONFIRM RESCHEDULE
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

export default LawyerRescheduleModal
