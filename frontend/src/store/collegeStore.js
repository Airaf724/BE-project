import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/colleges"
    : "/api/colleges";

axios.defaults.withCredentials = true;

export const useCollegeStore = create((set, get) => ({
  // State
  colleges: [],
  college: null,
  loading: false,
  error: null,
  success: false,

  // Create a new college
  createCollege: async (collegeData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.post(`${API_URL}/collegeForm`, collegeData); // Fixed typo
      set({
        college: response.data.data.college,
        loading: false,
        success: true,
      });
      return response.data.data.college;
    } catch (error) {
      console.error("Error creating college:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create college";
      set({ error: errorMessage, loading: false, success: false });
      throw new Error(errorMessage);
    }
  },

  getColleges: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getcolleges`);
      console.log("response", response);
      set({ colleges: response.data.colleges, loading: false });
      return response.data.colleges;
    } catch (error) {
      console.error("Error fetching colleges:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch colleges";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Fetch a single college
  getCollege: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ college: response.data.data.college, loading: false });
      return response.data.data.college;
    } catch (error) {
      console.error("Error fetching college:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch college";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update college details
  updateCollege: async (id, collegeData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.patch(`${API_URL}/${id}`, collegeData);
      set({
        college: response.data.data.college,
        loading: false,
        success: true,
      });
      return response.data.data.college;
    } catch (error) {
      console.error("Error updating college:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update college";
      set({ error: errorMessage, loading: false, success: false });
      throw new Error(errorMessage);
    }
  },

  // Add an admin to the college
  addCollegeAdmin: async (collegeId, adminId) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await axios.patch(`${API_URL}/${collegeId}/admins`, {
        adminId,
      });
      set({
        college: response.data.data.college,
        loading: false,
        success: true,
      });
      return response.data.data.college;
    } catch (error) {
      console.error("Error adding admin:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add admin";
      set({ error: errorMessage, loading: false, success: false });
      throw new Error(errorMessage);
    }
  },

  // Reset store state
  resetState: () => {
    set({ college: null, loading: false, error: null, success: false });
  },
}));
