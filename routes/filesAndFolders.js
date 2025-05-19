const express = require("express");
const folderController = require("../controllers/folderController");
const checkAuth = require("../scripts/auth");
const router = express.Router();

// Routes for folder operations
router.get("/", checkAuth, folderController.renderFilesAndFolders);
router.get("/:folderId", checkAuth, folderController.renderFolder);
router.post("/add", checkAuth, folderController.addFolder);
router.get("/userFolders", checkAuth, folderController.getUserFolders);

module.exports = router;