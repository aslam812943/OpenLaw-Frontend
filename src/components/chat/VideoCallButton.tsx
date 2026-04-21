'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Video, Phone } from 'lucide-react';
import { canJoinCall, joinCall } from '@/service/chatService';
import { useSocket } from '@/context/SocketContext';
import { showToast } from '@/utils/alerts';

interface VideoCallButtonProps {
    bookingId: string;
    role: 'user' | 'lawyer';
    lawyerName?: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ bookingId, role, lawyerName }) => {
    const [loading, setLoading] = useState(false);
    const [incomingVisible, setIncomingVisible] = useState(false);
    const [showIncomingModal, setShowIncomingModal] = useState(false);
    const [declined, setDeclined] = useState(false);
    const [joined, setJoined] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    const router = useRouter();
    const { socket } = useSocket();
    const declinedKey = `videoCallDeclined:${bookingId}`;

    useEffect(() => {
        if (role !== 'user') return;
        try {
            setDeclined(sessionStorage.getItem(declinedKey) === '1');
            setJoined(sessionStorage.getItem(`videoCallJoined:${bookingId}`) === '1');
        } catch {
            setDeclined(false);
            setJoined(false);
        }
    }, [role, declinedKey, bookingId]);

    useEffect(() => {
        if (socket && role === 'user') {
            const handleLawyerJoined = (data: { bookingId: string }) => {
                if (data.bookingId === bookingId) {
                    try {
                        sessionStorage.removeItem(declinedKey);
                        sessionStorage.removeItem(`videoCallJoined:${bookingId}`);
                    } catch {

                    }
                    setDeclined(false);
                    setJoined(false);
                    setIncomingVisible(true);
                    setShowIncomingModal(true);
                }
            };

            socket.on('video-call-lawyer-joined', handleLawyerJoined);

            return () => {
                socket.off('video-call-lawyer-joined', handleLawyerJoined);
            };
        }
    }, [socket, bookingId, role]);


    useEffect(() => {
        if (role !== 'user') return;
        if (incomingVisible) return;
        if (declined) return;

        let cancelled = false;
        let intervalId: ReturnType<typeof setInterval> | undefined;

        const check = async () => {
            if (cancelled || loading) return;
            try {
                const res = await canJoinCall(bookingId);
                const canJoin = res.success && res.data?.canJoin;

                if (!cancelled) {
                    setIncomingVisible(!!canJoin);


                    const shouldSuppressModal =
                        sessionStorage.getItem(declinedKey) === '1' ||
                        sessionStorage.getItem(`videoCallJoined:${bookingId}`) === '1';

                    if (canJoin && !shouldSuppressModal && !showIncomingModal) {
                        setShowIncomingModal(true);
                    }
                }
            } catch {

            }
        };

        check();
        intervalId = setInterval(check, 3000);

        return () => {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
        };
    }, [role, bookingId, showIncomingModal, loading]);

    const proceedToVideoCall = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await canJoinCall(bookingId);
            if (res.success && res.data?.canJoin) {
                if (role === 'lawyer') {
                    await joinCall(bookingId);
                }
                router.push(`/video-call/${bookingId}`);
            } else {
                showToast('warning', res.data?.message || res.message || 'The lawyer has not joined the call yet. Please wait for them to join.');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error occurred while joining call';
            showToast('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCallClick = async () => {

        if (role === 'user' && !incomingVisible) {
            setLoading(true);
            try {
                const res = await canJoinCall(bookingId);
                if (res.success && res.data?.canJoin) {
                    setIncomingVisible(true);
                } else {

                }
            } catch (error: unknown) {

            } finally {
                setLoading(false);
            }
            return;
        }

        await proceedToVideoCall();
    };

    const handleDecline = () => {
        setDeclined(true);
        setIncomingVisible(true);
        setShowIncomingModal(false);
        try {
            sessionStorage.setItem(declinedKey, '1');
        } catch {

        }

        socket?.emit('video-call-end', { bookingId });
    };

    const handleAccept = async () => {
        setShowIncomingModal(false);
        setJoined(true);
        try {
            sessionStorage.setItem(`videoCallJoined:${bookingId}`, '1');
        } catch {

        }
        await proceedToVideoCall();
    };

    return (
        <>
            {role === 'lawyer' && (
                <button
                    onClick={handleCallClick}
                    disabled={loading}
                    className="p-2.5 text-teal-600 hover:text-white hover:bg-teal-600 bg-teal-50 rounded-xl transition-all shadow-sm flex items-center gap-2 group"
                    title={role === 'lawyer' ? 'Start/Join Video Call' : 'Join Video Call'}
                >
                    <Video size={20} className={loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                        {role === 'lawyer' ? 'Join' : 'Call'}
                    </span>
                </button>
            )}

            {role === 'user' && showIncomingModal && mounted && createPortal(
                <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:p-8 bg-black/20 backdrop-blur-[1px]">
                    <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
                        <div className="p-5 bg-slate-900 text-white flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-none">Incoming Call</p>
                                    <p className="text-[11px] text-slate-300 font-medium mt-1">
                                        {lawyerName ? `${lawyerName} is calling you` : 'Lawyer is calling you'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDecline}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="text-sm text-slate-700">
                                Accept to start your secure video consultation.
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                                    disabled={loading}
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-300 text-slate-700 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                                    disabled={loading}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default VideoCallButton;
