'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRooms } from '@/service/chatService';
import { MessageSquare, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '@/utils/alerts';
import { useSocket } from '@/context/SocketContext';

export default function UserChatListPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getUserRooms();
                if (res.success) {
                    setRooms(res.data);
                }
            } catch (error) {
                showToast('error', 'Failed to fetch chat rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        if (socket && isConnected && rooms.length > 0) {
            rooms.forEach(room => {
                socket.emit('join-room', { roomId: room.id });
            });

            const handleNewMessage = (message: any) => {
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
            };

            socket.on('new-message', handleNewMessage);

            return () => {
                socket.off('new-message', handleNewMessage);
            };
        }
    }, [socket, isConnected, rooms.length]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Messages</h1>
                <p className="mt-2 text-lg text-slate-600">Secure consultations with your legal experts</p>
            </motion.div>

            {rooms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center bg-white rounded-3xl p-20 border border-slate-100 shadow-xl shadow-slate-200/50 text-center"
                >
                    <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-teal-50/50">
                        <MessageSquare size={40} className="text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Your inbox is empty</h3>
                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Start a conversation by booking a consultation with one of our expert lawyers.
                    </p>
                </motion.div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {rooms.map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => router.push(`/user/chat/${room.id}`)}
                            className="group relative bg-white p-1 rounded-[2rem] shadow-sm border border-slate-100 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="p-5 flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                                        {room.lawyerId?.profileImage ? (
                                            <img src={room.lawyerId.profileImage} alt={room.lawyerId.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={32} className="text-slate-300" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                                            {room.lawyerId?.name || 'Legal Expert'}
                                        </h3>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap">
                                            {new Date(room.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span>
                                                {room.lastMessage ? (
                                                    room.lastMessage.content
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} /> Created {new Date(room.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </span>
                                            {room.lastMessage && (
                                                <span className="text-[10px] text-slate-400 mt-0.5">
                                                    {new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-teal-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                                    <ArrowRight size={22} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
