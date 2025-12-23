'use client';

import React, { useState } from 'react';
import AdminSideBar from '@/components/AdminSIdeBar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

 
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-neutral-900">
            <AdminSideBar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
            />
            <main className="flex-1 overflow-y-auto h-screen transition-all duration-300">
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
