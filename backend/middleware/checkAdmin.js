import { User } from "../models/user.model.js";

export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not Found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized - Not an admin" });
    }

    next();
  } catch (error) {
    console.log("permission denied");
    console.log("error in checking middleware", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
