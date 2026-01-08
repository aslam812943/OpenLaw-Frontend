
import axios from "axios";
import { API_ROUTES, BASE_URL } from "../constants/routes";



export async function fetchUsers(page = 1, limit = 5): Promise<any> {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ROUTES.ADMIN.FETCH_USERS}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;

  } catch (err: any) {

    throw new Error(err.response?.data?.message || "Failed to load users");
  }
}

export const blockUser = async (id: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.BLOCK_USERS(id)}`, {}, {
      withCredentials: true,
    });
    return response.data.message;
  } catch (err) {
    console.log(err)
  }

};

export const unBlockUser = async (id: string) => {
  const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.UNBLOCK_USERS(id)}`, {}, {
    withCredentials: true,
  });
  return response.data.message;
};



export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}${API_ROUTES.USER.LOGOUT_USER}`,
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
};

export const getprofile = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ROUTES.USER.GETPROFILE}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;

  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to get profile");
  }
};

export const updateProfileInfo = async (formData: FormData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_ROUTES.USER.UPDATE_PROFILE_INFO}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;

  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_ROUTES.USER.CHANGE_PASSWORD}`,
      payload,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;

  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Password update failed");
  }
};



export const handlepayAndBook = async (data: any) => {
  try {
    return await axios.post(`${BASE_URL}${API_ROUTES.PAYMENT.PAYMENT}`, data, { withCredentials: true })
  } catch (error) {

    throw error;
  }
}

export const confirmBooking = async (sessionId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PAYMENT.CONFIRM}`, { sessionId }, { withCredentials: true });
    return response.data;
  } catch (error) {

    throw error;
  }
}




export const getUserAppointments = async (page: number = 1, limit: number = 5) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ROUTES.USER.GETAPPOINMENT}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (id: string, reason: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}${API_ROUTES.USER.CANCELAPPOINMENT(id)}`,
      { reason },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addReview = async (reviewData: { userId: string; lawyerId: string; rating: number; comment: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.USER.ADDREVIEW}`, reviewData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add review");
  }
};


export const allReview = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.USER.GETALLREVIEWS(id)}`, { withCredentials: true })
    return response.data;
  } catch (error) {
 
    return [];
  }
}
