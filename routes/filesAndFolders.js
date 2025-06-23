const express = require("express");
const folderController = require("../controllers/folderController");
const checkAuth = require("../scripts/auth");
const router = express.Router();

// Routes for folder operations
router.get("/", checkAuth, folderController.renderFilesAndFolders);
router.get("/:folderId", checkAuth, folderController.renderFolder);
router.post("/addFolder", (req, res, next) => {
    console.log("📡 /files/addFolder called");
    next();
}, checkAuth, folderController.addFolder);
router.get("/userFolders", checkAuth, folderController.getUserFolders);

router.delete("/removeFolder",checkAuth,folderController.removeFolder)

router.put('/editFolderName', checkAuth, folderController.updateFolder);
module.exports = router;