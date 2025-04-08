const express = require("express");
const router = express.Router();

// GET logout page

router.delete("/", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
