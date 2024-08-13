import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto"
    });

    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath); // remove the locally saved temporary file as the uploaded operation got fail
  }
};

export { uploadOnCloudinary };