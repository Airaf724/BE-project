import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique name of the college
  city: { type: String, required: true }, // City where the college is located
  state: { type: String, required: true }, // State of the college
  country: { type: String, required: true }, // Country of the college
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of college admins (users)
});

export const College = mongoose.model("College", CollegeSchema);
