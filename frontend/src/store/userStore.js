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

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getusers`);
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
      set({ isLoading: false, user: response.data.data });
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.message || "Error setting user profile",
      });
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
