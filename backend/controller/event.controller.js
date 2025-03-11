import mongoose from "mongoose";
import { Event } from "../models/events.model.js";
import { uploadOnCloudinary } from "../utitls/cloudinary.js";
import { User } from "../models/user.model.js";

export const createEvents = async (req, res) => {
  const {
    name,
    domain,
    description,
    location,
    event_date,
    event_time,
    community,
  } = req.body;
  const localFilePath = req.file.path;
  try {
    if (
      (!name ||
        !domain ||
        !description ||
        !location ||
        !event_date ||
        !event_time,
      !community)
    ) {
      throw new Error("All fields are required");
    }
    const url = await uploadOnCloudinary(localFilePath);

    const event = new Event({
      name,
      domain,
      description,
      location,
      event_date,
      event_time,
      community,
      image_url: url,
    });

    await event.save();
    res.status(200).json({
      success: true,
      message: "Event created successfully",
      event, // need to be remove later
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "problem with storing event" });
    console.log("error in event creation", error);
  }
};

export const getEvents = async (req, res) => {
  try {
    const { domain, sortBy, order = "asc" } = req.query;
    const filter = domain ? { domain } : {};
    const sortOptions = { [sortBy || "createdAt"]: order === "asc" ? 1 : -1 };

    const event = await Event.find({}).sort(sortOptions);
    if (!event) {
      res.status(204).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
    return event;
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "problem with fetching events" });
    console.log("error in fetching events", error);
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.body;
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, event });
    return event;
  } catch (error) {
    console.error("Error in fetching event:", error);
    res
      .status(500)
      .json({ success: false, message: "Problem with fetching event" });
  }
};
export const getDomainEvents = async (req, res) => {
  try {
    const { domain } = req.params; // Ensure the param name matches the route
    const events = await Event.find({ domain });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Events not found events length is 0 ",
      });
    }

    res.status(200).json({ success: true, events });
    return events;
  } catch (e) {
    console.error("Error in fetching events:", e);
    res
      .status(500)
      .json({ success: false, message: "Problem with fetching events" });
  }
};

// export const registerEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { userId } = req.body;

//     if (
//       !mongoose.Types.ObjectId.isValid(userId) ||
//       !mongoose.Types.ObjectId.isValid(eventId)
//     ) {
//       return res.status(400).json({ message: "Invalid eventId or userId" });
//     }

//     //check if event exists

//     const event = await Event.findById(eventId);

//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // check if user is already registered for the event
//     if (event.attendees.includes(userId)) {
//       res
//         .status(400)
//         .json({ message: "User already registered for this event" });
//     }

//     event.attendees.push(userId);
//     await event.save();
//     res.status(200).json({
//       message: "User registered successfully",
//       event,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "failed to register try again" });
//   }
// };

// export const registerEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { userId } = req.body;

//     // Prevent multiple response attempts
//     let responseSent = false;

//     // Check for existing registration
//     const existingEvent = await Event.findById(eventId);
//     if (!existingEvent) {
//       if (!responseSent) {
//         responseSent = true;
//         return res.status(404).json({ message: "Event not found" });
//       }
//     }

//     if (existingEvent.attendees.includes(userId)) {
//       if (!responseSent) {
//         responseSent = true;
//         return res.status(400).json({ message: "Already registered" });
//       }
//     }

//     // Add user to attendees
//     existingEvent.attendees.push(userId);
//     await existingEvent.save();

//     if (!responseSent) {
//       responseSent = true;
//       res.status(200).json({
//         message: "Successfully registered",
//         event: existingEvent,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     if (!responseSent) {
//       res.status(500).json({ message: "Error registering for event" });
//     }
//   }
// };

export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    // Input validation
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res.status(400).json({ message: "Invalid eventId or userId" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is open for registration
    if (!event.isOpen) {
      return res.status(400).json({ message: "Event registration is closed" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate registration in both user and event
    const isAlreadyRegistered = user.registeredEvents.some(
      (reg) => reg.eventId.toString() === eventId
    );
    if (isAlreadyRegistered || event.registered.includes(userId)) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Create the registration entry
    const registrationEntry = {
      eventId,
      status: "Registered",
    };

    // Start a transaction session
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Update Event
        await Event.findByIdAndUpdate(
          eventId,
          { $push: { registered: userId } },
          { session }
        );

        // Update User: Add event to registeredEvents & increment points by 10
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { registeredEvents: registrationEntry },
            $inc: { points: 10 }, // Increment points by 10
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({
      message: "Registered successfully!",
      status: "Registered",
      pointsAdded: 10, // Indicate that points were incremented
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({
      message: "Failed to register for event",
      error: error.message,
    });
  }
};

export const getSearchResults = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) query.name = { $regex: `^${req.query.name}`, $options: "i" };
    const events = await Event.find(query);
    res.status(200).json({ success: true, events });
    return events;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
