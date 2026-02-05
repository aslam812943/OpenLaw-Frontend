import { API_ROUTES } from "../constants/routes";
import apiClient from "../utils/apiClient";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBlock: boolean;
  avatar?: string;
  profileImage?: string;
  hasSubmittedVerification?: boolean;
  verificationStatus?: string;
  isPassword?: boolean;
  Address?: {
    address?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CommonResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface GoogleAuthResponse {
  user?: User;
  needsRoleSelection?: boolean;
  message?: string;
}

export interface FetchUsersResponse {
  success: boolean;
  message: string;
  users: User[];
  total: number;
}

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  consultationFee: number;
  description?: string;
  cancellationReason?: string;
  lawyerId: string;
  lawyerName?: string;
  refundAmount?: number;
  refundStatus?: string;
  lawyerFeedback?: string;
}

export interface BookingDetails {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  lawyerName: string;
  lawyerImage?: string;
  paymentId?: string;
  sessionId?: string;
  description?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export async function fetchUsers(
  page = 1,
  limit = 5,
  search?: string,
  filter?: string,
  sort?: string
): Promise<CommonResponse<{ users: User[]; total: number }>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(filter && { filter }),
    ...(sort && { sort }),
  });
  return apiClient.get<CommonResponse<{ users: User[]; total: number }>>(
    `${API_ROUTES.ADMIN.FETCH_USERS}?${queryParams.toString()}`
  );
}

export const blockUser = async (id: string): Promise<string> => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.BLOCK_USERS(id));
  return response.message;
};

export const unBlockUser = async (id: string): Promise<string> => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.UNBLOCK_USERS(id));
  return response.message;
};

export const logoutUser = async (): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.LOGOUT_USER);
};

export const getprofile = async (): Promise<User> => {
  const response = await apiClient.get<CommonResponse<User>>(API_ROUTES.USER.GETPROFILE);
  return response.data;
};

export const updateProfileInfo = async (formData: FormData): Promise<CommonResponse<User>> => {
  return apiClient.put<CommonResponse<User>>(
    API_ROUTES.USER.UPDATE_PROFILE_INFO,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<CommonResponse<void>> => {
  return apiClient.put<CommonResponse<void>>(
    API_ROUTES.USER.CHANGE_PASSWORD,
    payload
  );
};

export const userLogin = async (data: { email: string; password: string }): Promise<CommonResponse<LoginResponse>> => {
  return apiClient.post(API_ROUTES.USER.LOGIN, data);
};

export const userRegister = async (data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
}): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.REGISTER, data);
};

export const verifyUserOtp = async (data: { email: string, otp: string }): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.VERIFY_OTP, data);
};

export const resendUserOtp = async (email: string): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.RESEND_OTP, { email });
};

export const userGoogleAuth = async (token: string, role?: string): Promise<CommonResponse<GoogleAuthResponse>> => {
  return apiClient.post(API_ROUTES.USER.GOOGLE_AUTH, { token, role });
};

export const userForgotPassword = async (email: string): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.FORGOT_PASSWORD, { email });
};

export const userResetPassword = async (data: {
  otp: string;
  email: string;
  password?: string;
  conformpassword?: string;
}): Promise<CommonResponse<void>> => {
  return apiClient.post(API_ROUTES.USER.RESET_PASSWORD, data);
};

export const handlepayAndBook = async (data: {
  userId: string | null;
  lawyerId: string;
  lawyerName: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number | undefined;
  description?: string;
  slotId: string | null;
}): Promise<CommonResponse<{ url: string }>> => {
  return apiClient.post<CommonResponse<{ url: string }>>(API_ROUTES.PAYMENT.PAYMENT, data);
}

export const confirmBooking = async (sessionId: string): Promise<CommonResponse<BookingDetails>> => {
  return apiClient.post<CommonResponse<BookingDetails>>(API_ROUTES.PAYMENT.CONFIRM, { sessionId });
}

export const getUserAppointments = async (page: number = 1, limit: number = 5, status?: string, search?: string, date?: string): Promise<CommonResponse<{ appointments: Appointment[], total: number }>> => {
  return apiClient.get<CommonResponse<{ appointments: Appointment[], total: number }>>(API_ROUTES.USER.GETAPPOINMENT, {
    params: { page, limit, status, search, date }
  });
};

export const cancelAppointment = async (id: string, reason: string): Promise<void> => {
  const response = await apiClient.patch<CommonResponse<void>>(API_ROUTES.USER.CANCELAPPOINMENT(id), { reason });
  return response.data;
};

export const addReview = async (reviewData: { userId: string; lawyerId: string; rating: number; comment: string }): Promise<CommonResponse<Review>> => {
  return apiClient.post<CommonResponse<Review>>(API_ROUTES.USER.ADDREVIEW, reviewData);
};


export interface WalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  bookingId?: string;
  description?: string;
  metadata?: {
    reason?: string;
    lawyerName?: string;
    lawyerId?: string;
    date?: string;
    time?: string;
    displayId?: string;
  };
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
  total: number;
}

export const getWallet = async (page: number = 1, limit: number = 5): Promise<CommonResponse<Wallet>> => {
  return apiClient.get<CommonResponse<Wallet>>(API_ROUTES.USER.GETWALLET, {
    params: { page, limit }
  });
}

export const allReview = async (id: string): Promise<CommonResponse<Review[]>> => {
  try {
    return await apiClient.get<CommonResponse<Review[]>>(API_ROUTES.USER.GETALLREVIEWS(id));
  } catch (error) {
    return { success: false, message: "Failed to fetch reviews", data: [] };
  }
}
export const fetchSpecializations = async (): Promise<CommonResponse<Specialization[]>> => {
  return apiClient.get<CommonResponse<Specialization[]>>(API_ROUTES.USER.SPECIALIZATIONS);
};

export const fetchNotifications = async (userId: string): Promise<CommonResponse<Notification[]>> => {
  return apiClient.get<CommonResponse<Notification[]>>(API_ROUTES.NOTIFICATION.GET_USER(userId));
};

export const markNotificationAsRead = async (id: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(API_ROUTES.NOTIFICATION.MARK_READ_USER(id));
};

export const markAllNotificationsAsRead = async (userId: string): Promise<CommonResponse<void>> => {
  return apiClient.patch<CommonResponse<void>>(`${API_ROUTES.NOTIFICATION.MARK_READ_USER('all')}?userId=${userId}&all=true`);
};
