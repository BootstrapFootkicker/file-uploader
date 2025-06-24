const express = require("express");
const loginController = require("../controllers/login.controller");
const router = express.Router();
const passport = require("passport");

// GET login page
router.get("/", (req, res, next) => {
  try {
    res.render("login", { title: "Login" });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

module.exports = router;
