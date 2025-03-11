import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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
      class: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
