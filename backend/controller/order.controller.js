import { Order } from "../models/orders.model.js";
import { User } from "../models/user.model.js";
import { Reward } from "../models/rewards.model.js";
import { sendCourseCredentialsToUser } from "../nodemailer/nodemailer.js"; // Adjust path if needed

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      rewardId,
      courseName,
      coursePoints,
      courseLink,
      credentials,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !userName ||
      !userEmail ||
      !rewardId ||
      !courseName ||
      !coursePoints
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for course redemption",
      });
    }

    // Create order using the Order schema
    const newOrder = new Order({
      userId, // MongoDB ObjectId reference to User
      userName,
      userEmail,
      rewardId, // MongoDB ObjectId reference to Reward
      courseName,
      coursePoints,
      courseLink: courseLink || "pending_assignment",
      credentials: {
        email: credentials?.email || "",
        password: "", // Will be filled by admin later
      },
      status: "pending", // Using enum from schema: "pending", "processing", "completed", etc.
      adminNotes: "",
      completedAt: null,
    });

    // Save the order to database
    await newOrder.save();

    // Find the user and deduct points
    const user = await User.findById(userId);
    if (user) {
      user.points -= coursePoints;
      await user.save();
    } else {
      // If we somehow can't find the user, still create the order but log warning
      console.warn(`Order created but user not found for ID: ${userId}`);
    }

    // Send response
    res.status(201).json({
      success: true,
      message:
        "Course redemption successful! We'll email your credentials within 24 hours.",
      orderData: {
        id: newOrder._id,
        courseName: newOrder.courseName,
        status: newOrder.status,
      },
    });
  } catch (error) {
    console.error("Error processing course redemption:", error);

    // Provide a more detailed error message for debugging in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${error.message}`
        : "Failed to process your course redemption";

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId, status, adminNotes, credentials } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order fields
    if (status) order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;
    if (credentials) order.credentials = credentials;
    if (status === "completed" && !order.completedAt) {
      order.completedAt = new Date();
    }

    // Save the updated order
    await order.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Add this to your backend controllers

export const sendCredentials = async (req, res) => {
  try {
    const { orderId, credentials } = req.body;

    if (
      !orderId ||
      !credentials ||
      !credentials.email ||
      !credentials.password
    ) {
      return res.status(400).json({
        success: false,
        message: "Order ID and complete credentials are required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order with credentials
    order.credentials = credentials;
    order.status = "completed";
    order.completedAt = new Date();
    await order.save();

    // Get user info to send email
    const user = await User.findById(order.userId);

    // Use the dedicated email function
    try {
      await sendCourseCredentialsToUser(
        user.email,
        user.name,
        order.courseName,
        order.courseImage || "", // Add default empty string if courseImage might be undefined
        credentials.email,
        credentials.password,
        order.courseLink
      );

      return res.status(200).json({
        success: true,
        message: "Credentials sent successfully",
      });
    } catch (emailError) {
      // If email fails, still update the order but notify admin
      console.error(
        "Failed to send credentials email for order",
        orderId,
        emailError
      );
      return res.status(200).json({
        success: true,
        message: "Order updated but email delivery failed",
        warning: "Email delivery failed",
      });
    }
  } catch (error) {
    console.error("Error sending credentials:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send credentials",
    });
  }
};
