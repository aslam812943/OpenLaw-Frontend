'use client'

import React, { useEffect, useState } from 'react';
import { fetchPendingPayouts, approvePayout } from '@/service/adminService';
import { blockLawyer, unBlockLawyer } from '@/service/lawyerService';
import { showToast } from '@/utils/alerts';
import { confirmAction } from '@/utils/confirmAction';
import { CheckCircle as CheckCircleIcon, XCircle, Clock, DollarSign, User, ShieldCheck, Lock as LockIcon, Unlock as UnlockIcon } from 'lucide-react';

interface PendingPayout {
    id: string;
    lawyerId: string;
    lawyerName: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    isBlock?: boolean;
    email?: string;
}

const AdminPayoutsPage = () => {
    const [payouts, setPayouts] = useState<PendingPayout[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const res = await fetchPendingPayouts();
            if (res?.success) {
                setPayouts(res.data);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch payout requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: string) => {
        const confirmed = await confirmAction(
            'Approve Payout Request?',
            'Are you sure you want to approve this withdrawal? Commission will be calculated and deducted automatically.',
            'Yes, Approve',
            'success'
        );

        if (!confirmed) return;

        setActionLoading(id);
        try {
            await approvePayout(id);
            showToast('success', 'Payout approved successfully');
            fetchData();
        } catch (error: any) {
            showToast('error', error.message || 'Approval failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleBlockAction = async (payout: PendingPayout) => {
        const isCurrentlyBlocked = payout.isBlock;
        const type = isCurrentlyBlocked ? "Unblock" : "Block";

        const confirmed = await confirmAction(
            `${type} Lawyer?`,
            `Are you sure you want to ${type.toLowerCase()} this lawyer? ${isCurrentlyBlocked ? "They will regain access." : "They will lose access to their account."}`,
            `Yes, ${type}`,
            "warning"
        );

        if (!confirmed) return;

        setActionLoading(payout.id);
        try {
            if (isCurrentlyBlocked) {
                await unBlockLawyer(payout.lawyerId);
                showToast("success", "Lawyer unblocked successfully.");
            } else {
                await blockLawyer(payout.lawyerId);
                showToast("success", "Lawyer blocked successfully.");
            }
            fetchData();
        } catch (error: any) {
            showToast("error", `Failed to ${type.toLowerCase()} lawyer.`);
        } finally {
            setActionLoading(null);
        }
    };


    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payout Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review and approve lawyer withdrawal requests</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-bold">Secure Verification</span>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Withdrawals</h2>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-24 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-full mb-4">
                                <Clock size={48} className="text-gray-300 dark:text-neutral-700" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 dark:text-neutral-300 mb-2">No Pending Requests</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                All payout requests have been processed.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lawyer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                {payouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <Clock size={16} className="text-gray-400" />
                                                {new Date(p.requestDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {p.lawyerName || 'Unknown Lawyer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                                ₹{p.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {p.isBlock ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-bold w-fit border border-red-100 dark:border-red-900/30">
                                                    <LockIcon size={12} /> Blocked
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full text-xs font-bold w-fit border border-emerald-100 dark:border-emerald-900/30">
                                                    <UnlockIcon size={12} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(p.id)}
                                                    disabled={!!actionLoading}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {actionLoading === p.id ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : <CheckCircleIcon size={16} />}
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => handleBlockAction(p)}
                                                    disabled={!!actionLoading}
                                                    title={p.isBlock ? "Unblock Lawyer" : "Block Lawyer"}
                                                    className={`p-2 rounded-lg border transition-all ${p.isBlock
                                                        ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                                        : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"}`}
                                                >
                                                    {p.isBlock ? <UnlockIcon size={18} /> : <LockIcon size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Note Section */}
            <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6">
                <div className="flex gap-4">
                    <ShieldCheck className="text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-1">Commission Policy</h4>
                        <p className="text-amber-700 dark:text-amber-500/80 text-sm leading-relaxed">
                            Approving a payout will automatically calculate and deduct the platform commission based on the lawyer's subscription tier. The net amount will be processed for payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayoutsPage;
