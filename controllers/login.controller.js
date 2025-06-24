const express = require("express");
const passport = require("passport");
const router = express.Router();

exports.authenticate = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

module.exports = exports;
