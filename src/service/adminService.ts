import apiClient from "../utils/apiClient";
import { API_ROUTES } from "../constants/routes";
import { CommonResponse } from "./userService";




export const adminLogin = async (data: { email: string; password: string }): Promise<CommonResponse<any>> => {
  return apiClient.post<CommonResponse<any>>(API_ROUTES.ADMIN.LOGIN, data);
};

export const logoutAdmin = async () => {
  try {
    const response: any = await apiClient.post(API_ROUTES.ADMIN.LOGOUT_ADMIN);
    return {
      success: true,
      message: response.message || "Logged out successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred during logout.",
    };
  }
};

export const createSubscription = async (data: any): Promise<CommonResponse<any>> => {
  return apiClient.post<CommonResponse<any>>(API_ROUTES.ADMIN.CREATESUBSCRIPTION, data);
};

export const fetchSubscriptions = async (page: number = 1, limit: number = 10): Promise<CommonResponse<any>> => {
  return apiClient.get<CommonResponse<any>>(API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS, {
    params: { page, limit },
  });
};

export const toggleSubscriptionStatus = async (id: string, status: boolean): Promise<CommonResponse<any>> => {
  return apiClient.patch(`${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}/status`, { status });
};

export const updateSubscription = async (id: string, data: any): Promise<CommonResponse<any>> => {
  return apiClient.put(`${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}`, data);
};

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchPayments = async (filters: PaymentFilters): Promise<CommonResponse<any>> => {
  return apiClient.get<CommonResponse<any>>(API_ROUTES.ADMIN.PAYMENTS, {
    params: filters,
  });
};

export const fetchDashboardStats = async (startDate?: string, endDate?: string): Promise<CommonResponse<any>> => {
  return apiClient.get<CommonResponse<any>>(API_ROUTES.ADMIN.DASHBOARD_STATS, {
    params: { startDate, endDate },
  });
};

export const fetchPendingPayouts = async (): Promise<CommonResponse<any[]>> => {
  return apiClient.get<CommonResponse<any[]>>(API_ROUTES.ADMIN.PAYOUT_PENDING);
};

export const approvePayout = async (id: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.APPROVE_PAYOUT(id));
};



export const fetchBookings = async (page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<CommonResponse<any>> => {
  return apiClient.get(API_ROUTES.ADMIN.BOOKINGS, {
    params: { page, limit, status, search, date }
  });
};

/* ============================================================
    SPECIALIZATION MANAGEMENT
============================================================ */
export const fetchSpecializations = async (): Promise<CommonResponse<any[]>> => {
  return apiClient.get<CommonResponse<any[]>>(API_ROUTES.ADMIN.SPECIALIZATIONS);
};

export const createSpecialization = async (data: { name: string; description?: string }): Promise<CommonResponse<any>> => {
  return apiClient.post<CommonResponse<any>>(API_ROUTES.ADMIN.SPECIALIZATIONS, data);
};

export const updateSpecialization = async (id: string, data: { name?: string; description?: string; isActive?: boolean }): Promise<CommonResponse<any>> => {
  return apiClient.put<CommonResponse<any>>(API_ROUTES.ADMIN.SPECIALIZATION(id), data);
};

export const deleteSpecialization = async (id: string): Promise<CommonResponse<any>> => {
  return apiClient.delete<CommonResponse<any>>(API_ROUTES.ADMIN.SPECIALIZATION(id));
};