const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../scripts/auth");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use original name or preserve extension
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, base + "-" + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });
router.post("/", checkAuth, upload.single("filename"), (req, res) => {
  // req.file contains the uploaded file info
  // req.body contains any other form fields
  res.send("File uploaded!");
});

module.exports = router;

