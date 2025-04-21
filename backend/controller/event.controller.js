import mongoose from "mongoose";
import { Event } from "../models/events.model.js";
import { uploadOnCloudinary } from "../utitls/cloudinary.js";
import { User } from "../models/user.model.js";
import { College } from "../models/college.model.js";
export const createEvents = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  try {
    const {
      name,
      domain,
      description,
      location,
      event_date,
      event_time,
      community,
      registrationReward,
      attendanceReward,
      collegeId,
      adminId,
    } = req.body;

    if (!collegeId) {
      console.log("collegeId not provided");
      return res
        .status(400)
        .json({ success: false, message: "collegeId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid college ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid college ID" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const event = new Event({
      name,
      domain,
      description,
      location,
      event_date,
      event_time,
      community,
      image_url: imageUrl,
      registrationReward,
      attendanceReward,
      college: new mongoose.Types.ObjectId(collegeId),
      adminId: new mongoose.Types.ObjectId(adminId),
    });

    await event.save();

    res
      .status(200)
      .json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    console.error("Error in event creation:", error);
    res
      .status(400)
      .json({ success: false, message: "Problem with storing event" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { collegeId, activeTab } = req.query;
    const { sortBy = "createdAt", order = "asc" } = req.query;

    // Validate sorting order
    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    let query = {};

    // Only filter by college if activeTab is "college" AND collegeId exists AND is not "all"
    if (activeTab === "college" && collegeId && collegeId !== "all") {
      query.college = collegeId;
    }
    const events = await Event.find(query).sort(sortOptions);

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error in fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventsByAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res
        .status(404)
        .json({ success: false, message: "Admin ID is required" });
    }

    const events = await Event.find({ adminId });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error in fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    const { domain } = req.params;
    const events = await Event.find({ domain });

    // Return empty array instead of 404 error when no events found
    res.status(200).json({
      success: true,
      events,
      count: events.length,
    });
  } catch (e) {
    console.error("Error in fetching events:", e);
    res.status(500).json({
      success: false,
      message: "Problem with fetching events",
    });
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

    // Get the registration reward points from the event
    const pointsToAdd = event.registrationReward || 0;

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

        // Update User: Add event to registeredEvents & increment points by event's registrationReward
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { registeredEvents: registrationEntry },
            $inc: { points: pointsToAdd }, // Increment points by event's registrationReward
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
      pointsAdded: pointsToAdd, // Indicate the actual points added
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

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Process image upload if needed
    let image_url = event.image_url;
    if (req.file) {
      const newImageUrl = await uploadOnCloudinary(req.file.path);
      if (newImageUrl) {
        image_url = newImageUrl;
      }
    }

    // Update event data
    const updatedData = {
      name: req.body.name || event.name,
      description: req.body.description || event.description,
      domain: req.body.domain || event.domain,
      location: req.body.location || event.location,
      event_date: req.body.event_date || event.event_date,
      event_time: req.body.event_time || event.event_time,
      isOpen:
        req.body.isOpen !== undefined
          ? req.body.isOpen === "true"
          : event.isOpen,
      image_url,
      registrationReward:
        req.body.registrationReward !== undefined
          ? Number(req.body.registrationReward)
          : event.registrationReward,
      attendanceReward:
        req.body.attendanceReward !== undefined
          ? Number(req.body.attendanceReward)
          : event.attendanceReward,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Convert string ID to ObjectId before using in updateMany
    const objectId = new mongoose.Types.ObjectId(id);

    // Remove the event ID from registeredEvents array of all users who registered
    await User.updateMany(
      { registeredEvents: objectId },
      { $pull: { registeredEvents: objectId } }
    );

    // Delete the event
    await Event.findByIdAndDelete(id);

    res.status(200).json({ id, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
};
