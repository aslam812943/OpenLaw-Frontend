// src/service/authService.ts
import axios from "axios";
import { API_ROUTES,BASE_URL } from "../constants/routes";

export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    
   const response = await axios.post(
  `${BASE_URL}${API_ROUTES.ADMIN.LOGIN}`,
  data,
  {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  }
);


    return response;
  } catch (error: any) {

    throw error.response?.data || error;
  }
};




export const logoutAdmin = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}${API_ROUTES.ADMIN.LOGOUT_ADMIN}`,
      {},
      { withCredentials: true }
    );

    // Handle success
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || "Logged out successfully.",
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "Unexpected server response during logout.",
      };
    }

  } catch (error: any) {


   
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        message:
          error.response.data?.message ||
          `Logout failed with status ${error.response.status}.`,
      };
    } else if (error.request) {
   
      return {
        success: false,
        message: "No response from server. Please check your internet connection.",
      };
    } else {
   
      return {
        success: false,
        message: error.message || "An unexpected error occurred during logout.",
      };
    }
  }
}