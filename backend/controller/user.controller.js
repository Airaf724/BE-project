import { User } from "../models/user.model.js";
import { Event } from "../models/events.model.js";

export const getUsersData = async (req, res) => {
  try {
    const { collegeId } = req.body;
    if (!collegeId) {
      res
        .status(200)
        .json({ success: false, message: "problem with fetching users" });
    }
    const users = await User.find({ college: collegeId });
    res.status(200).json({ success: true, data: users });
    return users;
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: "problem with fetching users" });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const { userIds } = req.body;

    const usersData = await User.find({ _id: { $in: userIds } }, "-password");
    res.status(200).json({ success: true, data: usersData });
    return usersData;
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

export const updateStatus = async (req, res) => {
  const { userId, eventId, newStatus } = req.body;
  let { reward } = req.body;

  if (!userId || !eventId || !newStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (newStatus !== "Completed") {
    reward = 0;
  }

  console.log("reward", reward, "   , newStatus", newStatus);

  try {
    // Update the user's event status
    const user = await User.findOneAndUpdate(
      { _id: userId, "registeredEvents.eventId": eventId },
      {
        $set: { "registeredEvents.$.status": newStatus },
        $inc: { points: reward },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or event not found" });
    }

    console.log("user", user);

    res.status(200).json({
      message: "Status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const setProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { erp, gender, mobileNumber, branch, collegeId } = req.body;

    // Find the user and update profile fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "profile.erp": erp,
          "profile.gender": gender,
          "profile.phone": mobileNumber,
          "profile.branch": branch,
          isProfileComplete: true, // Ensure this gets updated
          college: collegeId,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
