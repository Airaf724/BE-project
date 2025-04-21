// store/eventAttendanceStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/attendance"
    : "/api/attendance";

axios.defaults.withCredentials = true;

export const useAttendanceStore = create((set, get) => ({
  attendanceCode: null,
  codeExpiry: null,
  isGenerating: false,
  isVerifying: false,
  attendanceStatus: {}, // Store attendance status by eventId
  isCheckingStatus: false,
  error: null,

  // Generate a new attendance code
  generateAttendanceCode: async (eventId) => {
    set({ isGenerating: true, error: null });

    try {
      const response = await axios.post(
        `${API_URL}/${eventId}/generate-attendance-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      set({
        attendanceCode: response.data.code,
        codeExpiry: response.data.expiresAt,
        isGenerating: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to generate attendance code",
        isGenerating: false,
      });
      throw error;
    }
  },

  // Verify attendance code entered by student
  verifyAttendanceCode: async (eventId, code, userId) => {
    set({ isVerifying: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-attendance-code`, {
        eventId,
        code,
        userId,
      });

      // Update attendance status with the new data
      set((state) => ({
        isVerifying: false,
        attendanceStatus: {
          ...state.attendanceStatus,
          [eventId]: {
            attended: true,
            registered: true,
            status: "Completed",
          },
        },
      }));

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to verify attendance code",
        isVerifying: false,
      });
      throw error;
    }
  },

  // Check attendance status for an event
  checkAttendanceStatus: async (eventId, userId) => {
    set({ isCheckingStatus: true, error: null });

    try {
      const response = await axios.post(
        `${API_URL}/${eventId}/status`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      set((state) => ({
        attendanceStatus: {
          ...state.attendanceStatus,
          [eventId]: response.data,
        },
        isCheckingStatus: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to check attendance status",
        isCheckingStatus: false,
      });
      throw error;
    }
  },
  // Get attendance status from store
  getAttendanceStatus: (eventId) => {
    return get().attendanceStatus[eventId];
  },

  // Clear attendance code data
  clearAttendanceCode: () => {
    set({ attendanceCode: null, codeExpiry: null });
  },

  // Reset attendance status for an event
  resetAttendanceStatus: (eventId) => {
    set((state) => {
      const { [eventId]: _, ...rest } = state.attendanceStatus;
      return { attendanceStatus: rest };
    });
  },

  // Reset all state
  resetState: () => {
    set({
      attendanceCode: null,
      codeExpiry: null,
      attendanceStatus: {},
      error: null,
    });
  },
}));
