import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// need to figure it out later process.env

cloudinary.config({
  cloud_name: "dwubudbuu",
  api_key: "937756523599471",
  api_secret: "QLVLxSNL2bRXDRDwev96pc_3J6o",
  // Click 'View API Keys' above to copy your API secret
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file provided to upload.");
      return null;
    }
    // upload the file on the cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      allowed_formats: ["png", "jpg", "jpeg", "gif"],
    });

    console.log("file uploaded successfully on cloudinary");
    console.log(response.url);
    fs.unlinkSync(localFilePath);

    return response.url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove local file if upload fails
    }
    console.error("Error during Cloudinary upload:", error.message);
    throw error; // Rethrow the error for further handling
  }
};
