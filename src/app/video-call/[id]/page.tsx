'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    User, Settings
} from 'lucide-react';
import { showToast } from '@/utils/alerts';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ],
};

export default function VideoCallPage() {
    const { id: bookingId } = useParams();
    const router = useRouter();
    const { socket, isConnected } = useSocket();


    const lawyerId = useSelector((state: RootState) => state.lawyer.id);
    const userId = useSelector((state: RootState) => state.user.id);
    const currentUserId = lawyerId || userId;
    const userRole = lawyerId ? 'lawyer' : 'user';

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isLawyerJoined, setIsLawyerJoined] = useState(userRole === 'lawyer');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

    // Initialize Local Stream
    useEffect(() => {
        const initLocalStream = async () => {
            try {
    
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                
                showToast('error', 'Could not access camera/microphone');
                router.back();
            }
        };

        initLocalStream();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const processQueuedCandidates = useCallback(async () => {
        if (!peerConnection.current || !peerConnection.current.remoteDescription) return;

        while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            if (candidate) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding queued ICE candidate", e);
                }
            }
        }
    }, []);

    // Socket Event Handlers
    const handleSignal = useCallback(async ({ signal, from, fromSocket }: { signal: any, from: string, fromSocket: string }) => {
        if (fromSocket === socket?.id) return;
    

        try {
            if (signal.type === 'offer') {
                
                const pc = peerConnection.current;
                if (!pc) return;

                await pc.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket?.emit('video-call-signal', { bookingId, signal: answer });
                await processQueuedCandidates();
                setIsConnecting(false);
            } else if (signal.type === 'answer') {
                
                const pc = peerConnection.current;
                if (!pc) return;

                await pc.setRemoteDescription(new RTCSessionDescription(signal));
                await processQueuedCandidates();
                setIsConnecting(false);
            } else if (signal.candidate) {
                const pc = peerConnection.current;
                if (pc && pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                } else {
                    iceCandidatesQueue.current.push(signal.candidate);
                }
            }
        } catch (error) {
        }
    }, [bookingId, socket, processQueuedCandidates]);

    const createOffer = useCallback(async () => {
        if (!peerConnection.current) {
            return;
        }
        try {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket?.emit('video-call-signal', { bookingId, signal: offer });
        } catch (error) {
        }
    }, [bookingId, socket]);

    const handlePeerJoined = useCallback(({ socketId, role }: { socketId: string, role?: string }) => {
        if (role === 'lawyer') {
            setIsLawyerJoined(true);
        }
        
        setIsConnecting(false);

        setTimeout(() => {
            createOffer();
        }, 1500);
    }, [createOffer]);

    const setupPeerConnection = useCallback(() => {
        

        
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (localStream) {
          
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        }

        pc.ontrack = (event) => {
         
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
               
                socket?.emit('video-call-signal', {
                    bookingId,
                    signal: { candidate: event.candidate }
                });
            }
        };

        pc.onconnectionstatechange = () => {
          
            if (pc.connectionState === 'connected') {
                setIsConnecting(false);
                showToast('success', 'Connected to secure legal tunnel');
            } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                console.warn("Connection lost or failed");
               
            }
        };

        pc.onicegatheringstatechange = () => {
            console.log("ICE gathering state:", pc.iceGatheringState);
        };

        peerConnection.current = pc;
    }, [localStream, bookingId, socket]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (socket && isConnected && localStream) {
            socket.emit('video-call-join', { bookingId });

         
            setIsConnecting(false);

            socket.on('video-call-signal', handleSignal);
            socket.on('video-call-peer-joined', handlePeerJoined);
            socket.on('lawyer-not-joined', () => {
                setIsLawyerJoined(false);
                setIsConnecting(false);
            });
            socket.on('video-call-ended', () => {
                showToast('info', 'Legal consultation session ended');
                endCall();
            });

            setupPeerConnection();

            return () => {
                socket.off('video-call-signal');
                socket.off('video-call-peer-joined');
                socket.off('video-call-ended');

                if (peerConnection.current) {
                    peerConnection.current.close();
                    peerConnection.current = null;
                }
                iceCandidatesQueue.current = [];
            };
        }
    }, [socket, isConnected, localStream, handleSignal, handlePeerJoined, setupPeerConnection, bookingId]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks()[0].enabled = isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks()[0].enabled = isVideoOff;
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        socket?.emit('video-call-end', { bookingId });
        localStream?.getTracks().forEach(track => track.stop());
        peerConnection.current?.close();
        router.back();
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Video className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold tracking-tight">Legal Consultation</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            <span className="text-teal-400 text-[10px] uppercase font-bold tracking-widest leading-none">In Session</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Remote Video (Main) */}
                <div className="relative w-full max-w-6xl aspect-video bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/50 backdrop-blur-sm">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-teal-500/20 rounded-full animate-ping"></div>
                                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center ring-4 ring-teal-500/20">
                                    <User size={48} className="text-teal-500/50" />
                                </div>
                            </div>
                            <div className="text-center px-6">
                                <p className="text-white font-bold text-xl">
                                    {!isLawyerJoined ? 'Waiting for legal expert to start the session...' : isConnecting ? 'Initializing Tunnel...' : 'Securing Legal Connection...'}
                                </p>
                                <p className="text-slate-400 text-sm mt-3 font-medium max-w-xs mx-auto text-balance">
                                    {!isLawyerJoined
                                        ? 'The consultation will begin as soon as the lawyer joins the room.'
                                        : 'Establishing a secure end-to-end encrypted connection'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Local Video (Floating) */}
                    <div className="absolute bottom-8 right-8 w-44 sm:w-64 aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/10 z-10 transition-transform hover:scale-105">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {isVideoOff && (
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                <VideoOff size={32} className="text-slate-500" />
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                            <p className="text-[10px] text-white font-bold uppercase tracking-wider">You</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
                <div className="flex items-center gap-5 bg-black/40 backdrop-blur-2xl p-4 rounded-[3rem] ring-1 ring-white/20 shadow-2xl">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all active:scale-90 ${isMuted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all active:scale-90 ${isVideoOff ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>

                    <button
                        onClick={endCall}
                        className="p-4 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full transition-all shadow-xl shadow-rose-500/40 group"
                    >
                        <PhoneOff size={28} className="group-hover:rotate-[135deg] transition-transform" />
                    </button>
                </div>

                <button className="p-4 bg-white/10 backdrop-blur-2xl text-white hover:bg-white/20 rounded-full ring-1 ring-white/20 transition-all opacity-50 cursor-not-allowed">
                    <Settings size={24} />
                </button>
            </div>
        </div>
    );
}
