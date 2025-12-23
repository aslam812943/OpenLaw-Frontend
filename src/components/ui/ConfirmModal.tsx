'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, XCircle, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'info' | 'success' | 'error' | 'question';
    onConfirm: () => void;
    onCancel: () => void;
}

const icons = {
    warning: <AlertCircle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
    success: <CheckCircle2 className="w-6 h-6 text-teal-500" />,
    error: <XCircle className="w-6 h-6 text-rose-500" />,
    question: <HelpCircle className="w-6 h-6 text-indigo-500" />,
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = 'warning',
    onConfirm,
    onCancel,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9998]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden pointer-events-auto border border-slate-100"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {icons[type]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all active:scale-95 ${type === 'error' ? 'bg-rose-500 hover:bg-rose-600' :
                                                type === 'success' ? 'bg-teal-500 hover:bg-teal-600' :
                                                    type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                                        'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
