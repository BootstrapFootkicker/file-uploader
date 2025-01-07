
const express = require("express");
const filesAndFoldersController = require("../controllers/filesAndFoldersController");
const checkAuth = require("../scripts/auth");
const router = express.Router();

router.get("/", checkAuth,filesAndFoldersController.filesAndFolders);
router.get("/:folderId", checkAuth,);


module.exports = router;