'use client'

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmBooking } from '@/service/userService';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    
    const calledRef = useRef(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!sessionId || calledRef.current) return;

        calledRef.current = true; 

        confirmBooking(sessionId)
            .then(() => setStatus('success'))
            .catch(err => {
                console.error(err);
                setStatus('error');
            });

    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#00b33c] mx-auto"></div>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-[#00b33c]" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold">Payment Successful!</h1>
                        <button className="mt-6 w-full py-3 bg-[#00b33c] text-white rounded-lg"
                            onClick={() => router.push('/user/lawyers')}>
                            Return to Lawyers
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
                        <button
                            onClick={() => router.push('/user/lawyers')}
                            className="mt-6 w-full py-3 rounded-lg bg-gray-800 text-white">
                            Go Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
