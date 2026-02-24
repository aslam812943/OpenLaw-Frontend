"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getUserAppointments, cancelAppointment, Appointment } from '../../../service/userService';
import CancelAppointmentModal from '../../../components/CancelAppointmentModal';
import BookingDetailsModal from '../../../components/user/BookingDetailsModal';
import Pagination from '../../../components/common/Pagination';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, User, AlertCircle, CalendarX, FileText, CheckCircle, MessageSquare } from 'lucide-react';
import { showToast } from '../../../utils/alerts';
import { FilterBar } from '@/components/admin/shared/ReusableFilterBar';
import { getChatRoom } from '@/service/chatService';

const UserAppointmentsPage = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isRescheduleConfirmOpen, setIsRescheduleConfirmOpen] = useState(false);
    const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const limit = 5;

    const fetchAppointments = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            const data = await getUserAppointments(page, limit, statusFilter, searchTerm, dateFilter);
            setAppointments(data.data?.appointments || []);
            setTotalItems(data.data?.total || 0);
        } catch (error) {
            showToast("error", "Failed to fetch appointments. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchTerm, dateFilter]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(prev => {
            if (prev !== value) setCurrentPage(1);
            return value;
        });
    }, []);

    const handleFilter = useCallback((value: string) => {
        setStatusFilter(prev => {
            if (prev !== value) setCurrentPage(1);
            return value;
        });
    }, []);

    const handleDateChange = useCallback((value: string) => {
        setDateFilter(prev => {
            if (prev !== value) setCurrentPage(1);
            return value;
        });
    }, []);

    useEffect(() => {
        fetchAppointments(currentPage);
    }, [currentPage, fetchAppointments]);

    const handleCancelClick = (id: string) => {
        setSelectedAppointmentId(id);
        setIsModalOpen(true);
    };

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
    };

    const handleConfirmCancel = async (reason: string) => {
        if (!selectedAppointmentId) return;

        try {
            await cancelAppointment(selectedAppointmentId, reason);
            showToast("success", "Appointment cancelled successfully.");
            fetchAppointments(currentPage);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to cancel appointment. Please try again.";
            showToast("error", errorMessage);
        } finally {
            setIsModalOpen(false);
            setSelectedAppointmentId(null);
        }
    };

    const handleChat = async (lawyerId: string, bookingId: string) => {
        try {
            const response = await getChatRoom({ lawyerId, bookingId });
            if (response.success) {
                router.push(`/user/chat/${response.data.id}`);
            }
        } catch (error) {
            showToast("error", "Failed to initiate chat");
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
                    <p className="text-slate-500 mt-2">Manage your upcoming and past legal consultations.</p>
                </div>

                <div className="mb-6">
                    <FilterBar
                        onSearch={handleSearch}
                        onFilterChange={handleFilter}
                        onDateChange={handleDateChange}
                        initialSearch={searchTerm}
                        initialFilter={statusFilter}
                        initialDate={dateFilter}
                        filterOptions={[
                            { label: "Confirmed", value: "confirmed" },
                            { label: "Follow-up", value: "follow-up" },
                            { label: "Pending", value: "pending" },
                            { label: "Completed", value: "completed" },
                            { label: "Cancelled", value: "cancelled" },
                        ]}
                        placeholder="Search by lawyer name..."
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-slate-200">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <CalendarX className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">
                            {(statusFilter || searchTerm || dateFilter) ? "No Matching Appointments" : "No Appointments Yet"}
                        </h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            {(statusFilter || searchTerm || dateFilter)
                                ? "Try adjusting your filters or search terms to find what you're looking for."
                                : "You haven't booked any consultations. Find a lawyer and book your first session today."}
                        </p>
                        {!(statusFilter || searchTerm || dateFilter) && (
                            <button
                                onClick={() => router.push('/user/lawyers')}
                                className="mt-6 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                            >
                                Find a Lawyer
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Lawyer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Date & Time
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Booking Status
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appointments.map((appointment) => {
                                            const isCancellable = appointment.status === 'pending' || appointment.status === 'confirmed';
                                            const statusStyles =
                                                appointment.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                                    appointment.status === 'follow-up' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                        appointment.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                            appointment.status === 'rejected' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                                'bg-amber-50 text-amber-700 border-amber-200';

                                            return (
                                                <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div
                                                            onClick={() => router.push(`/user/lawyers/${appointment.lawyerId}`)}
                                                            className="flex items-center gap-2 cursor-pointer group"
                                                        >
                                                            <User size={16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                                                            <span className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                                                {appointment.lawyerName || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                                                <Calendar size={14} className="text-teal-500" />
                                                                <span className="font-medium">{appointment.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Clock size={12} className="text-teal-500" />
                                                                <span>{appointment.startTime} - {appointment.endTime}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>


                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleViewDetails(appointment)}
                                                                className="p-1.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-all"
                                                                title="View Details"
                                                            >
                                                                <FileText size={16} />
                                                            </button>
                                                            {['confirmed', 'completed', 'pending', 'follow-up'].includes(appointment.status) && (
                                                                <button
                                                                    onClick={() => handleChat(appointment.lawyerId, appointment.id)}
                                                                    className="p-1.5 text-teal-600 bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-all"
                                                                    title="Message Lawyer"
                                                                >
                                                                    <MessageSquare size={16} />
                                                                </button>
                                                            )}
                                                            {isCancellable && (
                                                                <button
                                                                    onClick={() => handleCancelClick(appointment.id)}
                                                                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            {(() => {
                                                                const appointmentDateTime = new Date(`${appointment.date}T${appointment.startTime}`);
                                                                const now = new Date();
                                                                const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                                                                const isReschedulable = appointment.status === 'confirmed' && diffInHours >= 24 && (appointment.rescheduleCount || 0) < 1;

                                                                return isReschedulable && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setAppointmentToReschedule(appointment);
                                                                            setIsRescheduleConfirmOpen(true);
                                                                        }}
                                                                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                                                    >
                                                                        Reschedule
                                                                    </button>
                                                                );
                                                            })()}
                                                            {appointment.followUpStatus === 'pending' && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (appointment.followUpType === 'specific') {
                                                                            router.push(`/user/lawyers/${appointment.lawyerId}?date=${appointment.followUpDate}&time=${appointment.followUpTime}&parentBookingId=${appointment.id}`);
                                                                        } else if (appointment.followUpType === 'deadline') {
                                                                            router.push(`/user/lawyers/${appointment.lawyerId}?deadline=${appointment.followUpDate}&parentBookingId=${appointment.id}`);
                                                                        }

                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-semibold text-teal-600 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all"
                                                                >
                                                                    Book Follow-up
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {appointments.length > 0 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    limit={limit}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}

                <CancelAppointmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmCancel}
                />

                <BookingDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    appointment={selectedAppointment}
                    currentUserId={user.id || undefined}
                    onSuccess={() => fetchAppointments(currentPage)}
                />

                {/* Reschedule Confirmation Modal */}
                {isRescheduleConfirmOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">Reschedule Appointment</h3>
                                <button onClick={() => setIsRescheduleConfirmOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-bold">Important Notice</p>
                                        <p className="mt-1">You can only reschedule this appointment **one time**. Are you sure you want to proceed with rescheduling?</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsRescheduleConfirmOpen(false)}
                                        className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (appointmentToReschedule) {
                                                router.push(`/user/lawyers/${appointmentToReschedule.lawyerId}?rescheduleBookingId=${appointmentToReschedule.id}`);
                                            }
                                        }}
                                        className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                    >
                                        Yes, Reschedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAppointmentsPage;
