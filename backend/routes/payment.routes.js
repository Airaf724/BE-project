import express from "express";
const router = express.Router();
import Stripe from "stripe";
import { Order } from "../models/orders.model.js"; // Adjust the path to your Order model
import { User } from "../models/user.model.js"; // Adjust the path to your User model

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { courseName, coursePoints, courseImage, userEmail } = req.body;

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseName,
              images: [courseImage],
            },
            unit_amount: coursePoints * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/order`,
      metadata: {
        courseName,
        coursePoints: coursePoints.toString(),
        courseImage,
        userEmail,
      },
    });

    // Return both the URL and sessionId to support different implementation approaches
    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Stripe error", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create checkout session",
    });
  }
});

// Verify payment and create order
router.post("/verify-payment", async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Payment session not found",
      });
    }

    // Check if the payment was successful
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // Get the metadata from the session
    const { courseName, coursePoints, courseImage, userEmail } =
      session.metadata;

    // Check if an order with this session ID already exists to prevent duplicates
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.json({
        success: true,
        message: "Order already processed",
        order: existingOrder,
      });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      userName: userEmail.split("@")[0], // Fallback name
      userEmail,
      courseName,
      coursePoints: parseInt(coursePoints),
      courseImage,
      status: "processing",
      credentials: {
        email: userEmail,
      },
      paymentMethod: "stripe",
      stripeSessionId: sessionId,
    });

    await newOrder.save();

    // Return success response
    res.json({
      success: true,
      message: "Payment verified and order created",
      order: newOrder,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

// Webhook endpoint for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Process the order
        const { courseName, coursePoints, courseImage, userEmail } =
          session.metadata;

        // Find user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
          console.error(`User not found with email: ${userEmail}`);
          return res.json({ received: true });
        }

        // Check if order already exists
        const existingOrder = await Order.findOne({
          stripeSessionId: session.id,
        });
        if (existingOrder) {
          return res.json({ received: true });
        }

        // Create new order
        const newOrder = new Order({
          userId: user._id,
          userName: user.name || userEmail.split("@")[0],
          userEmail,
          courseName,
          coursePoints: parseInt(coursePoints),
          courseImage,
          status: "processing",
          credentials: {
            email: userEmail,
          },
          paymentMethod: "stripe",
          stripeSessionId: session.id,
        });

        await newOrder.save();
        console.log(`Order created for session ${session.id}`);
      } catch (err) {
        console.error(`Error processing webhook: ${err.message}`);
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

export default router;
