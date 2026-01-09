import axios from "axios";
import { API_ROUTES, BASE_URL } from "@/constants/routes";

export const checkChatAccess = async (lawyerId: string) => {
    try {
        const response = await axios.get(
            `${BASE_URL}${API_ROUTES.CHAT.CHECK_ACCESS(lawyerId)}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        return { success: false, hasAccess: false };
    }
};

export const getChatRoom = async (lawyerId: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${API_ROUTES.CHAT.GET_ROOM}`,
            { lawyerId },
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get chat room");
    }
};

export const getMessages = async (roomId: string, role: 'user' | 'lawyer' = 'user') => {
    try {
        const endpoint = role === 'user'
            ? API_ROUTES.CHAT.GET_MESSAGES(roomId)
            : API_ROUTES.CHAT.LAWYER_MESSAGES(roomId);

        const response = await axios.get(
            `${BASE_URL}${endpoint}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch messages");
    }
};

export const getUserRooms = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}${API_ROUTES.CHAT.USER_ROOMS}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch chat rooms");
    }
};

export const getLawyerRooms = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}${API_ROUTES.CHAT.LAWYER_ROOMS}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch chat rooms");
    }
};

export const getRoomById = async (roomId: string, role: 'user' | 'lawyer' = 'user') => {
    try {
        const endpoint = role === 'user'
            ? API_ROUTES.CHAT.GET_ROOM_BY_ID(roomId)
            : API_ROUTES.CHAT.LAWYER_GET_ROOM_BY_ID(roomId);

        const response = await axios.get(
            `${BASE_URL}${endpoint}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch room details");
    }
};

export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            `${BASE_URL}${API_ROUTES.CHAT.UPLOAD_FILE || '/chat/upload'}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to upload file");
    }
};
export const canJoinCall = async (bookingId: string) => {
    console.log(bookingId)
    try {
        const response = await axios.get(
            `${BASE_URL}${API_ROUTES.CHAT.CAN_JOIN_CALL(bookingId)}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to check join status");
    }
};

export const joinCall = async (bookingId: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${API_ROUTES.CHAT.JOIN_CALL(bookingId)}`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to join call");
    }
};
