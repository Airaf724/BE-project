import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/users"
    : "/api/users";

axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
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

  getUsersByIds: async (userIds) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/getusersbyids`, {
        userIds,
      });
      const usersData = response?.data?.data;
      set({ isLoading: false });
      return usersData;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error fetching users by IDs",
      });
      return [];
    }
  },

  updateUserEventStatus: async (userId, eventId, newStatus, reward) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/updateStatus`, {
        userId,
        eventId,
        newStatus,
        reward,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error updating user status",
      });
      throw error;
    }
  },

  giveUserReward: async (userId, eventId, rewardAmount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/giveReward`, {
        userId,
        eventId,
        rewardAmount,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error giving reward",
      });
      throw error;
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
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/newsletter`, {
        email,
        userName,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error subscribing to newsletter",
      });
      throw error;
    }
  },
}));
