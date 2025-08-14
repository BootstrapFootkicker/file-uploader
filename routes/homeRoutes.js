const express = require("express");
const router = express.Router();
const checkAuth = require("../scripts/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.userName || "Guest";

    const folders = await prisma.folder.findMany({
      where: { userId },
      include: { file: true },
orderBy: { name: "asc" }
    });

    res.render("index", { folders, userName });
  } catch (err) {
    console.error("Error loading index:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
