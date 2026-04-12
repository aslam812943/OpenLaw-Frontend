'use client';

import { useEffect } from 'react';
import { apiInstance } from '@/utils/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/alerts';
import { clearUserData } from '@/redux/userSlice';
import { clearLawyerData } from '@/redux/lawyerSlice';
import { RootState } from '@/redux/store';
import apiClient from '@/utils/apiClient';

export default function AxiosInterceptor() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const lawyer = useSelector((state: RootState) => state.lawyer);

    useEffect(() => {
        const interceptor = apiInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response ? error.response.status : null;
                const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

                if (status === 401) {
                    dispatch(clearUserData());
                    dispatch(clearLawyerData());

                    if (isAdminPath) {
                        router.push('/admin/login');
                    } else {
                        router.push('/login');
                    }
                    return Promise.reject(error);
                }

                if (status === 403) {
                    const errorMessage = error.response.data?.message;

                    if (errorMessage === "Your account has been blocked or disabled.") {
                        dispatch(clearUserData());
                        dispatch(clearLawyerData());
                        showToast('error', "Your account has been blocked by the admin.");
                        router.push('/login');
                    } else if (isAdminPath) {
                        router.push('/admin/login');
                    } else {
                        router.push('/login');
                    }
                }
                return Promise.reject(error);
            }
        );


        const checkSession = async () => {
            if (user.id || lawyer.id) {
                try {

                    const endpoint = user.id ? '/api/user/profile' : '/api/lawyer/profile';
                    await apiClient.get(endpoint);
                } catch (error) {
                }
            }
        };

        checkSession();

        return () => {
            apiInstance.interceptors.response.eject(interceptor);
        };
    }, [dispatch, router, user.id, lawyer.id]);

    return null;
}
