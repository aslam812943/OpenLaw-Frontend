'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/context/SocketContext';
import { getMessages, getRoomById } from '@/service/chatService';
import { Send, ArrowLeft, MoreVertical, User, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageModal from '@/components/ui/ImageModal';
import { showToast } from '@/utils/alerts';
import VideoCallButton from '@/components/chat/VideoCallButton';


const isImageUrl = (url: string): boolean => {
    if (!url) return false;

    return url.includes('cloudinary.com') &&
        (url.includes('/image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url));
};

export default function LawyerChatRoomPage() {
    const { id: roomId } = useParams();
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const lawyer = useSelector((state: RootState) => state.lawyer);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const res = await getRoomById(roomId as string, 'lawyer');
                if (res.success) {
                    setRoomInfo(res.data);
                }
            } catch (error) {
                showToast('error', 'Failed to fetch room information');
            }
        };

        if (roomId) {
            fetchRoomData();
        }
    }, [roomId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getMessages(roomId as string, 'lawyer');
                if (res.success) {
                    setMessages(res.data);
                }
            } catch (error) {
                showToast('error', 'Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchMessages();
        }
    }, [roomId]);

    useEffect(() => {
        if (socket && roomId) {
            socket.emit('join-room', { roomId });

            const handleNewMessage = (message: any) => {

                setMessages((prev) => {
                    const exists = prev.some(msg => msg.id === message.id ||
                        (msg.id?.startsWith('temp-') && msg.content === message.content && msg.senderId === message.senderId));
                    if (exists && message.id && !message.id.startsWith('temp-')) {

                        return prev.map(msg =>
                            (msg.id?.startsWith('temp-') && msg.content === message.content && msg.senderId === message.senderId)
                                ? message : msg
                        );
                    }
                    if (!exists) {
                        return [...prev, message];
                    }
                    return prev;
                });
            };

            const handleMessagesRead = () => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.senderId === lawyer.id && !msg.readAt ?
                            { ...msg, readAt: new Date().toISOString() }
                            : msg
                    )
                )
            }

            socket.on('new-message', handleNewMessage);
            socket.on('messages-read', handleMessagesRead);

            const handleError = (error: any) => {
                showToast('error', error.message || 'An error occurred in the chat.');
            };

            socket.on('chat-error', handleError);

            return () => {
                socket.off('new-message', handleNewMessage);
                socket.off('messages-read', handleMessagesRead);
                socket.off('chat-error', handleError);
            };
        }
    }, [socket, roomId, lawyer.id]);

    useEffect(() => {
        if (!socket || !roomId || !lawyer?.id || messages.length == 0) return


        const isPageVisible = document.visibilityState === 'visible';
        const isWindowFocused = document.hasFocus();

        if (!isPageVisible || !isWindowFocused) return;

        const hasUnread = messages.some(
            msg => msg.senderId !== lawyer.id && !msg.readAt
        )

        if (hasUnread) {
            socket.emit('mark-read', { roomId })
        }
    }, [messages, socket, roomId, lawyer?.id])


    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && socket && roomId && lawyer?.id && messages.length > 0) {
                const hasUnread = messages.some(msg => msg.senderId !== lawyer.id && !msg.readAt);
                if (hasUnread) {
                    socket.emit('mark-read', { roomId });
                }
            }
        };

        const handleFocus = () => {
            if (socket && roomId && lawyer?.id && messages.length > 0) {
                const hasUnread = messages.some(msg => msg.senderId !== lawyer.id && !msg.readAt);
                if (hasUnread) {
                    socket.emit('mark-read', { roomId });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [socket, roomId, lawyer?.id, messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const messageContent = newMessage.trim();


        if (!messageContent) return;
        if (!socket) {
            showToast('error', 'Connection error: Please refresh the page and try again.');
            return;
        }
        if (!isConnected) {
            showToast('warning', 'You are disconnected. Please wait for connection and try again.');
            return;
        }
        if (!lawyer?.id) {
            showToast('error', 'Authentication error: Please log in again.');
            return;
        }


        const tempMessage = {
            id: `temp-${Date.now()}`,
            roomId,
            senderId: lawyer.id,
            content: messageContent,
            senderRole: 'lawyer' as const,
            createdAt: new Date().toISOString(),
            readAt: null
        };
        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage('');

        try {

            socket.emit('send-message', {
                roomId,
                content: messageContent,
            });


            const errorHandler = (error: any) => {
                setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
                showToast('error', error.message || 'Failed to send message. Please try again.');
                socket.off('chat-error', errorHandler);
            };

            socket.once('chat-error', errorHandler);


            setTimeout(() => {
                socket.off('chat-error', errorHandler);
            }, 5000);

        } catch (error: any) {
            setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
            showToast('error', 'Failed to send message. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-slate-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">
                                {roomInfo?.userId?.name || 'Patient Chat'}
                            </h2>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                                    {isConnected ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {roomInfo?.bookingId && (
                        <VideoCallButton bookingId={roomInfo.bookingId} role="lawyer" />
                    )}
                    <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <MoreVertical size={20} className="text-slate-400" />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === lawyer.id;
                    return (
                        <motion.div
                            key={msg.id || index}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${isOwnMessage
                                    ? 'bg-teal-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                                    }`}>

                                {msg.type === 'image' || isImageUrl(msg.content) ? (
                                    <div className="space-y-1">
                                        <img
                                            src={msg.content}
                                            alt="Shared image"
                                            className="max-w-full rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                            onClick={() => setSelectedImage(msg.content)}
                                        />
                                        {msg.fileName && <p className="text-xs opacity-70 truncate">{msg.fileName}</p>}
                                    </div>
                                ) : msg.type === 'document' || (msg.content && msg.content.startsWith('http')) ? (

                                    msg.type === 'document' || msg.fileUrl ? (
                                        <div className="flex items-center gap-3 p-1">
                                            <div className="bg-white/20 p-2 rounded-lg">
                                                <FileIcon size={24} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <a
                                                    href={msg.content || msg.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium hover:underline truncate block"
                                                >
                                                    {msg.fileName || 'Document'}
                                                </a>
                                                {msg.fileSize && <p className="text-xs opacity-70">{(parseInt(msg.fileSize) / 1024).toFixed(1)} KB</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
                                    )
                                ) : (
                                    <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
                                )}
                                <div className={`text-[10px] mt-1 ${isOwnMessage ? 'text-teal-100' : 'text-slate-400'}`}>
                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isOwnMessage && msg.readAt && (
                                        <span className="ml-2 font-semibold">
                                            ✓ Read
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Input */}
            <footer className="p-4 border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 bg-slate-50 border-transparent rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-900"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected}
                        className="p-3 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-md shadow-teal-200"
                        title={!isConnected ? 'Disconnected - Please wait' : 'Send message'}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </footer >

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage || ''}
            />
        </div >
    );
}
