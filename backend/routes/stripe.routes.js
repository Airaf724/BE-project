// routes/stripeRoutes.js
import express from "express";
import Stripe from "stripe";
import { Order } from "../models/orders.model.js";
import { User } from "../models/user.model.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post("/create-payment-intent", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.payableAmount * 100), // Stripe expects amount in paise
      currency: "inr",
      metadata: {
        orderId: order._id.toString(),
        userId: order.userId.toString(),
        courseName: order.courseName,
      },
      description: `Payment for ${order.courseName}`,
    });

    // Update order with payment intent ID
    await Order.findByIdAndUpdate(orderId, {
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "processing",
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
});

// Create Checkout Session (Alternative approach)
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: order.courseName,
              images: [order.courseImage],
              description: `Udemy Course - ${order.courseName}`,
            },
            unit_amount: Math.round(order.payableAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled?order_id=${orderId}`,
      metadata: {
        orderId: order._id.toString(),
        userId: order.userId.toString(),
      },
    });

    // Update order with session ID
    await Order.findByIdAndUpdate(orderId, {
      stripeSessionId: session.id,
      paymentStatus: "processing",
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
});

// Verify payment status (alternative to webhook for development)
router.post("/verify-payment", verifyToken, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await handlePaymentSuccess(paymentIntent);
      res.json({
        success: true,
        message: "Payment verified successfully",
        status: paymentIntent.status,
      });
    } else {
      res.json({
        success: false,
        message: "Payment not completed",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

// Verify checkout session
router.post("/verify-session", verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await handleCheckoutSuccess(session);
      res.json({
        success: true,
        message: "Payment verified successfully",
        status: session.payment_status,
      });
    } else {
      res.json({
        success: false,
        message: "Payment not completed",
        status: session.payment_status,
      });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "succeeded",
        paidAt: new Date(),
        status: "processing", // Move to processing for admin to send credentials
      });

      // Deduct coins from user
      await User.findByIdAndUpdate(order.userId, {
        $inc: { points: -order.coinsUsed },
      });

      console.log(`Payment succeeded for order: ${orderId}`);
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

// Handle checkout session completion
async function handleCheckoutSuccess(session) {
  try {
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId);

    if (order) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "succeeded",
        paidAt: new Date(),
        status: "processing",
      });

      // Deduct coins from user
      await User.findByIdAndUpdate(order.userId, {
        $inc: { points: -order.coinsUsed },
      });

      console.log(`Checkout completed for order: ${orderId}`);
    }
  } catch (error) {
    console.error("Error handling checkout success:", error);
  }
}

// Handle payment failure
async function handlePaymentFailure(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      status: "cancelled",
    });

    console.log(`Payment failed for order: ${orderId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

export default router;
