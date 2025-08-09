const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

// Show register form
router.get("/register", (req, res) => {
  res.render("register", { messages: req.flash() });
});

// Handle register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already taken");
      return res.redirect("/register");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, passwordHash });
    await newUser.save();

    req.flash("success", "Registration successful! Please login.");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login", { messages: req.flash() });
});

// Handle login with passport
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
