'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from '@/components/user/UserSidebar';
import UserHeader from '@/components/user/userHeader'
 
export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const shouldHideSidebar = pathname.startsWith('/user/lawyers');

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <UserHeader />

            <div className="flex flex-1 overflow-hidden">
                {!shouldHideSidebar && <UserSidebar />}

                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
