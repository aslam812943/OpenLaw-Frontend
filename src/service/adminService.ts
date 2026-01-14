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

export const fetchSubscriptions = async (): Promise<CommonResponse<any[]>> => {
  return apiClient.get<CommonResponse<any[]>>(API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS);
};

export const toggleSubscriptionStatus = async (id: string, status: boolean) => {
  return apiClient.patch(`${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}/status`, { status });
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