"use client";

import React, { useEffect, useState } from 'react';
import { getUserAppointments, cancelAppointment } from '../../../service/userService';
import CancelAppointmentModal from '../../../components/CancelAppointmentModal';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, MapPin, User, AlertCircle, CalendarX } from 'lucide-react';

interface Appointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    consultationFee: number;
    description?: string;
    cancellationReason?: string;
    lawyerId: string;
    lawyerName?: string;
}

const UserAppointmentsPage = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            const data = await getUserAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancelClick = (id: string) => {
        setSelectedAppointmentId(id);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async (reason: string) => {
        if (!selectedAppointmentId) return;

        try {
            await cancelAppointment(selectedAppointmentId, reason);
            fetchAppointments();
        } catch (error) {
            console.error("Error cancelling appointment:", error);
        } finally {
            setIsModalOpen(false);
            setSelectedAppointmentId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
                    <p className="text-slate-500 mt-2">Manage your upcoming and past legal consultations.</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <CalendarX className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No Appointments Yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't booked any consultations. Find a lawyer and book your first session today.</p>
                        <button
                            onClick={() => router.push('/user/lawyers')}
                            className="mt-6 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                        >
                            Find a Lawyer
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((appointment) => {
                            const isCancellable = appointment.status === 'pending' || appointment.status === 'confirmed';
                            const statusStyles =
                                appointment.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                    appointment.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100';

                            return (
                                <div key={appointment.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">

                                        {/* Left: Main Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between md:justify-start gap-4">
                                                <div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles} mb-3`}>
                                                        {appointment.status}
                                                    </span>
                                                    {appointment.lawyerName && (
                                                        <h3
                                                            onClick={() => router.push(`/user/lawyers/${appointment.lawyerId}`)}
                                                            className="text-xl font-bold text-slate-900 hover:text-teal-600 cursor-pointer transition-colors flex items-center gap-2 group"
                                                        >
                                                            {appointment.lawyerName}
                                                            <User size={16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                                                        </h3>
                                                    )}
                                                    <p className="text-sm text-slate-500 mt-1">Legal Consultation</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                                    <Calendar size={16} className="text-teal-600" />
                                                    <span className="font-medium">{appointment.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                                    <Clock size={16} className="text-teal-600" />
                                                    <span className="font-medium">{appointment.startTime} - {appointment.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                                    <DollarSign size={16} className="text-teal-600" />
                                                    <span className="font-medium">₹{appointment.consultationFee}</span>
                                                </div>
                                            </div>

                                            {appointment.description && (
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Your Note</p>
                                                    <p className="text-sm text-slate-700 italic">"{appointment.description}"</p>
                                                </div>
                                            )}

                                            {appointment.cancellationReason && (
                                                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 flex gap-3 text-rose-800 text-sm">
                                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-bold text-xs uppercase mb-1">Reason for Cancellation</p>
                                                        <p>{appointment.cancellationReason}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-start justify-end md:min-w-[150px]">
                                            {isCancellable && (
                                                <button
                                                    onClick={() => handleCancelClick(appointment.id)}
                                                    className="px-4 py-2 text-sm font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <CancelAppointmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmCancel}
                />
            </div>
        </div>
    );
};

export default UserAppointmentsPage;
