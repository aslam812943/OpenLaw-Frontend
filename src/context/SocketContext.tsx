'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BASE_URL } from '@/constants/routes';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const lawyer = useSelector((state: RootState) => state.lawyer);
    const pathname = usePathname();

    useEffect(() => {
        const currentId = lawyer.id || user.id;

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

            socketInstance.on('disconnect', (reason) => {
                setIsConnected(false);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            console.log('No user/lawyer ID found, skipping socket initialization');
        }
    }, [user.id, lawyer.id, pathname]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
