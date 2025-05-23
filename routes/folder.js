const router = require('express').Router();
const express = require("express");
const checkAuth = require("../scripts/auth");
const filesAndFoldersController = require("../controllers/folderController");
//wip for folder page, i.e whem you click on a folder button
router.get("/", checkAuth, filesAndFoldersController.renderFolder);

module.exports = router;
