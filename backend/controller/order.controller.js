// controllers/orderController.js
import { Order } from "../models/orders.model.js";
import { User } from "../models/user.model.js";
// Make sure this import is working correctly
import { Reward } from "../models/rewards.model.js";
import { sendCourseCredentialsToUser } from "../nodemailer/nodemailer.js";
// Updated placeOrder function with minimum payment requirement
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
      courseImage,
      credentials,
      coursePrice, // Add this to your request
    } = req.body;

    // Validate required fields
    if (!userId || !rewardId || !courseName || !coursePoints || !coursePrice) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if user exists and has enough points
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // FIXED PAYMENT CALCULATION WITH GUARANTEED MINIMUM PAYMENT
    const MINIMUM_PAYMENT = 100; // Minimum 100 rupees required ALWAYS
    const coinValue = coursePrice / coursePoints; // e.g., 500/4000 = 0.125

    // Calculate maximum discount allowed (coursePrice - minimum payment)
    const maxAllowedDiscount = coursePrice - MINIMUM_PAYMENT;

    // Calculate maximum coins that can be used for discount
    const maxCoinsForDiscount = Math.floor(maxAllowedDiscount / coinValue);

    // Determine actual coins to use (considering user's available points)
    const coinsToUse = Math.min(
      user.points, // User's available points
      coursePoints, // Course's point requirement
      maxCoinsForDiscount // Maximum coins allowed for discount
    );

    // Calculate actual discount and payable amount
    const coinDiscount = coinsToUse * coinValue;
    const payableAmount = coursePrice - coinDiscount;

    // Ensure payable amount is never less than minimum payment
    const finalPayableAmount = Math.max(payableAmount, MINIMUM_PAYMENT);

    // If somehow the calculation still results in less than minimum,
    // adjust the coins used to ensure minimum payment
    let finalCoinsUsed = coinsToUse;
    if (finalPayableAmount > payableAmount) {
      // Recalculate coins to ensure minimum payment
      const adjustedDiscount = coursePrice - MINIMUM_PAYMENT;
      finalCoinsUsed = Math.floor(adjustedDiscount / coinValue);
      coinDiscount = finalCoinsUsed * coinValue;
    }

    // Create order
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      rewardId,
      courseName,
      coursePoints,
      courseLink,
      courseImage,
      coursePrice,
      coinsUsed: finalCoinsUsed,
      coinValue,
      payableAmount: finalPayableAmount,
      coinDiscount: finalCoinsUsed * coinValue,
      minimumPaymentRequired: MINIMUM_PAYMENT,
      credentials: {
        email: credentials?.email || userEmail,
        password: "",
      },
      status: "payment_required",
      paymentStatus: "pending",
    });

    const savedOrder = await newOrder.save();

    // Don't deduct coins immediately - wait for payment completion
    // Coins will be deducted after successful payment in the Stripe webhook/verification

    res.status(201).json({
      success: true,
      message: `Order created successfully. Payment of ₹${finalPayableAmount} required to complete redemption.`,
      orderData: {
        orderId: savedOrder._id,
        payableAmount: finalPayableAmount,
        coinsUsed: finalCoinsUsed,
        coinValue,
        coinDiscount: finalCoinsUsed * coinValue,
        minimumPayment: MINIMUM_PAYMENT,
        requiresPayment: true,
        totalPrice: coursePrice,
      },
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get orders for user - with error handling for populate
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    let orders;
    try {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    } catch (populateError) {
      console.warn(
        "Populate failed, fetching without populate:",
        populateError.message
      );
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    }

    console.log(orders);
    res.json({
      success: true,
      order: orders, // ← Change from 'orders' to 'order'
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
// Get all orders (admin) - with error handling for populate
export const getAllOrders = async (req, res) => {
  try {
    // Try with populate first, fallback to without populate if it fails
    let orders;
    try {
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name email")
        .populate("rewardId", "title description");
    } catch (populateError) {
      console.warn(
        "Populate failed, fetching without populate:",
        populateError.message
      );
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes, credentials } = req.body;

    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (credentials) updateData.credentials = credentials;
    if (status === "completed") updateData.completedAt = new Date();

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
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
