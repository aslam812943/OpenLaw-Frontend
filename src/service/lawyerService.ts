import axios from "axios";
import { API_ROUTES,BASE_URL } from "@/constants/routes";

// const BASE_URL = "http://localhost:8080";

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

/**
 * Fetch all lawyers with pagination support.
 * @param page current page number
 * @param limit number of items per page
 */
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
    console.error("Error fetching lawyers:", error.response?.data || error);
    throw error.response?.data || error;
  }
};


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
    console.error("Error blocking lawyer:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to block lawyer");
  }
};



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
    console.error("Error unblocking lawyer:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to unblock lawyer");
  }
};


export const approveLawyer = async (id:string,email:string)=>{
try {
  
   const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.APPROVE_LAWYER(id)}`,{email},{withCredentials:true,headers: { "Content-Type": "application/json" }})
   return response.data.message
} catch (error) {
  console.log(error)
}
}


export const rejectLawyer = async (id:string,email:string,reason?:string)=>{
  try {
  const response = await axios.patch(`${BASE_URL}${API_ROUTES.ADMIN.REJECT_LAWYER(id)}`,  {email,reason},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })  
      return response.data.message
  } catch (error) {
    console.log(error)
  }
}


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
    console.error("Logout API Error:", err);
    throw new Error(err.response?.data?.message || "Logout failed.");
  }
};


export const scheduleCreate = async (ruleData: any,lawyerId:string)=>{
  try{
const response = await axios.post(`${BASE_URL}${API_ROUTES.LAWYER.SCHEDULE_CREATE}`,{ruleData,lawyerId},  {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })


      return response.data.message
  }catch(err){

  }
}

