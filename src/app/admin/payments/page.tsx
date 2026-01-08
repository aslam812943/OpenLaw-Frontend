'use client';

import React, { useEffect, useState } from 'react';
import { fetchPayments, PaymentFilters } from '../../../service/adminService';

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

    const totalPages = Math.ceil(total / (filters.limit || 10));

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
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Lawyer</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-400">No payments found.</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-750 transition">
                                        <td className="p-4 text-gray-300">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-teal-400 font-mono text-sm">{payment.transactionId}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${payment.type === 'subscription' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                                                }`}>
                                                {payment.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">{payment.userName || 'N/A'}</td>
                                        <td className="p-4 text-gray-300">{payment.lawyerName}</td>
                                        <td className="p-4 text-white font-medium">
                                            {payment.amount} {payment.currency.toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${payment.status === 'completed' ? 'bg-green-900 text-green-200' :
                                                    payment.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                                                        'bg-red-900 text-red-200'
                                                }`}>
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-gray-400">
                    Showing {payments.length} of {total} results
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange((filters.page || 1) - 1)}
                        disabled={(filters.page || 1) <= 1}
                        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-300">Page {filters.page} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange((filters.page || 1) + 1)}
                        disabled={(filters.page || 1) >= totalPages}
                        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
