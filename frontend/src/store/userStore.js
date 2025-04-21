import { create } from "zustand";
import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/users"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useUserStore = create((set) => ({
  users: null,
  error: null,
  isLoading: false,

  fetchUsers: async (collegeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/getusers`, {
        collegeId: collegeId,
      });
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error fetching users",
      });
    }
  },

  setUserprofile: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}/setprofile`, formData);
      set({ isLoading: false, user: response?.data?.data });
      useAuthStore.getState().checkAuth();
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.message || "Error setting user profile",
      });
    }
  },

  subscribeNewsletter: async (email, userName) => {
    try {
      console.log("userName", userName);
      const response = await axios.post(`${API_URL}/newsletter`, {
        email,
        userName,
      });
      console.log("Subscribed successfully:", response.data);
    } catch (error) {
      console.error(
        "Subscription failed:",
        error.response?.data || error.message
      );
    }
  },

  // deleteUser: async (id) => {
  //     set({ isLoading: true, error: null });
  //     try {
  //         await axios.delete(`${API_URL}/users/${id}`);
  //         set({ isLoading: false, users: users.filter(user => user._id!==id) });
  //     } catch (error) {
  //         set({ isLoading: false, error: error.response?.data?.message || "Error deleting user" });
  //     }
  // }
}));
