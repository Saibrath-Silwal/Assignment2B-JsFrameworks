require('dotenv').config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");
const User = require("./models/user");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('MongoDB connected successfully');
});

// Middleware setup
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session & flash - before passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: "Incorrect username." });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return done(null, false, { message: "Incorrect password." });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

// Make flash messages & user available to all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.user || null;
  next();
});

// Log all requests (for debugging)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Redirect root "/" to "/login"
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Use auth routes
app.use("/", authRouter);

// Mount books router after passport middleware
app.use("/books", booksRouter);

// Middleware to protect routes (can be reused in routes too)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("404", { url: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;