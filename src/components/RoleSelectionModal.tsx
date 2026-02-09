
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Scale } from 'lucide-react';

interface RoleSelectionModalProps {
    isOpen: boolean;
    onSelect: (role: 'user' | 'lawyer') => void;
    onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onSelect, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all scale-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Select Your Role</h2>
                <p className="text-center text-gray-600 mb-8">How would you like to continue?</p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onSelect('user')}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                            <User className="w-8 h-8 text-teal-600" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-teal-700">Client</span>
                        <span className="text-xs text-gray-500 mt-1">I need legal help</span>
                    </button>

                    <button
                        onClick={() => onSelect('lawyer')}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                            <Scale className="w-8 h-8 text-teal-600" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover:text-teal-700">Lawyer</span>
                        <span className="text-xs text-gray-500 mt-1">I am a legal expert</span>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>,
        document.body
    );
};

export default RoleSelectionModal;
