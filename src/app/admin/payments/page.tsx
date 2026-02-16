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
        } catch (error) {
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
            render: (payment) => <span className="text-gray-600">{new Date(payment.date).toLocaleDateString()}</span>
        },
     
        {
            header: "Transaction ID",
            render: (payment) => <span className="text-teal-600 font-mono text-sm">{payment.transactionId}</span>
        },
        {
            header: "Type",
            render: (payment) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${payment.type === 'subscription' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {payment.type.toUpperCase()}
                </span>
            )
        },
        { header: "User", accessor: "userName", render: (p) => <span className="text-gray-900">{p.userName || 'N/A'}</span> },
        { header: "Lawyer", accessor: "lawyerName", render: (p) => <span className="text-gray-900">{p.lawyerName || 'N/A'}</span> },
        {
            header: "Amount",
            render: (payment) => (
                <span className="font-medium text-gray-900">
                    {payment.amount}
                </span>
            )
        },
        {
            header: "Status",
            render: (payment) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {payment.status.toUpperCase()}
                </span>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Payments & Transactions</h1>

            {/* Filters */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search Transaction ID..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="all">All Types</option>
                    <option value="booking">Booking</option>
                    <option value="subscription">Subscription</option>
                </select>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {/* Table */}
            <ReusableTable
                columns={columns}
                data={payments}
                isLoading={loading}
                emptyMessage="No payments found."
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
