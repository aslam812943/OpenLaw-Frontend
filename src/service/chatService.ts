import apiClient from "../utils/apiClient";
import { API_ROUTES } from "@/constants/routes";
import { CommonResponse } from "./userService";

export interface ChatAccessResponse {
    hasAccess: boolean;
}

export interface ChatRoom {
    id: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    senderRole?: 'user' | 'lawyer';
    type: 'text' | 'image' | 'video' | 'document' | 'file';
    readAt?: string | null;
    fileName?: string;
    fileSize?: string | number;
    fileUrl?: string;
    createdAt: string;
}

export interface ChatRoomDetails {
    id: string;
    lawyerId: {
        id: string;
        name: string;
        profileImage?: string;
        isOnline?: boolean;
    };
    userId: {
        id: string;
        name: string;
        profileImage?: string;
        isOnline?: boolean;
    } | string;
    bookingId?: string;
    lawyerName: string;
    userName: string;
    lastMessage?: {
        content: string;
        createdAt: string;
    };
    updatedAt: string;
}

export const checkChatAccess = async (lawyerId: string): Promise<ChatAccessResponse> => {
    try {
        const response = await apiClient.get<CommonResponse<ChatAccessResponse>>(API_ROUTES.CHAT.CHECK_ACCESS(lawyerId));
        return { hasAccess: response?.data?.hasAccess ?? false };
    } catch (error: unknown|string) {
        return { hasAccess: false };
    }
};

export const getChatRoom = async (params: { lawyerId?: string; userId?: string }): Promise<CommonResponse<ChatRoom>> => {
    const endpoint = params.userId
        ? API_ROUTES.CHAT.LAWYER_GET_ROOM
        : API_ROUTES.CHAT.GET_ROOM;
    return apiClient.post<CommonResponse<ChatRoom>>(endpoint, params);
};

export const getMessages = async (roomId: string, role: 'user' | 'lawyer' = 'user'): Promise<CommonResponse<Message[]>> => {
    const endpoint = role === 'user'
        ? API_ROUTES.CHAT.GET_MESSAGES(roomId)
        : API_ROUTES.CHAT.LAWYER_MESSAGES(roomId);

    return apiClient.get(endpoint);
};

export const getUserRooms = async (): Promise<CommonResponse<ChatRoomDetails[]>> => {
    return apiClient.get(API_ROUTES.CHAT.USER_ROOMS);
};

export const getLawyerRooms = async (): Promise<CommonResponse<ChatRoomDetails[]>> => {
    return apiClient.get(API_ROUTES.CHAT.LAWYER_ROOMS);
};

export const getRoomById = async (roomId: string, role: 'user' | 'lawyer' = 'user'): Promise<CommonResponse<ChatRoomDetails>> => {
    const endpoint = role === 'user'
        ? API_ROUTES.CHAT.GET_ROOM_BY_ID(roomId)
        : API_ROUTES.CHAT.LAWYER_GET_ROOM_BY_ID(roomId);

    return apiClient.get(endpoint);
};

export const uploadFile = async (file: File): Promise<CommonResponse<{ fileUrl: string; fileName: string; fileSize: number }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<CommonResponse<{ fileUrl: string; fileName: string; fileSize: number }>>(API_ROUTES.CHAT.UPLOAD_FILE || '/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const canJoinCall = async (bookingId: string): Promise<CommonResponse<{ canJoin: boolean, callId: string }>> => {
    return apiClient.get(API_ROUTES.CHAT.CAN_JOIN_CALL(bookingId));
};

export const joinCall = async (bookingId: string): Promise<CommonResponse<{ token: string, callId: string }>> => {
    return apiClient.post(API_ROUTES.CHAT.JOIN_CALL(bookingId), {});
};
