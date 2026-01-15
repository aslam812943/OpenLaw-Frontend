import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "../constants/routes";


export const apiInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error) => {
        const massage = error.response?.data?.message || "An unexpected error occurred.";


        return Promise.reject(new Error(massage));
    }
);


const apiClient = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiInstance.get<T, T>(url, config),

    post: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.post<T, T, D>(url, data, config),

    put: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.put<T, T, D>(url, data, config),

    patch: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) =>
        apiInstance.patch<T, T, D>(url, data, config),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiInstance.delete<T, T>(url, config),
};

export default apiClient;
