import axios from "axios";
import { API_ROUTES, BASE_URL } from "@/constants/routes";

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
  addresses: string[];
  verificationStatus?: string;
  isVerified: boolean;
  isBlock: boolean;
}

export interface PaginatedLawyerResponse {
  lawyers: Lawyer[];
  total: number;
}

/* ============================================================
   FETCH LAWYERS
============================================================ */
export const fetchLawyers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedLawyerResponse> => {
  try {
    const response = await axios.get<PaginatedLawyerResponse>(
      `${BASE_URL}${API_ROUTES.ADMIN.FETCH_LAWYERS}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return {
      lawyers: response.data.lawyers || [],
      total: response.data.total || 0,
    };
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      "Failed to fetch lawyers. Please try again.";

    throw new Error(msg);
  }
};

/* ============================================================
    BLOCK LAWYER
============================================================ */
export const blockLawyer = async (id: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${API_ROUTES.ADMIN.BLOCK_LAWYER(id)}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to block the lawyer.";

    throw new Error(msg);
  }
};

/* ============================================================
    UNBLOCK LAWYER
============================================================ */
export const unBlockLawyer = async (id: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${API_ROUTES.ADMIN.UNBLOCK_LAWYER(id)}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.message;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to unblock the lawyer.";

    throw new Error(msg);
  }
};

/* ============================================================
    APPROVE LAWYER
============================================================ */
export const approveLawyer = async (id: string, email: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${API_ROUTES.ADMIN.APPROVE_LAWYER(id)}`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.message;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to approve lawyer.";

    throw new Error(msg);
  }
};

/* ============================================================
    REJECT LAWYER
============================================================ */
export const rejectLawyer = async (
  id: string,
  email: string,
  reason?: string
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${API_ROUTES.ADMIN.REJECT_LAWYER(id)}`,
      { email, reason },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.message;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to reject lawyer.";

    throw new Error(msg);
  }
};

/* ============================================================
    LOGOUT LAWYER
============================================================ */
export const logoutLawyer = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}${API_ROUTES.LAWYER.LOGOUT_LAWYER}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.message;
  } catch (err: any) {
    const msg =
      err.response?.data?.message || "Logout failed. Please try again.";

    throw new Error(msg);
  }
};

/* ============================================================
    CREATE SCHEDULE
============================================================ */
export const scheduleCreate = async (ruleData: any,) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${API_ROUTES.LAWYER.SCHEDULE_CREATE}`,
      { ruleData },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data.message;
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      "Failed to create schedule rule. Please check your inputs.";

    throw new Error(msg);
  }
};

/* ============================================================
    UPDATE SCHEDULE
============================================================ */
export const scheduleUpdate = async (updatedData: any, ruleId: string) => {
  try {
    await axios.put(
      `${BASE_URL}${API_ROUTES.LAWYER.SCHEDULE_UPDATE}/${ruleId}`,
      updatedData,
      { withCredentials: true }
    );
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to update schedule rule.";

    throw new Error(msg);
  }
};

/* ============================================================
    FETCH ALL RULES
============================================================ */
export const fetchAllRules = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}${API_ROUTES.LAWYER.FETCH_SCHEDULT_RULE}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Fetched Rules:", response.data);
    return response.data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      "Failed to fetch availability rules.";

    throw new Error(msg);
  }
};

/* ============================================================
    DELETE RULE
============================================================ */
export const deleteRule = async (ruleId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${API_ROUTES.LAWYER.DELETE_SCHEDULE_RULE}/${ruleId}`
    );


    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Failed to delete schedule rule.";

    throw new Error(msg);
  }




};


export const getprofile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.LAWYER.GETPROFILE}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })

    return response.data
  } catch (error: any) {
    console.log(error)
  }

}



export const updateProfile = async (formData: FormData) => {

  try {
    const response = await axios.put(
      `${BASE_URL}${API_ROUTES.LAWYER.UPDATE_PROFILE}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Failed to update profile.";
    throw new Error(msg);
  }
};

/* ============================================================
    CHANGE PASSWORD
============================================================ */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_ROUTES.LAWYER.CHANGE_PASSWORD}`,
      { oldPassword, newPassword },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Failed to change password.";
    throw new Error(msg);
  }
};
