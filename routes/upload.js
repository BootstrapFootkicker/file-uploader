const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../scripts/auth");
const { PrismaClient } = require("@prisma/client");
const { storage } = require("../config/cloudinary");

const prisma = new PrismaClient();
const upload = multer({ storage });

router.post("/", checkAuth, upload.single("filename"), async (req, res) => {
  const folderId = req.body.folderId;
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,             // this is the Cloudinary URL
        cloudinaryId: req.file.filename, // needed to delete later
        type: req.file.mimetype,
        size: req.file.size,
        folder: { connect: { id: folderId } },
        user: { connect: { id: userId } }
      }
    });

    res.redirect(`/folder/${folderId}`);
  } catch (err) {
    console.error("Error saving file to DB:", err);
    res.status(500).send("File upload succeeded but saving to DB failed.");
  }
});

module.exports = router;
