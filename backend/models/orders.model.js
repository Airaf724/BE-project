import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  item: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "M",
    },
  },
  status: {
    type: String,
    enum: ["Pending", "InProgress", "Completed", "Rejected"],
    default: "Pending",
  },
});

export const Order = mongoose.model("Orders", orderSchema);
