import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/orders"
    : "/api/orders";

axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
  orders: null,
  order: null,
  error: null,
  isLoading: true,

  placeOrder: async (orderData) => {
    try {
      // Extract expected parameters based on controller requirements
      const {
        userId,
        userName,
        userEmail,
        rewardId,
        courseName,
        coursePoints,
        coursePrice, // Add this field
        courseLink,
        courseImage,
        credentials,
      } = orderData;

      // Log the order attempt for debugging
      console.log("Sending Order Data:", orderData);

      // Make the API request with parameters matching controller expectations
      const response = await axios.post(`${API_URL}/placeorder`, {
        userId,
        userName,
        userEmail,
        rewardId,
        courseName,
        coursePoints,
        coursePrice, // Include course price
        courseLink,
        courseImage,
        credentials: {
          email: credentials?.email || "",
        },
      });

      console.log("Order Response:", response.data);

      if (response.data.success) {
        // Show user the payment breakdown
        const { orderData: orderInfo } = response.data;

        if (orderInfo.coinDiscount > 0) {
          toast.info(
            `You'll save ₹${orderInfo.coinDiscount.toFixed(2)} using ${
              orderInfo.coinsUsed
            } coins! 
            Pay only ₹${orderInfo.payableAmount} (minimum ₹${
              orderInfo.minimumPayment
            } required)`,
            { duration: 5000 }
          );
        }

        // Return successful response with data from backend
        return {
          success: true,
          message: response.data.message || "Order created successfully!",
          orderData: response.data.orderData || null,
          requiresPayment: true, // Always requires payment now
        };
      } else {
        // Return error from backend
        return {
          success: false,
          message: response.data.message || "Failed to process your order.",
        };
      }
    } catch (error) {
      // Detailed error logging
      console.error("Order Error Details:", {
        message: error.message,
        responseData: error.response?.data,
        status: error.response?.status,
        endpoint: `${API_URL}/placeorder`,
      });

      // Return structured error object
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to process your order.",
        error: import.meta.env.MODE === "development" ? error : undefined,
      };
    }
  },

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching orders...");
      const response = await axios.get(`${API_URL}/getorders`);
      set({ orders: response.data.orders, isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserById: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/${userId}/getUserOrders`); // Fixed URL
      console.log(response.data.order);
      set({ order: response.data.order, isLoading: false }); // Fixed property name
    } catch (error) {
      console.log("error fetching using order of user ...", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Create Stripe checkout session
  createCheckoutSession: async (orderId) => {
    try {
      const response = await axios.post("/api/stripe/create-checkout-session", {
        orderId,
      });

      if (response.data.success) {
        return {
          success: true,
          sessionId: response.data.sessionId,
          url: response.data.url,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to create checkout session",
        };
      }
    } catch (error) {
      console.error("Checkout session error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create checkout session",
      };
    }
  },

  // Create payment intent
  createPaymentIntent: async (orderId) => {
    try {
      const response = await axios.post("/api/stripe/create-payment-intent", {
        orderId,
      });

      if (response.data.success) {
        return {
          success: true,
          clientSecret: response.data.clientSecret,
          paymentIntentId: response.data.paymentIntentId,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to create payment intent",
        };
      }
    } catch (error) {
      console.error("Payment intent error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create payment intent",
      };
    }
  },

  updateOrderStatus: async (
    orderId,
    newStatus,
    adminNotes = null,
    credentials = null
  ) => {
    try {
      set({ isLoading: true, error: null });
      console.log(`Updating order ${orderId} to ${newStatus}...`);

      const updateData = { status: newStatus };
      if (adminNotes) updateData.adminNotes = adminNotes;
      if (credentials) updateData.credentials = credentials;
      if (newStatus === "completed") updateData.completedAt = new Date();

      const response = await axios.put(`${API_URL}/${orderId}`, updateData);

      if (response.data.success) {
        toast.success("Order updated successfully!");
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, ...response.data.order } : order
          ),
          isLoading: false,
        }));
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to update order.");
      }
    } catch (error) {
      console.error("Order Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update order.");
      set({ error: error.message, isLoading: false });
      return { success: false, message: error.message };
    }
  },

  sendCredentials: async (orderId, credentials) => {
    try {
      // Start loading state
      set({ isLoading: true });

      // Make API request to send credentials
      const response = await axios.post(`${API_URL}/send-credentials`, {
        orderId,
        credentials,
      });

      if (response.data.success) {
        // Update the order in local state
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: "completed",
                  credentials: credentials,
                  completedAt: new Date().toISOString(),
                }
              : order
          ),
        }));

        return {
          success: true,
          message: response.data.message || "Credentials sent successfully",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to send credentials",
        };
      }
    } catch (error) {
      console.error("Error sending credentials:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error sending credentials",
      };
    } finally {
      // End loading state
      set({ isLoading: false });
    }
  },
}));
