const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
} = require("../controllers/auth.controller");
const {
  validateSignup,
  validateLogin,
  validateTokenAction,
} = require("../middlewares/validation.middleware");

const {
  loginLimiter,
  signupLimiter,
  refreshLimiter,
} = require("../middlewares/rateLimiter.middleware");

const { authenticateAccessToken } = require("../middlewares/auth.middleware");

// Public Authentication Endpoints (Rate limited + Input Validated)
router.post("/signup", signupLimiter, validateSignup, signup);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/refresh", refreshLimiter, validateTokenAction, refresh);

// Protected Authentication Endpoints
router.post("/logout", validateTokenAction, logout);
router.post("/logout-all", authenticateAccessToken, logoutAll);

module.exports = router;
