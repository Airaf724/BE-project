import mongoose from "mongoose";

// models/Order.js

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
      enum: ["pending", "processing", "completed", "rejected", "cancelled"],
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
  },
  { timestamps: true }
);

export const Order = mongoose.model("Orders", OrderSchema);
