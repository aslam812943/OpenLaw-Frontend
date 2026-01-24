"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { getUserAppointments, cancelAppointment } from '../../../service/userService';
import CancelAppointmentModal from '../../../components/CancelAppointmentModal';
import BookingDetailsModal from '../../../components/user/BookingDetailsModal';
import Pagination from '../../../components/common/Pagination';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, User, AlertCircle, CalendarX, FileText, CheckCircle } from 'lucide-react';
import { showToast } from '../../../utils/alerts';
import { FilterBar } from '@/components/admin/shared/ReusableFilterBar';

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
    refundAmount?: number;
    refundStatus?: string;
    lawyerFeedback?: string;
}

const UserAppointmentsPage = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);


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
                                                Fee
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                Details
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
                                                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                                                            <DollarSign size={14} />
                                                            <span>₹{appointment.consultationFee}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            {appointment.description && (
                                                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                                                    <FileText size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                                    <span className="line-clamp-2">{appointment.description}</span>
                                                                </div>
                                                            )}
                                                            {appointment.cancellationReason && (
                                                                <div className="flex items-start gap-2 text-xs text-rose-600 mt-1">
                                                                    <AlertCircle size={12} className="mt-0.5 shrink-0" />
                                                                    <span className="line-clamp-2">{appointment.cancellationReason}</span>
                                                                </div>
                                                            )}
                                                            {(appointment.status === 'cancelled' || appointment.status === 'rejected') && appointment.refundAmount !== undefined && appointment.refundAmount > 0 && (
                                                                <div className="flex items-start gap-2 text-xs text-teal-600 mt-1 font-medium italic">
                                                                    <DollarSign size={12} className="mt-0.5 shrink-0" />
                                                                    <span>
                                                                        ₹{appointment.refundAmount} {appointment.refundStatus && appointment.refundStatus !== 'none' ? `${appointment.refundStatus} refund` : 'refunded'} to your account
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                            {isCancellable && (
                                                                <button
                                                                    onClick={() => handleCancelClick(appointment.id)}
                                                                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                                >
                                                                    Cancel
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
                />
            </div>
        </div>
    );
};

export default UserAppointmentsPage;
