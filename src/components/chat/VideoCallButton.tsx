'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';
import { canJoinCall, joinCall } from '@/service/chatService';
import { showToast } from '@/utils/alerts';
import { useSocket } from '@/context/SocketContext';

interface VideoCallButtonProps {
    bookingId: string;
    role: 'user' | 'lawyer';
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ bookingId, role }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { socket } = useSocket();

    useEffect(() => {
        if (socket && role === 'user') {
            const handleLawyerJoined = (data: { bookingId: string }) => {
                if (data.bookingId === bookingId) {
                    showToast('success', 'Lawyer has joined the call! You can now join.');
                }
            };

            socket.on('video-call-lawyer-joined', handleLawyerJoined);

            return () => {
                socket.off('video-call-lawyer-joined', handleLawyerJoined);
            };
        }
    }, [socket, bookingId, role]);

    const handleCallClick = async () => {
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
        } catch (error: any) {
            showToast('error', error.message || 'Error occurred while joining call');
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
};

export default VideoCallButton;
