import { API_ROUTES } from "@/constants/routes";
import apiClient from "../utils/apiClient";

export interface Lawyer {
  id: string;
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
}

export interface CommonResponse<T = any> {
  success: boolean;
  message: string;
  hasAccess?: boolean;
  data: T;
}

/* ============================================================
   FETCH LAWYERS
============================================================ */
export const fetchLawyers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedLawyerResponse> => {
  const response = await apiClient.get<CommonResponse<PaginatedLawyerResponse>>(
    `${API_ROUTES.ADMIN.FETCH_LAWYERS}?page=${page}&limit=${limit}`
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
export const scheduleCreate = async (ruleData: any): Promise<CommonResponse> => {
  return apiClient.post<CommonResponse>(API_ROUTES.LAWYER.SCHEDULE_CREATE, { ruleData });
};

export const lawyerRegister = async (data: any): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.LAWYER.REGISTER, data);
};

export const submitVerificationDetails = async (formData: FormData): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.LAWYER.VERIFY_DETAILS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ============================================================
    UPDATE SCHEDULE
============================================================ */
export const scheduleUpdate = async (updatedData: any, ruleId: string): Promise<CommonResponse> => {
  return apiClient.put<CommonResponse>(`${API_ROUTES.LAWYER.SCHEDULE_UPDATE}/${ruleId}`, updatedData);
};

/* ============================================================
    FETCH ALL RULES
============================================================ */
export const fetchAllRules = async (): Promise<CommonResponse<any[]>> => {
  return apiClient.get<CommonResponse<any[]>>(API_ROUTES.LAWYER.FETCH_SCHEDULT_RULE);
};

/* ============================================================
    DELETE RULE
============================================================ */
export const deleteRule = async (id: string): Promise<CommonResponse> => {
  return apiClient.delete<CommonResponse>(`${API_ROUTES.LAWYER.DELETE_SCHEDULE_RULE}/${id}`);
};
export const getprofile = async () => {
  const response = await apiClient.get<CommonResponse<Lawyer>>(API_ROUTES.LAWYER.GETPROFILE);
  return response.data;
};

export const updateProfile = async (formData: FormData) => {
  return apiClient.put(API_ROUTES.LAWYER.UPDATE_PROFILE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ============================================================
    CHANGE PASSWORD
============================================================ */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  return apiClient.put(API_ROUTES.LAWYER.CHANGE_PASSWORD, { oldPassword, newPassword });
};

export const getallLawyers = async (params?: any) => {
  try {
    return await apiClient.get(API_ROUTES.USER.GETALL_LAWYERS, { params });
  } catch (err) {
    console.error(err);
  }
};

export const getSingleLawyer = async (id: string): Promise<CommonResponse<Lawyer>> => {
  return apiClient.get<CommonResponse<Lawyer>>(API_ROUTES.USER.SINGLE_LAWYER(id));
};

export const getallslots = async (id: string): Promise<CommonResponse<any[]>> => {
  try {
    return await apiClient.get<CommonResponse<any[]>>(API_ROUTES.USER.GETSLOTS(id));
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch slots", data: [] };
  }
};

export const getAppoiments = async (): Promise<CommonResponse<any[]>> => {
  try {
    return await apiClient.get<CommonResponse<any[]>>(API_ROUTES.LAWYER.APPOIMENTS);
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to fetch appointments", data: [] };
  }
};

export const updateAppointmentStatus = async (id: string, status: string): Promise<CommonResponse> => {
  return apiClient.patch<CommonResponse>(API_ROUTES.LAWYER.APPOIMENTS_UPDATE_STATUS(id), { status });
};

export const checksubscription = async (): Promise<CommonResponse<any>> => {
  try {
    return await apiClient.get<CommonResponse<any>>(API_ROUTES.LAWYER.CHECKSUBSCRIPTION);
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to check subscription", data: null };
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

export const getSubscriptionPlans = async () => {
  return apiClient.get(API_ROUTES.LAWYER.SUBSCRIPTIONS);
};

export const createSubscriptionCheckout = async (
  lawyerId: string,
  email: string,
  planName: string,
  price: number,
  subscriptionId: string
) => {
  return apiClient.post(API_ROUTES.LAWYER.SUBSCRIPTION_CHECKOUT, {
    lawyerId,
    email,
    planName,
    price,
    subscriptionId,
  });
};

export const verifySubscriptionPayment = async (session_id: string) => {
  return apiClient.post(API_ROUTES.LAWYER.SUBSCRIPTION_SUCCESS, { session_id });
};

export const fetchLawyerReviews = async (id: string) => {
  try {
    return await apiClient.get(API_ROUTES.LAWYER.GET_REVIEWS(id));
  } catch (error: any) {
    console.error(error);
    return { success: false, data: [] };
  }
};

export const getLawyerCases = async () => {
  try {
    return await apiClient.get(API_ROUTES.LAWYER.GET_CASES);
  } catch (error: any) {
    console.error(error);
    return { success: false, data: [] };
  }
};

export const getLawyerEarnings = async () => {
  return apiClient.get(API_ROUTES.LAWYER.GET_EARNINGS);
};

export const requestPayout = async (amount: number) => {
  return apiClient.post(API_ROUTES.LAWYER.REQUEST_PAYOUT, { amount });
};

export const getPayoutHistory = async () => {
  return apiClient.get(API_ROUTES.LAWYER.PAYOUT_HISTORY);
};

export const fetchLawyerDashboardStats = async (startDate?: string, endDate?: string) => {
  return apiClient.get(API_ROUTES.LAWYER.DASHBOARD_STATS, {
    params: { startDate, endDate },
  });
};
