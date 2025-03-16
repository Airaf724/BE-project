import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true, // such as sports , technical , clutural
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true, // class room number cc or ppcrc or college name
    },
    event_date: {
      type: Date,
      required: true,
    },
    event_time: {
      type: String,
      required: false, // 10:00 am, 2:00 pm, 6:00 pm etc.
    },
    community: {
      type: String,
      required: true, // gdsc , ITSA , CASA
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    registered: [
      {
        type: mongoose.Schema.Types.ObjectId, // who join the event  or regitser it
        ref: "User",
      },
    ],
    attendees: [],
    image_url: {
      type: String, // default image url if not provided by user.
    },
    registrationReward: { type: Number, default: 0 }, // Points for registering
    attendanceReward: { type: Number, default: 0 }, // Points for attending
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Events", EventSchema);

// event_time: {
//   type: String,
//   required: true,
// },
