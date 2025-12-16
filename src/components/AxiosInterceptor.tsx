'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/alerts';
import { clearUserData } from '@/redux/userSlice';
import { clearLawyerData } from '@/redux/lawyerSlice';

export default function AxiosInterceptor() {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 403) {
                    const errorMessage = error.response.data?.message;

                    if (errorMessage === "Your account has been blocked or disabled.") {
                        // Clear Redux state
                        dispatch(clearUserData());
                        dispatch(clearLawyerData());

                        // // Show toast notification
                        // Toastify({
                        //     text: "Your account has been blocked by the admin.",
                        //     duration: 5000,
                        //     gravity: "top",
                        //     position: "center",
                        //     backgroundColor: "#ff4d4d",
                        //     stopOnFocus: true,
                        // }).showToast();
                        showToast('error',"Your account has been blocked by the admin.")
                        // Redirect to login
                        router.push('/login');
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [dispatch, router]);

    return null;
}
