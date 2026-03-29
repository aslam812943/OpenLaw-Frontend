'use client';

import React, { useEffect, useState } from 'react';
import { fetchPayments, PaymentFilters } from '../../../service/adminService';
import { ReusableTable, Column } from '@/components/admin/shared/ReusableTable';
import Pagination from '@/components/common/Pagination';

interface Payment {
    id: string;
    lawyerName: string;
    userName: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    transactionId: string;
    date: string;
    paymentMethod: string;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<PaymentFilters>({
        page: 1,
        limit: 10,
        search: '',
        status: 'all',
        type: 'all',
        startDate: '',
        endDate: ''
    });

    const loadPayments = async () => {
        setLoading(true);
        try {
            const data = await fetchPayments(filters);
            setPayments(data.data.payments);
            setTotal(data.data.total);
        } catch (error: unknown) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const columns: Column<Payment>[] = [
        {
            header: "Date",
            render: (payment) => <span className="text-slate-400">{new Date(payment.date).toLocaleDateString()}</span>
        },

        {
            header: "Transaction ID",
            render: (payment) => <span className="text-emerald-400 font-mono text-sm">{payment.transactionId}</span>
        },
        {
            header: "Type",
            render: (payment) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${payment.type === 'subscription' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                    {payment.type.toUpperCase()}
                </span>
            )
        },
        { header: "User", accessor: "userName", render: (p) => <span className="text-slate-200">{p.userName || '—'}</span> },
        { header: "Lawyer", accessor: "lawyerName", render: (p) => <span className="text-slate-200">{p.lawyerName || '—'}</span> },
        {
            header: "Amount",
            render: (payment) => (
                <span className="font-bold text-white">
                    ₹{payment.amount}
                </span>
            )
        },
        {
            header: "Status",
            render: (payment) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${payment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    payment.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {payment.status.toUpperCase()}
                </span>
            )
        }
    ];

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-white">Payments & Transactions</h1>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 border border-white/10 shadow-2xl">
                <input
                    type="text"
                    name="search"
                    placeholder="Search Transaction ID..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="bg-white/5 text-slate-200 p-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 text-sm transition-all"
                />
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="bg-white/5 text-slate-200 p-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm appearance-none cursor-pointer hover:bg-white/10 transition-all"
                >
                    <option value="all" className="bg-slate-900">All Types</option>
                    <option value="booking" className="bg-slate-900">Booking</option>
                    <option value="subscription" className="bg-slate-900">Subscription</option>
                </select>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="bg-white/5 text-slate-200 p-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm appearance-none cursor-pointer hover:bg-white/10 transition-all"
                >
                    <option value="all" className="bg-slate-900">All Status</option>
                    <option value="completed" className="bg-slate-900">Completed</option>
                    <option value="pending" className="bg-slate-900">Pending</option>
                    <option value="failed" className="bg-slate-900">Failed</option>
                    <option value="refunded" className="bg-slate-900">Refunded</option>
                </select>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="bg-white/5 text-slate-200 p-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer hover:bg-white/10 transition-all"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="bg-white/5 text-slate-200 p-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer hover:bg-white/10 transition-all"
                />
            </div>

            {/* Table */}
            <ReusableTable
                columns={columns}
                data={payments}
                isLoading={loading}
                emptyMessage="No payments found."
                variant="dark"
            />

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={filters.page || 1}
                    totalItems={total}
                    limit={filters.limit || 10}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
