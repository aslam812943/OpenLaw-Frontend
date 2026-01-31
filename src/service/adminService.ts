import apiClient from "../utils/apiClient";
import { API_ROUTES } from "../constants/routes";
import { CommonResponse } from "./userService";




export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  planName: string;
  duration: number;
  durationUnit: string;
  price: number;
  commissionPercent: number;
  isActive: boolean;
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  lawyerName: string;
  userName: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  transactionId: string;
  date: string;
  paymentMethod: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCommission: number;
  bookingStats: {
    completed: number;
    cancelled: number;
    pending: number;
    rejected: number;
    confirmed: number;
  };
  withdrawalStats: {
    totalWithdrawn: number;
    pendingWithdrawals: number;
  };
  topLawyers: { name: string; revenue: number; bookings: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface Payout {
  id: string;
  lawyerId: string;
  lawyerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  isBlock?: boolean;
  email?: string;
}

export interface Booking {
  id: string;
  userName: string;
  lawyerName: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  adminCommission: number;
  lawyerEarnings: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
}

export const adminLogin = async (data: { email: string; password: string }): Promise<CommonResponse<AdminLoginResponse>> => {
  return apiClient.post<CommonResponse<AdminLoginResponse>>(API_ROUTES.ADMIN.LOGIN, data);
};

export const logoutAdmin = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<CommonResponse>(API_ROUTES.ADMIN.LOGOUT_ADMIN);
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

export const createSubscription = async (data: Omit<SubscriptionPlan, 'id' | 'isActive'>): Promise<CommonResponse<SubscriptionPlan>> => {
  return apiClient.post<CommonResponse<SubscriptionPlan>>(API_ROUTES.ADMIN.CREATESUBSCRIPTION, data);
};

export const fetchSubscriptions = async (page: number = 1, limit: number = 10): Promise<CommonResponse<{ plans: SubscriptionPlan[], total: number }>> => {
  return apiClient.get<CommonResponse<{ plans: SubscriptionPlan[], total: number }>>(API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS, {
    params: { page, limit },
  });
};

export const toggleSubscriptionStatus = async (id: string, status: boolean): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(`${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}/status`, { status });
};

export const updateSubscription = async (id: string, data: Partial<SubscriptionPlan>): Promise<CommonResponse<SubscriptionPlan>> => {
  return apiClient.put<CommonResponse<SubscriptionPlan>>(`${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}`, data);
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

export const fetchPayments = async (filters: PaymentFilters): Promise<CommonResponse<{ payments: Payment[], total: number }>> => {
  return apiClient.get<CommonResponse<{ payments: Payment[], total: number }>>(API_ROUTES.ADMIN.PAYMENTS, {
    params: filters,
  });
};

export const fetchDashboardStats = async (startDate?: string, endDate?: string): Promise<CommonResponse<DashboardStats>> => {
  return apiClient.get<CommonResponse<DashboardStats>>(API_ROUTES.ADMIN.DASHBOARD_STATS, {
    params: { startDate, endDate },
  });
};

export const fetchPendingPayouts = async (): Promise<CommonResponse<Payout[]>> => {
  return apiClient.get<CommonResponse<Payout[]>>(API_ROUTES.ADMIN.PAYOUT_PENDING);
};

export const approvePayout = async (id: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(API_ROUTES.ADMIN.APPROVE_PAYOUT(id));
};

export const fetchBookings = async (page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<CommonResponse<{ bookings: Booking[], total: number }>> => {
  return apiClient.get<CommonResponse<{ bookings: Booking[], total: number }>>(API_ROUTES.ADMIN.BOOKINGS, {
    params: { page, limit, status, search, date }
  });
};


/* ============================================================
    SPECIALIZATION MANAGEMENT
============================================================ */
export const fetchSpecializations = async (): Promise<CommonResponse<Specialization[]>> => {
  return apiClient.get<CommonResponse<Specialization[]>>(API_ROUTES.ADMIN.SPECIALIZATIONS);
};

export const createSpecialization = async (data: { name: string; description?: string }): Promise<CommonResponse<Specialization>> => {
  return apiClient.post<CommonResponse<Specialization>>(API_ROUTES.ADMIN.SPECIALIZATIONS, data);
};

export const updateSpecialization = async (id: string, data: { name?: string; description?: string; isActive?: boolean }): Promise<CommonResponse<Specialization>> => {
  return apiClient.put<CommonResponse<Specialization>>(API_ROUTES.ADMIN.SPECIALIZATION(id), data);
};

export const deleteSpecialization = async (id: string): Promise<CommonResponse<void>> => {
  return apiClient.delete<CommonResponse<void>>(API_ROUTES.ADMIN.SPECIALIZATION(id));
};