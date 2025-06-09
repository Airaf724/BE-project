import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    coursePoints: {
      type: Number,
      required: true,
    },
    courseLink: {
      type: String,
      required: true,
    },
    courseImage: {
      type: String,
      required: true,
    },
    // Payment related fields
    coursePrice: {
      type: Number,
      required: true, // Original price in rupees
    },
    coinsUsed: {
      type: Number,
      required: true, // Coins deducted from user
    },
    coinValue: {
      type: Number,
      required: true, // Value per coin (coursePrice/coursePoints)
    },
    payableAmount: {
      type: Number,
      required: true, // Amount to be paid via Stripe
    },
    // Stripe payment fields
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    credentials: {
      email: {
        type: String,
        default: "",
      },
      password: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_required",
        "processing",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    minimumPaymentRequired: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Orders", OrderSchema);
