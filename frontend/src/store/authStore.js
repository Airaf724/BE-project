import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        role,
      });

      // Make sure we get proper user data
      if (response?.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        // console.log("sign in ", response.data);
        // return response.data;
      } else {
        throw new Error("No user data received from signup");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      // Check if we have valid user data before updating state
      if (response?.data?.user) {
        // Update user first, then authentication state
        set({
          user: response?.data?.user,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
        // Double-check that user state was properly updated
        const currentUser = get().user;
        if (!currentUser) {
          // If user is still null, manually trigger another check
          await get().checkAuth();
        }
        console.log("login store", user);

        // return response.data;
      } else {
        throw new Error("No user data received from login");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      if (response?.data?.success && response?.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });
        // return response.data;
      } else {
        set({
          user: null,
          isAuthenticated: false,
        });
        console.log("Auth check: No valid user data in response");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      set({
        user: null,
        isAuthenticated: false,
        error: error.response?.data?.message || error.message,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.get(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      if (response?.data?.user) {
        set({
          user: response?.data?.user,
          isAuthenticated: true,
          isLoading: false,
        });
        // return response.data;
      } else {
        throw new Error("No user data received from verification");
      }
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
