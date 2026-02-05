'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BASE_URL } from '@/constants/routes';
import {
    fetchNotifications,
    markNotificationAsRead as userMarkRead,
    markAllNotificationsAsRead,
    Notification
} from '@/service/userService';
import {
    fetchLawyerNotifications,
    markLawyerNotificationAsRead as lawyerMarkRead,
    markAllLawyerNotificationsAsRead
} from '@/service/lawyerService';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    clearNotifications: () => void;
    markAsRead: (id?: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    notifications: [],
    unreadCount: 0,
    clearNotifications: () => { },
    markAsRead: async () => { }
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const user = useSelector((state: RootState) => state.user);
    const lawyer = useSelector((state: RootState) => state.lawyer);

    const isLawyerRole = !!(lawyer.id && lawyer.role === 'lawyer');
    const currentId = isLawyerRole ? lawyer.id : user.id;

    
    useEffect(() => {
        if (!currentId) {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [currentId]);

    // Fetch initial notifications
    useEffect(() => {
        const loadNotifications = async () => {
            if (currentId) {
                try {
                    const response = isLawyerRole
                        ? await fetchLawyerNotifications(currentId)
                        : await fetchNotifications(currentId);

                    if (response.success && Array.isArray(response.data)) {
                        setNotifications(response.data);
                        setUnreadCount(response.data.filter(n => !n.isRead).length);
                    }
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };
        loadNotifications();
    }, [currentId, isLawyerRole]);

    useEffect(() => {
        if (currentId) {
            const socketInstance = io(BASE_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => {
                setIsConnected(true);
            });

            socketInstance.on('connect_error', (err) => {
                setIsConnected(false);
            });

            socketInstance.on('disconnect', () => {
                setIsConnected(false);
            });

            socketInstance.on('notification', (data: any) => {
                
                setNotifications(prev => [data, ...prev]);
                setUnreadCount(prev => prev + 1);
                
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [currentId]);

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const markAsRead = async (id?: string) => {
        if (!currentId) return;

        try {
            if (id) {
                // Mark single as read
                if (isLawyerRole) {
                    await lawyerMarkRead(id);
                } else {
                    await userMarkRead(id);
                }
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                // Mark all as read
                if (isLawyerRole) {
                    await markAllLawyerNotificationsAsRead(currentId);
                } else {
                    await markAllNotificationsAsRead(currentId);
                }
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            notifications,
            unreadCount,
            clearNotifications,
            markAsRead
        }}>
            {children}
        </SocketContext.Provider>
    );
};
