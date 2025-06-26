import axios from "axios";
import { supabase } from "@/utils/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Use a request interceptor to add the auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't sign out here as it can cause loops, handle it in the UI
      console.error("Authentication error (401), redirecting may be needed.");
    }
    return Promise.reject(error);
  }
);

// Helper to extract error messages
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "An unknown error occurred";
}

// --- Course Purchase/Rent API ---
export function purchaseCourse(courseId: string, type: 'BUY' | 'RENT') {
  return axiosInstance.post(`/api/purchase/${courseId}/purchase`, { type });
}

export function startRental(courseId:string) {
  return axiosInstance.post(`/api/purchase/${courseId}/start-rental`);
}

export function getPurchaseStatus(courseId: string) {
  return axiosInstance.get(`/api/purchase/${courseId}/purchase-status`);
}

export default axiosInstance; 