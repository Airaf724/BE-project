// controller/attendance.controller.js
import { Event } from "../models/events.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import mongoose from "mongoose"; // Add this import for mongoose

// Generate a random 6-digit code for attendance
export const generateAttendanceCode = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Generate a random 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();

    // Set expiry time to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update event with attendance code and expiry
    await Event.findByIdAndUpdate(eventId, {
      attendanceCode: code,
      attendanceCodeExpiry: expiry,
    });

    res.status(200).json({
      code: code,
      expiresAt: expiry,
    });
  } catch (err) {
    console.error("Attendance Code Generation Error:", err);
    res.status(500).json({ message: "Failed to generate attendance code" });
  }
};

// Verify attendance code and mark attendance
export const verifyAttendanceCode = async (req, res) => {
  const { eventId, code, userId } = req.body;

  try {
    // Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if code is valid and not expired
    if (
      event.attendanceCode !== code ||
      !event.attendanceCodeExpiry ||
      event.attendanceCodeExpiry < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired attendance code" });
    }

    // Check if user is registered for event
    if (!event.registered.includes(userId)) {
      return res.status(403).json({ message: "Not registered for this event" });
    }

    // Check if attendance already marked in the event
    const alreadyMarked = event.attendees.some(
      (att) => att.user.toString() === userId.toString()
    );

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Mark attendance in Event model with timestamp
      event.attendees.push({ user: userId, timestamp: new Date() });
      await event.save({ session });

      // 2. Update user's registeredEvents array to change status to "Completed"
      const user = await User.findById(userId);

      // Find the event in user's registeredEvents array
      const eventIndex = user.registeredEvents.findIndex(
        (regEvent) => regEvent.eventId.toString() === eventId
      );

      if (eventIndex === -1) {
        // If not found, add it with "Completed" status
        user.registeredEvents.push({
          eventId: eventId,
          status: "Completed",
        });
      } else {
        // If found, update its status to "Completed"
        user.registeredEvents[eventIndex].status = "Completed";
      }

      // 3. Award points to the user based on event's attendanceReward
      if (event.attendanceReward && event.attendanceReward > 0) {
        // Add the event's attendance reward points to the user's total points
        user.points = (user.points || 0) + event.attendanceReward;
      }

      // Save the user with updated registeredEvents and points
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        message: "Attendance marked successfully",
        // Include extra data to help frontend update UI without refetching
        attendanceData: {
          eventId,
          status: "Completed",
          attended: true,
          pointsAwarded: event.attendanceReward || 0,
          totalPoints: user.points,
        },
      });
    } catch (err) {
      // If an error occurs, abort the transaction
      await session.abortTransaction();
      throw err;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (err) {
    console.error("Attendance Verification Error:", err);
    res.status(500).json({ message: "Failed to verify attendance code" });
  }
};

// New endpoint to check if a user has attended an event
export const checkAttendanceStatus = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  // Check if userId is provided in the request body
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Get the event and check if user is in attendees
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check attendance status
    const hasAttended = event.attendees.some(
      (att) => att.user.toString() === userId.toString()
    );

    // Get registration status from user document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const registeredEvent = user.registeredEvents?.find(
      (event) => event.eventId.toString() === eventId
    );

    const registrationStatus = registeredEvent ? registeredEvent.status : null;

    res.status(200).json({
      attended: hasAttended,
      registered: !!registeredEvent,
      status: registrationStatus,
    });
  } catch (err) {
    console.error("Attendance Status Check Error:", err);
    res.status(500).json({ message: "Failed to check attendance status" });
  }
};
