import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true, // such as sports, technical, cultural
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true, // classroom number, PPCRC, college name, etc.
    },
    event_date: {
      type: Date,
      required: true,
    },
    event_time: {
      type: String,
      required: false, // e.g. 10:00 am, 2:00 pm
    },
    community: {
      type: String,
      required: true, // GDSC, ITSA, CASA
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    registered: [
      {
        type: mongoose.Schema.Types.ObjectId, // users who registered
        ref: "User",
      },
    ],
    attendees: [],
    image_url: {
      type: String, // default image URL if not provided
    },
    registrationReward: {
      type: Number,
      default: 0,
    },
    attendanceReward: {
      type: Number,
      default: 0,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Events", EventSchema);
