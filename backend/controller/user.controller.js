import { User } from "../models/user.model.js";
import { Event } from "../models/events.model.js";
import { sendSubscriptionMailToUser } from "../nodemailer/nodemailer.js";
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

export const sendSubscriptionMail = async (req, res) => {
  try {
    const { email, userName } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    await sendSubscriptionMailToUser(email, userName || "");

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Error sending subscription email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const giveRewardTOUser = async (req, res) => {
  try {
    const { userId, eventId, rewardAmount } = req.body;

    // Validate inputs
    if (!userId || !eventId || !rewardAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, eventId, or rewardAmount",
      });
    }

    // Convert rewardAmount to number if it's a string
    const reward = Number(rewardAmount);

    // Validate reward amount
    if (isNaN(reward) || reward < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reward amount",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is registered for the event
    const userEventRegistration = user.registeredEvents.find(
      (registration) => registration.eventId.toString() === eventId
    );

    if (!userEventRegistration) {
      return res.status(400).json({
        success: false,
        message: "User is not registered for this event",
      });
    }

    // Add reward to user's balance
    user.rewardBalance = (user.rewardBalance || 0) + reward;

    // Log the reward in transaction history
    user.rewardTransactions = user.rewardTransactions || [];
    user.rewardTransactions.push({
      amount: reward,
      type: "credit",
      description: `Reward for ${event.name}`,
      timestamp: new Date(),
      eventId: eventId,
    });

    // Save the updated user
    await user.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Successfully added ${reward} reward points to ${user.name}`,
      data: {
        userId: user._id,
        name: user.name,
        newRewardBalance: user.rewardBalance,
      },
    });
  } catch (error) {
    console.error("Error giving reward to user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addNotificationTOUSer = async (req, res) => {};

export const markNotificationAsRead = async (req, res) => {};
