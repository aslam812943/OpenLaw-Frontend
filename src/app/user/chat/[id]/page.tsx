'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/context/SocketContext';
import { getMessages, getRoomById, uploadFile, getUserRooms, Message, ChatRoomDetails } from '@/service/chatService';
import { Send, Menu, MoreVertical, User, Paperclip, FileIcon, ChevronLeft, Search, Dot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageModal from '@/components/ui/ImageModal';
import { showToast } from '@/utils/alerts';
import VideoCallButton from '@/components/chat/VideoCallButton';


const isImageUrl = (url: string): boolean => {
    if (!url) return false;

    return url.includes('cloudinary.com') &&
        (url.includes('/image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url));
};

export default function UserChatPage() {
    const { id: roomId } = useParams();
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const user = useSelector((state: RootState) => state.user);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [rooms, setRooms] = useState<ChatRoomDetails[]>([]);
    const [roomInfo, setRoomInfo] = useState<ChatRoomDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [roomsRes, roomRes, messagesRes] = await Promise.all([
                    getUserRooms(),
                    getRoomById(roomId as string),
                    getMessages(roomId as string)
                ]);

                if (roomsRes.success) {
                    setRooms(roomsRes.data);
                }
                if (roomRes.success) {
                    setRoomInfo(roomRes.data);
                }
                if (messagesRes.success) setMessages(messagesRes.data);
            } catch (error) {
                showToast('error', 'Failed to load chat data');
            } finally {
                setLoading(false);
            }
        };

        if (roomId) fetchInitialData();
    }, [roomId]);

    useEffect(() => {
        if (socket) {
            const handleMessagesRead = ({ roomId: rId, readBy }: { roomId: string, readBy: string }) => {
                if (rId === roomId && readBy !== user.id) {
                    setMessages(prev => prev.map(m => ({ ...m, readAt: m.readAt || new Date().toISOString() })));
                }
            };

            socket.on('messages-read', handleMessagesRead);
            return () => {
                socket.off('messages-read', handleMessagesRead);
            };
        }
    }, [socket, roomId, user.id]);

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
                    if (!exists) return [...prev, message];
                    return prev;
                });
            };

            socket.on('new-message', handleNewMessage);
            socket.on('chat-error', (error: any) => showToast('error', error.message || 'An error occurred'));

            return () => {
                socket.off('new-message', handleNewMessage);
                socket.off('chat-error');
            };
        }
    }, [socket, roomId, user.id]);

    useEffect(() => {
        if (socket && isConnected) {
            rooms.forEach(room => {
                socket.emit('join-room', { roomId: room.id });
            });

            const handleSidebarUpdate = (message: any) => {
                setRooms(prevRooms => {
                    const roomIndex = prevRooms.findIndex(r => r.id === message.roomId);
                    if (roomIndex === -1) return prevRooms;

                    const updatedRoom = {
                        ...prevRooms[roomIndex],
                        lastMessage: {
                            content: message.type === 'image' ? 'Sent an image' :
                                message.type === 'video' ? 'Sent a video' :
                                    message.type === 'document' ? 'Sent a document' :
                                        message.content,
                            createdAt: message.createdAt
                        },
                        updatedAt: message.createdAt
                    };

                    const newRooms = [...prevRooms];
                    newRooms.splice(roomIndex, 1);
                    return [updatedRoom, ...newRooms];
                });
            }
            socket.on('new-message', handleSidebarUpdate);
            return () => {
                socket.off('new-message', handleSidebarUpdate);
            };
        }
    }, [socket, isConnected, rooms.length]);

    useEffect(() => {
        if (!socket || !roomId || !user?.id || messages.length === 0) return;
        if (document.visibilityState === 'visible' && document.hasFocus()) {
            const hasUnread = messages.some(msg => msg.senderId !== user.id && !msg.readAt);
            if (hasUnread) socket.emit('mark-read', { roomId });
        }
    }, [messages, socket, roomId, user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = newMessage.trim();
        if (!content || !socket || !isConnected) return;

        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            senderId: user.id || '',
            content,
            senderRole: 'user',
            type: 'text',
            createdAt: new Date().toISOString(),
            readAt: null
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        try {
            socket.emit('send-message', { roomId, content });
        } catch (error) {
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
            showToast('error', 'Failed to send message');
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !socket || !isConnected) return;

        setIsUploading(true);
        try {
            const response = await uploadFile(file);
            if (response.success) {
                const { fileUrl, fileName, fileSize } = response.data;
                const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document';
                socket.emit('send-message', { roomId, content: fileUrl, type, fileName, fileSize });
            }
        } catch (error) {
            showToast('error', 'Failed to upload file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (messages.length > 0 && roomId) {
            const lastMsg = messages[messages.length - 1];
            setRooms(prev => prev.map(room => {
                if (room.id === roomId) {
                    if (room.lastMessage?.createdAt !== lastMsg.createdAt) {
                        return {
                            ...room,
                            lastMessage: {
                                content: lastMsg.type === 'image' ? 'Sent an image' :
                                    lastMsg.type === 'video' ? 'Sent a video' :
                                        lastMsg.type === 'document' ? 'Sent a document' :
                                            lastMsg.content,
                                createdAt: lastMsg.createdAt
                            }
                        };
                    }
                }
                return room;
            }));
        }
    }, [messages, roomId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent shadow-lg"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Initializing secure connection...</p>
                </div>
            </div>
        );
    }

    const filteredRooms = rooms.filter(room =>
        room.lawyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-slate-100 shadow-sm">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search consultations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {filteredRooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => router.push(`/user/chat/${room.id}`)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${room.id === roomId
                                ? 'bg-teal-50 text-teal-900 shadow-sm ring-1 ring-teal-500/20'
                                : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden ring-2 ring-white">
                                    {room.lawyerId?.profileImage ? (
                                        <img src={room.lawyerId.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center relative">
                                            <User size={20} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-left min-w-0">
                                <p className="font-bold text-sm truncate">{room.lawyerId?.name}</p>
                                <div className="flex flex-col">
                                    {room.lastMessage ? (
                                        <>
                                            <p className="text-xs text-slate-500 truncate">
                                                {room.lastMessage.content}
                                            </p>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </>
                                    ) : (
                                        <p className="text-xs text-slate-400 truncate">Online Consultation</p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-transparent">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <button
                            onClick={() => router.push('/user/chat')}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 ring-4 ring-teal-50/50 flex items-center justify-center overflow-hidden">
                                    {roomInfo?.lawyerId?.profileImage ? (
                                        <img src={roomInfo.lawyerId.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-teal-600" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">{roomInfo?.lawyerId?.name || 'Loading...'}</h2>
                                <p className="text-xs text-slate-500">Legal Consultation</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {roomInfo?.bookingId && (
                            <VideoCallButton bookingId={roomInfo.bookingId} role="user" />
                        )}
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 scroll-smooth bg-slate-50/30">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                            const isOwn = msg.senderId === user.id;
                            const prevMsg = messages[idx - 1];
                            const isGrouped = prevMsg && prevMsg.senderId === msg.senderId;

                            return (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isGrouped ? '-mt-4' : ''}`}
                                >
                                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                        {!isGrouped && (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-2">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}

                                        <div className={`group relative px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${isOwn
                                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.type === 'image' || isImageUrl(msg.content) ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={msg.content}
                                                        alt="Shared content"
                                                        className="max-w-full rounded-xl max-h-[400px] object-cover cursor-zoom-in hover:brightness-105 transition-all"
                                                        onClick={() => setSelectedImage(msg.content)}
                                                    />
                                                    {msg.fileName && <p className="text-xs opacity-80 font-medium truncate">{msg.fileName}</p>}
                                                </div>
                                            ) : msg.type === 'document' ? (
                                                <a
                                                    href={msg.content}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-3 p-2 rounded-xl transition-all ${isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-slate-50 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                                        <FileIcon size={20} className={isOwn ? 'text-white' : 'text-teal-600'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold truncate">{msg.fileName || 'Document'}</p>
                                                        {msg.fileSize && <p className="text-[10px] opacity-70 font-bold uppercase">{(Number(msg.fileSize) / 1024).toFixed(1)} KB</p>}
                                                    </div>
                                                </a>
                                            ) : (
                                                <p className="text-[15px] leading-relaxed break-words font-medium">{msg.content}</p>
                                            )}

                                            {isOwn && msg.readAt && (
                                                <div className="absolute -left-8 bottom-1 text-teal-500 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Dot size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {isOwn && msg.readAt && (
                                            <span className="text-[9px] font-bold text-teal-600 uppercase mt-1 mr-1">Read</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input Area */}
                <footer className="p-4 lg:p-6 bg-white border-t border-slate-100">
                    <div className="max-w-5xl mx-auto flex items-center gap-3 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner ring-1 ring-slate-200/50">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || !isConnected}
                            className="p-3 text-slate-400 hover:text-teal-600 hover:bg-white rounded-full transition-all disabled:opacity-50 shadow-sm hover:shadow"
                        >
                            {isUploading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-teal-500 rounded-full border-t-transparent"></div>
                            ) : (
                                <Paperclip size={22} />
                            )}
                        </button>

                        <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your message here..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium py-3 px-2"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || !isConnected}
                                className="bg-teal-500 hover:bg-teal-600 active:scale-95 disabled:opacity-50 disabled:grayscale p-3.5 rounded-full text-white shadow-xl shadow-teal-500/20 transition-all"
                            >
                                <Send size={22} />
                            </button>
                        </form>
                    </div>
                </footer>
            </main>

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage || ''}
            />
        </div>
    );
}
