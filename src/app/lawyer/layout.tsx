'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LawyerHeader from '@/components/lawyer/LawyersHeader';
import LawyerSidebar from '@/components/lawyer/LawyerSidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { getprofile } from "@/service/lawyerService";
import SubscriptionPlans from "@/components/lawyer/SubscriptionPlans";

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.lawyer);
    const [isVerified, setIsVerified] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getprofile();
                if (response?.success && response?.data?.paymentVerify) {
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                }
            } catch (error) {
                console.error("Layout status check failed:", error);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [pathname]);

    const isWhiteListedPage =
        pathname === '/lawyer/verification' ||
        pathname === '/lawyer/profile' ||
        pathname.startsWith('/lawyer/subscription/success');

    if (pathname === '/lawyer/verification') {
        return <>{children}</>;
    }

    if (loading && !isWhiteListedPage) {
        return (
            <div className="flex flex-col h-screen bg-slate-50">
                <LawyerHeader lawyerName={user.name ?? ''} />
                <div className="flex flex-1 overflow-hidden">
                    <LawyerSidebar />
                    <main className="flex-1 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            <LawyerHeader lawyerName={user.name ?? ''} />
            <div className="flex flex-1 overflow-hidden">
                <LawyerSidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {!isVerified && !isWhiteListedPage ? (
                        <SubscriptionPlans />
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
}
