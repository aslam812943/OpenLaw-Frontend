'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { fetchBookings } from '../../../service/adminService';
import { ReusableTable, Column } from '@/components/admin/shared/ReusableTable';
import { FilterBar } from '@/components/admin/shared/ReusableFilterBar';
import Pagination from '@/components/common/Pagination';

interface AdminBooking {
    id: string;
    userName: string;
    lawyerName: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    adminCommission: number;
    lawyerEarnings: number;
    status: string;
    paymentStatus: string;
    refundAmount?: number;
    refundStatus?: string;
    createdAt?: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const limit = 10;

    const loadBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchBookings(currentPage, limit, statusFilter, searchTerm, dateFilter);
            if (response.success) {
                setBookings(response.data.bookings);
                setTotal(response.data.total);
            }
        } catch (error: unknown) {
            console.log("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchTerm, dateFilter]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);





    const columns: Column<AdminBooking>[] = [
        {
            header: "Date",
            render: (booking) => (
                <div className="flex flex-col">
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                    <span className="text-xs text-slate-500">{booking.startTime} - {booking.endTime}</span>
                </div>
            )
        },
        { header: "User", accessor: "userName" },
        { header: "Lawyer", accessor: "lawyerName" },
        {
            header: "Fee",
            render: (booking) => <span className="font-semibold text-slate-200">₹{booking.consultationFee}</span>
        },
        {
            header: "Commission",
            render: (booking) => (
                <div className="flex flex-col">
                    <span className="font-bold text-emerald-400">₹{booking.adminCommission.toFixed(2)}</span>
                    {booking.status === 'cancelled' && booking.adminCommission > 0 && <span className="text-[9px] text-slate-500 font-medium">Retention</span>}
                </div>
            )
        },
        {
            header: "Lawyer Earned",
            render: (booking) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-300">₹{booking.lawyerEarnings.toFixed(2)}</span>
                    {booking.status === 'cancelled' && booking.lawyerEarnings > 0 && <span className="text-[9px] text-slate-500 font-medium">Retention</span>}
                </div>
            )
        },
        {
            header: "Status",
            render: (booking) => {
                const colors: Record<string, string> = {
                    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                    confirmed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                    completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                    cancelled: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                    rejected: "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                };
                return (
                    <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase tracking-wider ${colors[booking.status] || "bg-gray-500/10 text-gray-500 border border-gray-500/20"}`}>
                            {booking.status}
                        </span>
                        {booking.status === 'cancelled' && booking.refundStatus === 'partial' && (
                            <span className="text-[9px] text-rose-400 font-medium">Partial Refund (70%)</span>
                        )}
                        {booking.status === 'cancelled' && booking.refundStatus === 'full' && (
                            <span className="text-[9px] text-emerald-400 font-medium">Full Refund (100%)</span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Payment",
            render: (booking) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${booking.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {booking.paymentStatus.toUpperCase()}
                </span>
            )
        }
    ];



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

    const handleDate = useCallback((value: string) => {
        setDateFilter(prev => {
            if (prev !== value) setCurrentPage(1);
            return value;
        });
    }, []);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Booking Management</h1>
                        <p className="text-slate-400 mt-1 text-sm font-medium">Monitor all consultations and track platform commissions.</p>
                    </div>
                </div>

                <FilterBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilter}
                    onDateChange={handleDate}
                    initialSearch={searchTerm}
                    initialFilter={statusFilter}
                    initialDate={dateFilter}
                    variant="dark"
                    filterOptions={[
                        { label: 'Confirmed', value: 'confirmed' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' },
                    ]}
                    placeholder="Search by user or lawyer name..."
                />

                <div className="rounded-2xl overflow-hidden transition-all duration-300">
                    <ReusableTable
                        columns={columns}
                        data={bookings}
                        isLoading={loading}
                        emptyMessage={(statusFilter || searchTerm || dateFilter) ? "No bookings match your search criteria." : "No bookings found."}
                        variant="dark"
                    />
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={total}
                    limit={limit}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
