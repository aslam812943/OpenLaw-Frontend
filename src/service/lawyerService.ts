import { API_ROUTES } from "@/constants/routes";
import apiClient from "../utils/apiClient";
import { Notification, CommonResponse } from "./userService";

export const fetchLawyerNotifications = async (userId: string): Promise<CommonResponse<Notification[]>> => {
  return apiClient.get<CommonResponse<Notification[]>>(API_ROUTES.NOTIFICATION.GET_LAWYER(userId));
};

export const markLawyerNotificationAsRead = async (id: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(API_ROUTES.NOTIFICATION.MARK_READ_LAWYER(id));
};

export const markAllLawyerNotificationsAsRead = async (userId: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(`${API_ROUTES.NOTIFICATION.MARK_READ_LAWYER('all')}?userId=${userId}&all=true`);
};

export interface Lawyer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  address?: any;
  city?: string;
  state?: string;
  profileImage?: string;
  bio?: string;
  consultationFee?: number;
  isPassword?: boolean;
  verificationStatus?: string;
  isVerified: boolean;
  isBlock: boolean;
  paymentVerify?: boolean;
}

export interface PaginatedLawyerResponse {
  lawyers: Lawyer[];
  total: number;
  totalCount?: number;
}

// Using CommonResponse from userService

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ScheduleRule {
  id: string;
  lawyerId?: string;
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  availableDays: string[];
  bufferTime: string | number;
  slotDuration: string | number;
  maxBookings: string | number;
  sessionType: string;
  exceptionDays: string[];
}

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  date: string;
  isBooked: boolean;
  consultationFee?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  status: string;
  paymentStatus: string;
  desctiption: string;
  commissionPercent?: number;
  lawyerFeedback?: string;
  consultationType?: string;
  lawyerId?: string;
  lawyerName?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: string;
  followUpType?: 'none' | 'specific' | 'deadline';
  followUpDate?: string;
  followUpTime?: string;
  followUpStatus?: 'none' | 'pending' | 'booked';
  parentBookingId?: string;
}

export interface Case {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  desctiption: string;
  status: string;
  caseNumber?: string;
  createdAt?: string;
}

export interface Transaction {
  bookingId: string;
  date: string;
  userName: string;
  amount: number;
  commissionAmount: number;
  netAmount: number;
  status: string;
  paymentStatus: string;
}

export interface Earnings {
  totalEarnings: number;
  walletBalance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
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

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LawyerDashboardStats {
  totalEarnings: number;
  totalConsultations: number;
  bookingStats: {
    completed: number;
    cancelled: number;
    pending: number;
    rejected: number;
    confirmed: number;
  };
  monthlyEarnings: { month: string; earnings: number }[];
}

/* ============================================================
   FETCH LAWYERS
============================================================ */
export const fetchLawyers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filter?: string,
  sort?: string
): Promise<PaginatedLawyerResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(filter && { filter }),
    ...(sort && { sort }),
  });

  const response = await apiClient.get<CommonResponse<PaginatedLawyerResponse>>(
    `${API_ROUTES.ADMIN.FETCH_LAWYERS}?${queryParams.toString()}`
  );

  return {
    lawyers: response?.data?.lawyers || [],
    total: response?.data?.total || 0,
  };
};

/* ============================================================
    BLOCK LAWYER
============================================================ */
export const blockLawyer = async (id: string) => {
  return apiClient.patch(API_ROUTES.ADMIN.BLOCK_LAWYER(id));
};

/* ============================================================
    UNBLOCK LAWYER
============================================================ */
export const unBlockLawyer = async (id: string) => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.UNBLOCK_LAWYER(id));
  return response.message;
};

/* ============================================================
    APPROVE LAWYER
============================================================ */
export const approveLawyer = async (id: string, email: string) => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.APPROVE_LAWYER(id), { email });
  return response.message;
};

/* ============================================================
    REJECT LAWYER
============================================================ */
export const rejectLawyer = async (
  id: string,
  email: string,
  reason?: string
) => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.REJECT_LAWYER(id), { email, reason });
  return response.message;
};

/* ============================================================
    LOGOUT LAWYER
============================================================ */
export const logoutLawyer = async () => {
  const response = await apiClient.post<CommonResponse>(API_ROUTES.LAWYER.LOGOUT_LAWYER);
  return response.message;
};

/* ============================================================
    CREATE SCHEDULE
============================================================ */
export const scheduleCreate = async (ruleData: Omit<ScheduleRule, 'id' | 'lawyerId'>): Promise<CommonResponse<ScheduleRule>> => {
  return apiClient.post<CommonResponse<ScheduleRule>>(API_ROUTES.LAWYER.SCHEDULE_CREATE, { ruleData });
};

export const lawyerRegister = async (data: any): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.LAWYER.REGISTER, data);
};

export const submitVerificationDetails = async (formData: FormData): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.LAWYER.VERIFY_DETAILS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ============================================================
    UPDATE SCHEDULE
============================================================ */
export const scheduleUpdate = async (updatedData: Partial<ScheduleRule>, ruleId: string): Promise<CommonResponse<ScheduleRule>> => {
  return apiClient.put<CommonResponse<ScheduleRule>>(`${API_ROUTES.LAWYER.SCHEDULE_UPDATE}/${ruleId}`, updatedData);
};

/* ============================================================
    FETCH ALL RULES
============================================================ */
export const fetchAllRules = async (): Promise<CommonResponse<ScheduleRule[]>> => {
  return apiClient.get<CommonResponse<ScheduleRule[]>>(API_ROUTES.LAWYER.FETCH_SCHEDULT_RULE);
};

/* ============================================================
    DELETE RULE
============================================================ */
export const deleteRule = async (id: string): Promise<CommonResponse<void>> => {
  return apiClient.delete<CommonResponse<void>>(`${API_ROUTES.LAWYER.DELETE_SCHEDULE_RULE}/${id}`);
};
export const getprofile = async (): Promise<Lawyer> => {
  const response = await apiClient.get<CommonResponse<Lawyer>>(API_ROUTES.LAWYER.GETPROFILE);
  return response.data;
};

export const updateProfile = async (formData: FormData): Promise<CommonResponse<Lawyer>> => {
  return apiClient.put(API_ROUTES.LAWYER.UPDATE_PROFILE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ============================================================
    CHANGE PASSWORD
============================================================ */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<CommonResponse<void>> => {
  return apiClient.put(API_ROUTES.LAWYER.CHANGE_PASSWORD, { oldPassword, newPassword });
};

export const getallLawyers = async (params?: any): Promise<CommonResponse<PaginatedLawyerResponse>> => {
  try {
    return await apiClient.get<CommonResponse<PaginatedLawyerResponse>>(API_ROUTES.USER.GETALL_LAWYERS, { params });
  } catch (err) {
    return { success: false, message: "Failed to fetch lawyers", data: { lawyers: [], total: 0 } };
  }
};



export const getSingleLawyer = async (id: string): Promise<CommonResponse<Lawyer>> => {
  return apiClient.get<CommonResponse<Lawyer>>(API_ROUTES.USER.SINGLE_LAWYER(id));
};



export const getallslots = async (id: string): Promise<CommonResponse<Slot[]>> => {
  try {
    return await apiClient.get<CommonResponse<Slot[]>>(API_ROUTES.USER.GETSLOTS(id));
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch slots", data: [] };
  }
};



export const getAppoiments = async (page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<CommonResponse<{ appointments: Appointment[], total: number }>> => {
  try {
    return await apiClient.get<CommonResponse<{ appointments: Appointment[], total: number }>>(API_ROUTES.LAWYER.APPOIMENTS, {
      params: { page, limit, status, search, date }
    });
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to fetch appointments", data: { appointments: [], total: 0 } };
  }
};

export const getAppointmentById = async (id: string): Promise<CommonResponse<Appointment>> => {
  try {
    return await apiClient.get<CommonResponse<Appointment>>(`${API_ROUTES.LAWYER.APPOIMENTS}/${id}`);
  } catch (err) {
    return { success: false, message: "Failed to fetch appointment details", data: {} as Appointment };
  }
};



export const updateAppointmentStatus = async (id: string, status: string, feedback?: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(API_ROUTES.LAWYER.APPOIMENTS_UPDATE_STATUS(id), { status, feedback });
};

export const setFollowUp = async (id: string, followUpType: 'none' | 'specific' | 'deadline', followUpDate?: string, followUpTime?: string, feedback?: string): Promise<CommonResponse<void>> => {
  return apiClient.post<CommonResponse<void>>(API_ROUTES.LAWYER.APPOIMENTS_FOLLOW_UP(id), { followUpType, followUpDate, followUpTime, feedback });
};



export const checksubscription = async (): Promise<CommonResponse<{ hasSubscription: boolean }>> => {
  try {
    return await apiClient.get<CommonResponse<{ hasSubscription: boolean }>>(API_ROUTES.LAWYER.CHECKSUBSCRIPTION);
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to check subscription", data: { hasSubscription: false } };
  }
};



export const getCurrentSubscription = async (): Promise<CommonResponse<any> | null> => {
  try {
    return await apiClient.get<CommonResponse<any>>(API_ROUTES.LAWYER.CURRENT_SUBSCRIPTION);
  } catch (error: any) {
    console.error(error);
    return null;
  }
};



export const getSubscriptionPlans = async (page: number = 1, limit: number = 10): Promise<CommonResponse<{ plans: SubscriptionPlan[], total: number }>> => {
  return apiClient.get<CommonResponse<{ plans: SubscriptionPlan[], total: number }>>(API_ROUTES.LAWYER.SUBSCRIPTIONS, { params: { page, limit } });
};


export const createSubscriptionCheckout = async (
  lawyerId: string,
  email: string,
  planName: string,
  price: number,
  subscriptionId: string
): Promise<CommonResponse<{ url: string }>> => {
  return apiClient.post(API_ROUTES.LAWYER.SUBSCRIPTION_CHECKOUT, {
    lawyerId,
    email,
    planName,
    price,
    subscriptionId,
  });
};



export const verifySubscriptionPayment = async (session_id: string): Promise<CommonResponse<{ success: boolean }>> => {
  return apiClient.post(API_ROUTES.LAWYER.SUBSCRIPTION_SUCCESS, { session_id });
};



export const fetchLawyerReviews = async (id: string): Promise<CommonResponse<Review[]>> => {
  try {
    return await apiClient.get<CommonResponse<Review[]>>(API_ROUTES.LAWYER.GET_REVIEWS(id));
  } catch (error: any) {
    console.error(error);
    return { success: false, message: "Failed to fetch reviews", data: [] };
  }
};



export const getLawyerCases = async (): Promise<CommonResponse<Case[]>> => {
  try {
    return await apiClient.get<CommonResponse<Case[]>>(API_ROUTES.LAWYER.GET_CASES);
  } catch (error: any) {
    console.error(error);
    return { success: false, message: "Failed to fetch cases", data: [] };
  }
};



export const getLawyerEarnings = async (): Promise<CommonResponse<Earnings>> => {
  return apiClient.get<CommonResponse<Earnings>>(API_ROUTES.LAWYER.GET_EARNINGS);
};



export const requestPayout = async (amount: number): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.LAWYER.REQUEST_PAYOUT, { amount });
};



export const getPayoutHistory = async (): Promise<CommonResponse<PayoutRequest[]>> => {
  return apiClient.get<CommonResponse<PayoutRequest[]>>(API_ROUTES.LAWYER.PAYOUT_HISTORY);
};



export const fetchLawyerDashboardStats = async (startDate?: string, endDate?: string): Promise<CommonResponse<LawyerDashboardStats>> => {
  return apiClient.get<CommonResponse<LawyerDashboardStats>>(API_ROUTES.LAWYER.DASHBOARD_STATS, {
    params: { startDate, endDate },
  });
};

export const fetchSpecializations = async (): Promise<CommonResponse<Specialization[]>> => {
  return apiClient.get<CommonResponse<Specialization[]>>(API_ROUTES.LAWYER.SPECIALIZATIONS);
};
