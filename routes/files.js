const express = require("express");
const router = express.Router();
const checkAuth = require("../scripts/auth");
const { PrismaClient } = require("@prisma/client");
const { cloudinary } = require("../config/cloudinary");

const prisma = new PrismaClient();

router.post("/delete/:id", checkAuth, async (req, res) => {
  const fileId = req.params.id;
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      return res.status(403).send("Not allowed to delete this file.");
    }

    // Delete from Cloudinary first
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Then delete from the database
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.redirect(`/folder/${file.folderId}`);
  } catch (err) {
    console.error("❌ Failed to delete file:", err);
    res.status(500).send("Error deleting file");
  }
});

module.exports = router;
