import apiClient from "../utils/apiClient";
import { API_ROUTES } from "@/constants/routes";
import { CommonResponse } from "./lawyerService";

export interface ChatAccessResponse {
    hasAccess: boolean;
}

export interface ChatRoom {
    id: string;

}

export const checkChatAccess = async (lawyerId: string): Promise<ChatAccessResponse> => {
    try {
        const response = await apiClient.get<CommonResponse<ChatAccessResponse>>(API_ROUTES.CHAT.CHECK_ACCESS(lawyerId));
        return { hasAccess: response?.hasAccess ?? false };
    } catch (error: any) {
        return { hasAccess: false };
    }
};

export const getChatRoom = async (lawyerId: string): Promise<CommonResponse<ChatRoom>> => {
    return apiClient.post<CommonResponse<ChatRoom>>(API_ROUTES.CHAT.GET_ROOM, { lawyerId });
};

export const getMessages = async (roomId: string, role: 'user' | 'lawyer' = 'user') => {
    const endpoint = role === 'user'
        ? API_ROUTES.CHAT.GET_MESSAGES(roomId)
        : API_ROUTES.CHAT.LAWYER_MESSAGES(roomId);

    return apiClient.get(endpoint);
};

export const getUserRooms = async () => {
    return apiClient.get(API_ROUTES.CHAT.USER_ROOMS);
};

export const getLawyerRooms = async () => {
    return apiClient.get(API_ROUTES.CHAT.LAWYER_ROOMS);
};

export const getRoomById = async (roomId: string, role: 'user' | 'lawyer' = 'user') => {
    const endpoint = role === 'user'
        ? API_ROUTES.CHAT.GET_ROOM_BY_ID(roomId)
        : API_ROUTES.CHAT.LAWYER_GET_ROOM_BY_ID(roomId);

    return apiClient.get(endpoint);
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(API_ROUTES.CHAT.UPLOAD_FILE || '/chat/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const canJoinCall = async (bookingId: string) => {
    return apiClient.get(API_ROUTES.CHAT.CAN_JOIN_CALL(bookingId));
};

export const joinCall = async (bookingId: string) => {
    return apiClient.post(API_ROUTES.CHAT.JOIN_CALL(bookingId), {});
};
