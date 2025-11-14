import axios from "axios";
import { API_ROUTES ,BASE_URL} from "../constants/routes";



export async function fetchUsers(page = 1, limit = 5): Promise<any> {
  try {
    const response = await axios.get(
      `http://localhost:8080${API_ROUTES.ADMIN.FETCH_USERS}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data; 
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    throw new Error(err.response?.data?.message || "Failed to load users");
  }
}

export const blockUser = async (id: string) => {
    try{
const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.BLOCK_USERS(id)}`, {}, {
    withCredentials: true,
  });
  return response.data.message;
    }catch(err){
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
};