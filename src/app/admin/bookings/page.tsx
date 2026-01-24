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
        } catch (error) {
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
            render: (booking) => <span className="font-semibold text-slate-900">₹{booking.consultationFee}</span>
        },
        {
            header: "Commission",
            render: (booking) => <span className="font-bold text-teal-600">₹{booking.adminCommission.toFixed(2)}</span>
        },
        {
            header: "Lawyer Earned",
            render: (booking) => <span className="font-medium text-slate-700">₹{booking.lawyerEarnings.toFixed(2)}</span>
        },
        {
            header: "Status",
            render: (booking) => {
                const colors: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-700",
                    confirmed: "bg-blue-100 text-blue-700",
                    completed: "bg-emerald-100 text-emerald-700",
                    cancelled: "bg-rose-100 text-rose-700",
                    rejected: "bg-slate-100 text-slate-700"
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[booking.status] || "bg-gray-100 text-gray-700"}`}>
                        {booking.status}
                    </span>
                );
            }
        },
        {
            header: "Payment",
            render: (booking) => (
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
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
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking Management</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Monitor all consultations and track platform commissions.</p>
                    </div>
                </div>

                <FilterBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilter}
                    onDateChange={handleDate}
                    initialSearch={searchTerm}
                    initialFilter={statusFilter}
                    initialDate={dateFilter}
                    filterOptions={[
                        { label: 'Confirmed', value: 'confirmed' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' },
                    ]}
                    placeholder="Search by user or lawyer name..."
                />

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all duration-300">
                    <ReusableTable
                        columns={columns}
                        data={bookings}
                        isLoading={loading}
                        emptyMessage={(statusFilter || searchTerm || dateFilter) ? "No bookings match your search criteria." : "No bookings found."}
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
