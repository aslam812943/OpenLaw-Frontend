import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL, API_ROUTES } from "../constants/routes";
import { store } from "@/redux/store";
import { clearUserData } from "@/redux/userSlice";
import { clearLawyerData } from "@/redux/lawyerSlice";


export const apiInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


const REFRESH_TOKEN_URL = "/user/refresh";

interface QueueItem {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error: { config: AxiosRequestConfig & { _retry?: boolean }; response?: AxiosResponse<{ message?: string; errors?: string }> }) => {
        const originalRequest = error.config;
        const message = error.response?.data?.message || error.response?.data?.errors || error.response?.statusText || "An unexpected error occurred.";

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${BASE_URL}${API_ROUTES.USER.REFRESH_TOKEN_URL}`, {}, { withCredentials: true });
                processQueue(null);
                return apiInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                store.dispatch(clearUserData());
                store.dispatch(clearLawyerData());
                localStorage.removeItem("userData");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const finalMessage = typeof message === 'string' ? message : "An unexpected error occurred.";
        return Promise.reject(new Error(finalMessage));
    }
);


const apiClient = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiInstance.get<T, T>(url, config),

    post: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.post<T, T, D>(url, data, config),

    put: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.put<T, T, D>(url, data, config),

    patch: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.patch<T, T, D>(url, data, config),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiInstance.delete<T, T>(url, config),
};

export default apiClient;
