import React, { useState } from 'react';

interface CancelAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-2">Cancel Appointment</h2>
                <div className="text-[11px] leading-relaxed text-amber-700 bg-amber-50 p-3 rounded-xl mb-4 border border-amber-100 italic space-y-1">
                    <p>• Cancellations &gt; 24h before: 100% refund.</p>
                    <p>• Cancellations &lt; 24h before: 50% refund.</p>
                </div>
                <p className="mb-4 text-gray-600 text-sm">Please provide a reason for cancellation:</p>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason..."
                />
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelAppointmentModal;
