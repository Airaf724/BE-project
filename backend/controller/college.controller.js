import { College } from "../models/college.model.js";
import { User } from "../models/user.model.js";

export const createNewCollege = async (req, res) => {
  try {
    const { name, city, state, country, adminId } = req.body;

    console.log("Creating college with admin:", adminId);

    // Check if a college with the same name, city, state, and country already exists
    const existingCollege = await College.findOne({
      name,
      city,
      state,
      country,
    });
    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message:
          "A college with the same name already exists in this location.",
      });
    }

    // Verify if the admin exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    // Create new college with admin
    const newCollege = await College.create({
      name,
      city,
      state,
      country,
      admins: [adminId], // Assign admin to college
    });

    console.log("New college created:", newCollege._id);

    // Update the admin user with the college ID
    const updateResult = await User.findByIdAndUpdate(
      adminId,
      {
        college: newCollege._id,
        isProfileComplete: true,
      },
      { new: true, runValidators: true } // Return updated document and run validators
    );

    console.log("User update result:", updateResult);

    if (!updateResult) {
      console.error("Failed to update user with college ID");
    }

    res.status(201).json({
      success: true,
      message: "College created successfully.",
      data: {
        college: newCollege,
        updatedAdmin: updateResult,
      },
    });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({}, "name _id city");
    res.status(200).json({ success: true, colleges });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
