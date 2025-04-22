
const express = require("express");
const filesAndFoldersController = require("../controllers/filesAndFoldersController");
const checkAuth = require("../scripts/auth");
const router = express.Router();

//todo wip create better name for file
router.get("/", checkAuth,filesAndFoldersController.filesAndFolders);
router.get("/:folderId", checkAuth,);
router.post("/addFolder", checkAuth, filesAndFoldersController.addFolderToDatabase);
router.get("/userFolders",filesAndFoldersController.getUserFolders)

module.exports = router;