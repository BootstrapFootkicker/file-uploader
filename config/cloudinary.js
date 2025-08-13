// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads", // or make dynamic per user/folder if needed
      allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf"],
      public_id: file.originalname.split(".")[0], // optional
    };
  },
});

module.exports = { cloudinary, storage };
