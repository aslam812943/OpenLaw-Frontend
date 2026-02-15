'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLawyerRooms } from '@/service/chatService';
import { MessageSquare, Clock, ArrowRight, User, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '@/utils/alerts';
import { useSocket } from '@/context/SocketContext';

export default function LawyerChatListPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getLawyerRooms();
                if (res.success) {
                    const roomMap = new Map<string, any>();

                    res.data.forEach((room: any) => {
                        const userId = typeof room.userId === 'object' ? room.userId.id || room.userId._id : room.userId;
                        if (!roomMap.has(userId) || new Date(room.updatedAt) > new Date(roomMap.get(userId).updatedAt)) {
                            roomMap.set(userId, room);
                        }
                    });

                    const consolidatedRooms = Array.from(roomMap.values()).sort((a, b) =>
                        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );

                    setRooms(consolidatedRooms);
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
        if (socket && isConnected) {
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
            <div className="flex items-center justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">  Chats</h1>
                <p className="text-sm text-slate-500">{rooms.length} Active Conversations</p>
            </div>

            {rooms.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No chats yet</h3>
                    <p className="text-slate-500">When patients book and message you, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {rooms.map((room) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => router.push(`/lawyer/chat/${room.id}`)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                        {room.userId?.profileImage ? (
                                            <img src={room.userId.profileImage} alt={room.userId.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={24} className="text-slate-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                        {room.userId?.name || 'Unknown Patient'}
                                    </h3>
                                    <div className="flex flex-col">
                                        <span>
                                            {room.lastMessage ? (
                                                room.lastMessage.type === 'image' || (typeof room.lastMessage.content === 'string' && room.lastMessage.content.startsWith('https://res.cloudinary.com') && (room.lastMessage.content.includes('/image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(room.lastMessage.content))) ? (
                                                    <span className="flex items-center gap-1.5 text-teal-600 font-semibold italic">
                                                        <ImageIcon size={14} /> Image
                                                    </span>
                                                ) : room.lastMessage.content
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
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
