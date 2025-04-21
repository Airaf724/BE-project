import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/rewards"
    : "/api/rewards";

axios.defaults.withCredentials = true;

export const useRewardStore = create((set) => ({
  rewards: null,
  error: null,
  isLoading: true,

  addReward: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("name", eventData.courseName);
      formData.append("description", eventData.description);
      formData.append("courseLink", eventData.udemyLink);
      formData.append("price", eventData.price);
      formData.append("category", eventData.category);
      formData.append("level", eventData.difficulty);
      formData.append("point", eventData.points);

      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      const response = await axios.post(`${API_URL}/addreward`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("response", response);

      set((state) => ({
        rewards: [...state.rewards, response.data.reward],
        isLoading: false,
      }));
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.message || "Error adding reward",
      });
    }
  },

  fetchRewards: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getrewards`);
      set((state) => ({
        rewards: response.data.rewards,
        isLoading: false,
      }));
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.message || "Error fetching rewards",
      });
    }
  },
}));
