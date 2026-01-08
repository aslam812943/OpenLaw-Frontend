'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLawyerRooms } from '@/service/chatService';
import { MessageSquare, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '@/utils/alerts';

export default function LawyerChatListPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getLawyerRooms();
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
                <h1 className="text-2xl font-bold text-slate-900">Patient Chats</h1>
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
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                    {room.userId?.profileImage ? (
                                        <img src={room.userId.profileImage} alt={room.userId.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                        {room.userId?.name || 'Unknown Patient'}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> Created {new Date(room.createdAt).toLocaleDateString()}
                                        </span>
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
