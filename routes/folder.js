const router = require('express').Router();
const express = require("express");
const checkAuth = require("../scripts/auth");
const filesAndFoldersController = require("../controllers/filesAndFoldersController");

router.get("/", checkAuth, filesAndFoldersController.renderFolder);

module.exports = router;
