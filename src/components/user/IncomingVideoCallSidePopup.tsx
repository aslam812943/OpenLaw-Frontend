'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { canJoinCall } from '@/service/chatService';
import { showToast } from '@/utils/alerts';
import { Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const IncomingVideoCallSidePopup: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { socket, notifications } = useSocket();
  const user = useSelector((state: RootState) => state.user);
  const lawyer = useSelector((state: RootState) => state.lawyer);

  const [visible, setVisible] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [lawyerName, setLawyerName] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const handledNotificationIdsRef = useRef<Set<string>>(new Set());


  const hideOnChat = pathname?.startsWith('/user/chat');
  const hideOnVideoCall = pathname?.startsWith('/video-call');
  const shouldShow = !hideOnChat && !hideOnVideoCall;

  const isLawyerRole = !!(lawyer.id && lawyer.role === 'lawyer');
  const isUserRole = !!(user.id && !isLawyerRole);






  useEffect(() => {
    if (!socket) return;

    const handleLawyerJoined = (data: { bookingId: string, lawyerName?: string }) => {
      if (!shouldShow) return;
      if (!data?.bookingId) return;

      const lName = data.lawyerName;
      setLawyerName(typeof lName === 'string' ? lName : null);

      try {
        sessionStorage.removeItem(`videoCallDeclined:${data.bookingId}`);
      } catch {
      }

      setBookingId(data.bookingId);
      setVisible(true);
    };

    socket.on('video-call-lawyer-joined', handleLawyerJoined);
    return () => {
      socket.off('video-call-lawyer-joined', handleLawyerJoined);
    };
  }, [socket, shouldShow]);

  
  useEffect(() => {
    if (!socket) return;

    const handleCallEnded = (data: { bookingId: string }) => {
      if (!bookingId || data?.bookingId === bookingId) {
        setVisible(false);
        setBookingId(null);
      }
    };

    socket.on('video-call-ended', handleCallEnded);
    return () => {
      socket.off('video-call-ended', handleCallEnded);
    };
  }, [socket, bookingId]);

  useEffect(() => {
    if (!shouldShow || !isUserRole) return;
    if (!Array.isArray(notifications) || notifications.length === 0) return;

    const latest = notifications.find(n => n.type === 'video_call_joined');
    if (!latest) return;

    if (latest.id && handledNotificationIdsRef.current.has(latest.id)) return;

    const bId = latest.metadata?.bookingId;
    const resolvedBookingId =
      typeof bId === 'string' ? bId : (bId ? String(bId) : null);

    if (!resolvedBookingId) return;

    handledNotificationIdsRef.current.add(latest.id);

    try {
      sessionStorage.removeItem(`videoCallDeclined:${resolvedBookingId}`);
    } catch {

    }

    setBookingId(resolvedBookingId);
    const lName = latest.metadata?.lawyerName;
    setLawyerName(typeof lName === 'string' ? lName : null);
    setVisible(true);
  }, [notifications, shouldShow, isUserRole]);

  const handleDecline = () => {

    if (socket && bookingId) {
      try {
        sessionStorage.setItem(`videoCallDeclined:${bookingId}`, '1');
      } catch {

      }
      socket.emit('video-call-end', { bookingId });
    }
    setVisible(false);
    setBookingId(null);
  };

  const handleAccept = async () => {
    if (!bookingId) return;
    setChecking(true);
    try {
      const res = await canJoinCall(bookingId);
      if (res.success && res.data?.canJoin) {
        setVisible(false);
        router.push(`/video-call/${bookingId}`);
      } else {
        showToast('warning', res.data?.message || res.message || 'Call is not available yet.');
      }
    } catch (e) {
      showToast('error', 'Failed to verify call availability');
    } finally {
      setChecking(false);
    }
  };

  if (!isUserRole || !shouldShow || !visible || !bookingId) return null;

  return (
    <div className="fixed right-5 bottom-5 z-[90] max-w-[90vw]">
      <div className="w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
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

        <div className="p-4">
          <p className="text-sm text-slate-700">Accept to start your secure video consultation.</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
              disabled={checking}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={checking}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${checking ? 'bg-slate-300 text-slate-700 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingVideoCallSidePopup;

