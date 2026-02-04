"use client"
import React, { useEffect, useState } from "react"
import { getWallet, Wallet, WalletTransaction } from "@/service/userService"
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertCircle, Info, Calendar, User, UserCheck, X, Copy, ExternalLink } from "lucide-react"
import { showToast } from "@/utils/alerts"

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

const TransactionModal = ({ isOpen, onClose, transaction }: { isOpen: boolean, onClose: () => void, transaction: WalletTransaction | null }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !transaction) return null;

    const bookingIdToDisplay = transaction.metadata?.displayId || (transaction.bookingId ? `BK-${transaction.bookingId.slice(-8).toUpperCase()}` : 'N/A');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("success", "ID copied to clipboard");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Transaction Details
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount & Type */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <span className={`text-3xl font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold italic">
                            {transaction.type === 'credit' ? 'Refund Credited' : 'Payment Debited'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Transaction Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                    <AlertCircle className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Description</p>
                                    <p className="text-sm text-slate-700 leading-snug">{transaction.description || 'N/A'}</p>
                                </div>
                            </div>

                            {transaction.metadata?.lawyerName && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                        <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Lawyer</p>
                                        <p className="text-sm text-slate-700 font-semibold">{transaction.metadata.lawyerName}</p>
                                    </div>
                                </div>
                            )}

                            {transaction.metadata?.reason && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                                        <XCircle className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Reason</p>
                                        <p className="text-sm text-slate-700 italic">"{transaction.metadata.reason}"</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                                    <Info className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-medium">Booking ID</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                            {bookingIdToDisplay}
                                        </p>
                                        <button
                                            onClick={() => handleCopy(bookingIdToDisplay)}
                                            className="p-1.5 hover:bg-slate-200 rounded-md transition-all text-slate-400 hover:text-blue-600 group/copy"
                                            title="Copy ID"
                                        >
                                            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                        <a
                                            href="/user/bookings"
                                            className="p-1.5 hover:bg-slate-200 rounded-md transition-all text-slate-400 hover:text-blue-600"
                                            title="Go to Bookings"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Date</p>
                                        <p className="text-sm text-slate-700">
                                            {transaction.metadata?.date ? new Date(transaction.metadata.date).toLocaleDateString() : new Date(transaction.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Time</p>
                                        <p className="text-sm text-slate-700">{transaction.metadata?.time || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

const WalletPage = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await getWallet();
                if (response.success) {
                    setWallet(response.data);
                } else {
                    showToast("error", response.message || "Failed to fetch wallet details");
                }
            } catch (error) {
                showToast("error", "An error occurred while fetching wallet details");
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, []);

    const handleOpenModal = (tx: WalletTransaction) => {
        setSelectedTx(tx);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: WalletTransaction['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge className="bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3 mr-1" /> Failed
                    </Badge>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            {/* Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTx}
            />

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <WalletIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Wallet</h1>
                    <p className="text-slate-500 text-sm">Manage your funds and transaction history</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {/* Balance Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200/50">
                    <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                    <div className="text-4xl font-bold tracking-tight">₹{wallet?.balance.toLocaleString() || 0}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-100/90 bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                        <UserCheck className="w-3.5 h-3.5 text-blue-200" />
                        Verified Account
                    </div>
                </div>

                {/* Info Card */}
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1.5">Wallet Information</h3>
                            <p className="text-[13px] leading-relaxed text-slate-500">
                                Your wallet balance is automatically credited when a booking is canceled or rejected.
                                These funds can be used for any future legal consultations. Wallet funds are
                                stored securely and handled according to our refund policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-bold text-slate-800">Transaction History</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Activity</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4 text-center">Action</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {wallet?.transactions && wallet.transactions.length > 0 ? (
                                [...wallet.transactions].reverse().map((tx, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="font-semibold text-slate-700">
                                                {new Date(tx.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                                                {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl border ${tx.type === 'credit' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                                    {tx.type === 'credit' ? (
                                                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700 capitalize">
                                                        {tx.type === 'credit' ? 'Refund Credited' : 'Payment Debited'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 max-w-[150px] truncate">
                                                        {tx.description || 'Appoiment Transaction'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-700'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-mono font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                                                {tx.metadata?.displayId || (tx.bookingId ? `#${tx.bookingId.slice(-8).toUpperCase()}` : "N/A")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenModal(tx)}
                                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-95 group/btn"
                                                title="View Details"
                                            >
                                                <Info className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end">
                                                {getStatusBadge(tx.status)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                                                <WalletIcon className="w-8 h-8 text-slate-200 mr-1" />
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium">No transactions available yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> Secure Payment</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span>PCI DSS Compliant</span>
            </div>
        </div>
    );
};

export default WalletPage;