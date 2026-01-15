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

export async function fetchUsers(
  page = 1,
  limit = 5,
  search?: string,
  filter?: string,
  sort?: string
): Promise<FetchUsersResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(filter && { filter }),
    ...(sort && { sort }),
  });
  return apiClient.get(`${API_ROUTES.ADMIN.FETCH_USERS}?${queryParams.toString()}`);
}

export const blockUser = async (id: string): Promise<string> => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.BLOCK_USERS(id));
  return response.message;
};

export const unBlockUser = async (id: string): Promise<string> => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.ADMIN.UNBLOCK_USERS(id));
  return response.message;
};

export const logoutUser = async (): Promise<CommonResponse<any>> => {
  return apiClient.post(API_ROUTES.USER.LOGOUT_USER);
};

export const getprofile = async (): Promise<User> => {
  const response = await apiClient.get<CommonResponse<User>>(API_ROUTES.USER.GETPROFILE);
  return response.data;
};

export const updateProfileInfo = async (formData: FormData): Promise<CommonResponse<User>> => {
  const response = await apiClient.put<CommonResponse<User>>(
    API_ROUTES.USER.UPDATE_PROFILE_INFO,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response as any;
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<CommonResponse> => {
  const response = await apiClient.put<CommonResponse>(
    API_ROUTES.USER.CHANGE_PASSWORD,
    payload
  );
  return response as any;
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
}): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.USER.REGISTER, data);
};

export const verifyUserOtp = async (data: { email: string, otp: string }): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.USER.VERIFY_OTP, data);
};

export const resendUserOtp = async (email: string): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.USER.RESEND_OTP, { email });
};

export const userGoogleAuth = async (token: string, role?: string): Promise<CommonResponse<GoogleAuthResponse>> => {
  return apiClient.post(API_ROUTES.USER.GOOGLE_AUTH, { token, role });
};

export const userForgotPassword = async (email: string): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.USER.FORGOT_PASSWORD, { email });
};

export const userResetPassword = async (data: {
  otp: string;
  email: string;
  password?: string;
  conformpassword?: string;
}): Promise<CommonResponse> => {
  return apiClient.post(API_ROUTES.USER.RESET_PASSWORD, data);
};

export const handlepayAndBook = async (data: any): Promise<CommonResponse<any>> => {
  return apiClient.post<CommonResponse<any>>(API_ROUTES.PAYMENT.PAYMENT, data);
}

export const confirmBooking = async (sessionId: string): Promise<CommonResponse<any>> => {
  return apiClient.post<CommonResponse<any>>(API_ROUTES.PAYMENT.CONFIRM, { sessionId });
}

export const getUserAppointments = async (page: number = 1, limit: number = 5): Promise<CommonResponse<any>> => {
  return apiClient.get<CommonResponse<any>>(`${API_ROUTES.USER.GETAPPOINMENT}?page=${page}&limit=${limit}`);
};

export const cancelAppointment = async (id: string, reason: string) => {
  const response = await apiClient.patch<CommonResponse>(API_ROUTES.USER.CANCELAPPOINMENT(id), { reason });
  return response.data;
};

export const addReview = async (reviewData: { userId: string; lawyerId: string; rating: number; comment: string }): Promise<CommonResponse> => {
  return apiClient.post<CommonResponse>(API_ROUTES.USER.ADDREVIEW, reviewData);
};

export const allReview = async (id: string): Promise<CommonResponse<any[]>> => {
  try {
    return await apiClient.get<CommonResponse<any[]>>(API_ROUTES.USER.GETALLREVIEWS(id));
  } catch (error) {
    return { success: false, message: "Failed to fetch reviews", data: [] };
  }
}
