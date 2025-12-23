'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from '@/components/UserSidebar';
import UserHeader from '@/components/user/userHeader'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const shouldHideSidebar = pathname.startsWith('/user/lawyers');

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <UserHeader />

            <div className="flex flex-1">
                {!shouldHideSidebar && <UserSidebar />}

                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
