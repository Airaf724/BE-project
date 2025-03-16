import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Explicitly indexing for faster lookups
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastloginDate: {
      type: Date,
      default: Date.now, // Fix: Use Date.now without parentheses
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"], // Ensure this matches frontend
      default: "student",
    },
    registeredEvents: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },
        status: {
          type: String,
          enum: ["Registered", "Completed", "Cancelled"],
        },
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpireAtDate: Date,
    verificationToken: String,
    verificationTokenExpireAt: Date,
    profile: {
      erp: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Not specified"],
        default: "Not specified",
      },
      phone: {
        type: String,
        default: "",
      },
      branch: {
        type: String,
        default: "",
      },
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
    }, // Links user to a specific college
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
