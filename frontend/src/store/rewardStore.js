import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/rewards"
    : "/api/rewards";

axios.defaults.withCredentials = true;

export const useRewardStore = create((set) => ({
  rewards: null,
  reward: null,
  error: null,
  isLoading: true,
  updateSuccess: null,

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

  fetchRewardById: async (rewardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/getrewardsbyid`, {
        id: rewardId,
      });
      set((state) => ({
        reward: response?.data?.reward,
        isLoading: false,
      }));
    } catch (e) {
      set({
        isLoading: false,
        error: e.response?.data?.message || "Error fetching rewards",
      });
    }
  },

  updateReward: async (rewardId, formData) => {
    try {
      set({ isLoading: true, error: null, updateSuccess: false });

      // Log form data for debugging
      console.log("Updating reward with ID:", rewardId);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Make API call to update reward
      const response = await fetch(`${API_URL}/updatereward/${rewardId}`, {
        method: "PUT",
        body: formData, // Send FormData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update reward");
      }

      const updatedReward = await response.json();
      console.log("Reward updated successfully:", updatedReward);

      // Update state with new reward data
      set((state) => ({
        rewards: state.rewards
          ? state.rewards.map((r) => (r._id === rewardId ? updatedReward : r))
          : state.rewards,
        reward: updatedReward,
        isLoading: false,
        updateSuccess: true,
      }));

      return updatedReward;
    } catch (error) {
      console.error("Error updating reward:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resetRewardStatus: () => {
    set({
      error: null,
      updateSuccess: false,
    });
  },
}));
