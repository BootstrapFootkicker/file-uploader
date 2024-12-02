const express = require("express");
const loginController = require("../controllers/loginController");
const router = express.Router();
const passport = require("passport");

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
