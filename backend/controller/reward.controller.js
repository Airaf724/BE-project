import { Reward } from "../models/rewards.model.js";
import { uploadOnCloudinary } from "../utitls/cloudinary.js";

export const addReward = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  try {
    const { name, description, courseLink, price, category, level } = req.body;

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
