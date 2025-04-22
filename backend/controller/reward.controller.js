import { Reward } from "../models/rewards.model.js";
import { uploadOnCloudinary } from "../utitls/cloudinary.js";
import mongoose from "mongoose";

export const addReward = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  try {
    const { name, description, courseLink, price, category, level, point } =
      req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const reward = new Reward({
      name,
      description,
      courseLink,
      price,
      category,
      level,
      points: point,
      image: imageUrl, // Store Cloudinary image URL
    });

    await reward.save();

    res
      .status(200)
      .json({ success: true, message: "Reward created successfully", reward });
  } catch (error) {
    console.error("Error in reward creation:", error);
    res
      .status(400)
      .json({ success: false, message: "Problem with creating reward" });
  }
};

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({});
    res
      .status(200)
      .json({ success: true, message: "Reward created successfully", rewards });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error in fetching reawrds" });
  }
};

export const getRewardsById = async (req, res) => {
  try {
    const { id } = req.body;
    const reward = await Reward.findById(id);
    if (!reward) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, reward });
  } catch (error) {
    console.error("Error in fetching reward:", error);
    res
      .status(500)
      .json({ success: false, message: "Problem with fetching reward" });
  }
};

export const updateReward = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const reward = await Reward.findById(id);

    if (!reward) {
      return res.status(404).json({ message: "reward not found" });
    }

    // Process image upload if needed
    let image_url = reward.image_url;
    if (req.file) {
      const newImageUrl = await uploadOnCloudinary(req.file.path);
      if (newImageUrl) {
        image_url = newImageUrl;
      }
    }

    // Update event data
    const updatedData = {
      name: req.body.name || reward.name,
      description: req.body.description || reward.description,
      courseLink: req.body.courseLink || reward.courseLink,
      price: req.body.price || reward.price,
      points: req.body.points || reward.points,
      category: req.body.category || reward.category,
      level: req.body.level || reward.level,
      image: image_url,
    };

    const updatedReward = await Reward.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedReward);
  } catch (error) {
    console.error("Error updating reward:", error);
    res
      .status(500)
      .json({ message: "Failed to update reward", error: error.message });
  }
};
