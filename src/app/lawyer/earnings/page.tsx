'use client'

import React, { useEffect, useState } from 'react';
import { getLawyerEarnings, requestPayout, getPayoutHistory } from '@/service/lawyerService';
import { showToast } from '@/utils/alerts';
import { DollarSign, TrendingUp, Calendar, User, CheckCircle, XCircle, ArrowLeft, Wallet } from 'lucide-react';

interface Transaction {
    bookingId: string;
    date: string;
    userName: string;
    amount: number;
    commissionAmount: number;
    netAmount: number;
    status: string;
    paymentStatus: string;
}

interface EarningsData {
    totalEarnings: number;
    transactions: Transaction[];
    walletBalance: number;
    pendingBalance: number;
}

interface PayoutRequest {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
}

const EarningsPage = () => {
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);

    const fetchData = async () => {
        try {
            const [earningsData, historyData] = await Promise.all([
                getLawyerEarnings(),
                getPayoutHistory()
            ]);
            setEarnings(earningsData);
            setPayoutHistory(historyData);
        } catch (error) {
            showToast('error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            showToast('error', 'Please enter a valid amount');
            return;
        }
        if (amount > (earnings?.walletBalance || 0)) {
            showToast('error', 'Insufficient balance');
            return;
        }

        setWithdrawing(true);
        try {
            await requestPayout(amount);
            showToast('success', 'Withdrawal request submitted');
            setWithdrawModalOpen(false);
            setWithdrawAmount('');
            fetchData();
        } catch (error: any) {
            showToast('error', error.message || 'Withdrawal failed');
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50">
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-2xl">
                                <DollarSign className="text-emerald-700" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Earnings & Payouts</h1>
                                <p className="text-slate-500 mt-1">Track your revenue and manage withdrawals</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setWithdrawModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <DollarSign size={20} />
                            Withdraw Funds
                        </button>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <Wallet className="w-6 h-6 text-emerald-600" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Withdrawable Balance</p>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">
                                ₹{earnings?.walletBalance.toLocaleString() || 0}
                            </h2>
                            <p className="text-xs text-slate-400 mt-2">Available for immediate withdrawal</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-amber-600" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</p>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">
                                ₹{earnings?.pendingBalance.toLocaleString() || 0}
                            </h2>
                            <p className="text-xs text-slate-400 mt-2">Will be available after consultation completion</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-slate-100 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-slate-600" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Gross Earnings</p>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">
                                ₹{earnings?.totalEarnings.toLocaleString() || 0}
                            </h2>
                            <p className="text-xs text-slate-400 mt-2">Total gross income before platform fee</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Transactions List */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
                            </div>

                            <div className="flex-1 overflow-auto max-h-[500px]">
                                {!earnings || earnings.transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="p-6 bg-slate-50 rounded-full mb-4">
                                            <DollarSign size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No transactions yet</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-slate-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Client</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Fee</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Platform Fee</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {earnings.transactions.map((t) => (
                                                <tr key={t.bookingId} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{t.date}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-900 font-bold">{t.userName}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">₹{t.amount}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium text-amber-600">-₹{t.commissionAmount}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-extrabold text-emerald-600">₹{t.netAmount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900">Payout History</h3>
                            </div>

                            <div className="flex-1 overflow-auto max-h-[500px]">
                                {payoutHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="p-6 bg-slate-50 rounded-full mb-4">
                                            <Calendar size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">No payout requests yet</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-slate-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payoutHistory.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(p.requestDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">₹{p.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Withdraw Modal */}
            {withdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl scale-in-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Payout</h3>
                        <p className="text-slate-500 mb-6">Enter the amount you wish to withdraw to your bank account.</p>

                        <form onSubmit={handleWithdraw}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all font-bold text-xl text-slate-900"
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Max withdrawable: <span className="text-slate-600 font-bold">₹{earnings?.walletBalance.toLocaleString()}</span>
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setWithdrawModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={withdrawing}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg"
                                >
                                    {withdrawing ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarningsPage;
