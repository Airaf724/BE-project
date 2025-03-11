import { User } from "../models/user.model.js";

export const getUsersData = async (req, res) => {
  try {
    const users = await User.find({});
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

  if (!userId || !eventId || !newStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "registeredEvents.eventId": eventId },
      { $set: { "registeredEvents.$.status": newStatus } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or event not found" });
    }

    res.status(200).json({ message: "Status updated successfully", user });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const setProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { erp, gender, mobileNumber, branch, classYear } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profile: { erp, gender, phone: mobileNumber, branch, class: classYear },
      }
      // { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
