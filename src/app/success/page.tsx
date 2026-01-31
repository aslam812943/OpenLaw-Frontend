'use client'

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmBooking, BookingDetails } from '@/service/userService';
import { CheckCircle, Calendar, Clock, FileText, CreditCard, User, ArrowLeft } from 'lucide-react';
import { showToast } from '@/utils/alerts';
import Image from 'next/image';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    const calledRef = useRef(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('Something went wrong');

    useEffect(() => {
        if (!sessionId || calledRef.current) return;

        calledRef.current = true;

        confirmBooking(sessionId)
            .then((response) => {
                if (response.success && response.data) {
                    setBookingDetails(response.data);
                    setStatus('success');
                    showToast('success', response.message || 'Payment successful! Booking confirmed.');
                } else {
                    setStatus('error');
                    setErrorMessage('Failed to retrieve booking details');
                }
            })
            .catch((err: any) => {

                const message = err.response?.data?.message || err.message || 'Failed to confirm booking';
                setErrorMessage(message);
                setStatus('error');
                showToast('error', message);
            });

    }, [sessionId]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (time: string) => {
        try {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch {
            return time;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                {status === 'loading' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <div className="animate-spin h-16 w-16 border-4 border-[#00b33c] border-t-transparent rounded-full mb-4"></div>
                        <p className="text-gray-600 font-medium">Confirming your booking...</p>
                    </div>
                )}

                {status === 'success' && bookingDetails && (
                    <>
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-[#00b33c] to-[#00a033] p-8 text-center text-white">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <CheckCircle className="text-white" size={48} />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                            <p className="text-white/90 text-lg">Your booking has been confirmed</p>
                        </div>

                        {/* Booking Details */}
                        <div className="p-8 space-y-6">
                            {/* Lawyer Information */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                        {bookingDetails.lawyerImage ? (
                                            <Image
                                                src={bookingDetails.lawyerImage}
                                                alt={bookingDetails.lawyerName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#00b33c] to-[#00a033] flex items-center justify-center text-white text-2xl font-bold">
                                                {bookingDetails.lawyerName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="text-gray-500" size={18} />
                                            <h2 className="text-2xl font-bold text-gray-900">{bookingDetails.lawyerName}</h2>
                                        </div>
                                        <p className="text-gray-600">Your Legal Consultant</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date */}
                                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="text-blue-600" size={20} />
                                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Date</h3>
                                    </div>
                                    <p className="text-gray-900 font-semibold text-lg">{formatDate(bookingDetails.date)}</p>
                                </div>

                                {/* Time */}
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="text-purple-600" size={20} />
                                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Time</h3>
                                    </div>
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {formatTime(bookingDetails.startTime)} - {formatTime(bookingDetails.endTime)}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {bookingDetails.description && (
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="text-amber-600" size={20} />
                                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Description</h3>
                                    </div>
                                    <p className="text-gray-700">{bookingDetails.description}</p>
                                </div>
                            )}

                            {/* Payment Details */}
                            <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="text-green-600" size={20} />
                                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Payment Details</h3>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Consultation Fee</span>
                                        <span className="text-2xl font-bold text-green-600">₹{bookingDetails.consultationFee.toLocaleString()}</span>
                                    </div>
                                    {bookingDetails.paymentId && (
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-green-200">
                                            <span className="text-gray-500">Payment ID</span>
                                            <span className="text-gray-700 font-mono text-xs">{bookingDetails.paymentId.substring(0, 20)}...</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Booking ID</span>
                                        <span className="text-gray-700 font-mono text-xs">{bookingDetails.id.substring(0, 20)}...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => router.push('/user/bookings')}
                                    className="flex-1 bg-[#00b33c] hover:bg-[#00a033] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    View My Appointments
                                </button>
                                <button
                                    onClick={() => router.push('/user/lawyers')}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={20} />
                                    Back to Lawyers
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
                        <p className="text-gray-600 mb-6">{errorMessage}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => router.push('/user/lawyers')}
                                className="bg-[#00b33c] hover:bg-[#00a033] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                            >
                                Go Back to Lawyers
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
