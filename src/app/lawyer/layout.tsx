'use client';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import LawyerHeader from '@/components/LawyersHeader';
import LawyerSidebar from '@/components/LawyerSidebar';
import { usePathname } from 'next/navigation';
export default function LawyerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const user = useSelector((state: RootState) => state.lawyer);
    const isLoginPage = pathname === '/lawyer/verification';
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <LawyerHeader lawyerName={user.name ?? ''} />
            <div className="flex flex-1 overflow-hidden">
                <LawyerSidebar />
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
