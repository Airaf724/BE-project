import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/orders"
    : "/api/orders";

axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
  orders: null,

  placeOrder: async (name, email, phone, address, item) => {
    try {
      // console.log(item);
      console.log("Sending Order Data:", { name, email, phone, address, item });

      const response = await axios.post(`${API_URL}/placeorder`, {
        name,
        email,
        phone,
        address,
        item,
      });

      console.log("Response:", response.data); // Debug response

      if (response.data.success) {
        return { success: true, message: "Order placed successfully!" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response ? error.response.data : error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  fetchOrders: async () => {
    try {
      console.log("Fetching orders...");
      const response = await axios.get(`${API_URL}/getorders`);
      set({ orders: response.data.orders }); // ✅ Correct way to update state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },
}));
