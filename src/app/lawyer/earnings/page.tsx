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
            const [earningsRes, historyRes] = await Promise.all([
                getLawyerEarnings(),
                getPayoutHistory()
            ]);
            if (earningsRes?.success) setEarnings(earningsRes.data);
            if (historyRes?.success) setPayoutHistory(historyRes.data);
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
                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pl-2">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Earnings & Payouts</h1>
                            <p className="text-slate-500 text-lg">Track your revenue and manage withdrawals</p>
                        </div>
                    </div>

                    {/* Hero Section - Dark Card */}
                    <div className="mb-10 bg-[#1e293b] rounded-[2rem] p-10 relative overflow-hidden shadow-2xl text-white">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Wallet size={250} className="text-white" />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

                            {/* Withdrawable Balance */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">Withdrawable Balance</span>
                                </div>
                                <h2 className="text-5xl font-bold text-white tracking-tight mb-2">
                                    ₹{earnings?.walletBalance.toLocaleString() || 0}
                                </h2>
                                <p className="text-slate-400 text-sm mb-8">Available for immediate withdrawal</p>

                                <button
                                    onClick={() => setWithdrawModalOpen(true)}
                                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95"
                                >
                                    <DollarSign size={20} />
                                    Withdraw Funds
                                </button>
                            </div>

                            {/* Pending Balance */}
                            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">Pending Balance</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight mb-2 opacity-90">
                                    ₹{earnings?.pendingBalance.toLocaleString() || 0}
                                </h2>
                                <p className="text-slate-400 text-sm">Will be available after consultation completion</p>
                            </div>

                            {/* Total Gross Earnings */}
                            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">Total Gross Earnings</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight mb-2 opacity-90">
                                    ₹{earnings?.totalEarnings.toLocaleString() || 0}
                                </h2>
                                <p className="text-slate-400 text-sm">Total gross income before platform fee</p>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Transactions List */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                            <div className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-20">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    Recent Transactions
                                </h3>
                            </div>

                            <div className="flex-1 overflow-auto custom-scrollbar p-2">
                                {!earnings || earnings.transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                                            <DollarSign size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-medium">No transactions yet</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-slate-50/50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Fee</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {earnings.transactions.map((t) => (
                                                <tr key={t.bookingId} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">{t.date}</td>
                                                    <td className="px-6 py-5 text-sm text-slate-900 font-bold">{t.userName}</td>
                                                    <td className="px-6 py-5 text-right text-sm font-semibold text-slate-500">₹{t.amount}</td>
                                                    <td className="px-6 py-5 text-right">
                                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">₹{t.netAmount}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                            <div className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-20">
                                <h3 className="text-xl font-bold text-slate-900">Payout History</h3>
                            </div>

                            <div className="flex-1 overflow-auto custom-scrollbar p-2">
                                {payoutHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                                            <Calendar size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-medium">No payout requests yet</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-slate-50/50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {payoutHistory.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">{new Date(p.requestDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-sm font-bold text-slate-900">₹{p.amount}</td>
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
