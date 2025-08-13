const express = require("express");
const folderController = require("../controllers/folders.controller");
const checkAuth = require("../scripts/auth");
const router = express.Router();

// Routes for folder operations
router.get("/", checkAuth, folderController.renderUserFoldersPage);
router.get("/:folderId", checkAuth, folderController.renderSingleFolderPage);
router.post("/addFolder", (req, res, next) => {
    console.log("📡 /files.js/addFolder called");
    next();
}, checkAuth, folderController.createFolder);
router.get("/userFolders", checkAuth, folderController.renderUserFoldersList);

router.delete("/removeFolder",checkAuth,folderController.deleteFolder)

router.put('/editFolderName', checkAuth, folderController.updateFolder);
module.exports = router;