'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'info' | 'success' | 'error' | 'question';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// A simple global trigger for the utility function to use outside of React tree
let globalConfirmTrigger: ((options: ConfirmOptions) => Promise<boolean>) | null = null;

export const confirmActionInternal = (options: ConfirmOptions) => {
    if (globalConfirmTrigger) {
        return globalConfirmTrigger(options);
    }
    console.warn("ConfirmProvider not found in the component tree.");
    return Promise.resolve(false);
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
    }>({
        isOpen: false,
        options: { title: '', message: '' },
    });

    const resolver = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions) => {
        setModalState({ isOpen: true, options });
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    // Expose to global trigger
    globalConfirmTrigger = confirm;

    const handleConfirm = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        resolver.current?.(true);
    };

    const handleCancel = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        resolver.current?.(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmModal
                isOpen={modalState.isOpen}
                title={modalState.options.title}
                message={modalState.options.message}
                confirmText={modalState.options.confirmText}
                cancelText={modalState.options.cancelText}
                type={modalState.options.type}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};
