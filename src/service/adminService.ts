
import axios from "axios";
import { API_ROUTES, BASE_URL } from "../constants/routes";

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


export const createSubscription = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.ADMIN.CREATESUBSCRIPTION}`, data, { withCredentials: true })
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export const fetchSubscriptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export const toggleSubscriptionStatus = async (id: string, status: boolean) => {
  try {
    const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.FETCH_SUBSCRIPTIONS}/${id}/status`, { status }, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}



export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchPayments = async (filters: PaymentFilters) => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADMIN.PAYMENTS}`, {
      params: filters,
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADMIN.DASHBOARD_STATS}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const fetchPendingPayouts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADMIN.PAYOUT_PENDING}`, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const approvePayout = async (id: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.APPROVE_PAYOUT(id)}`, {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};