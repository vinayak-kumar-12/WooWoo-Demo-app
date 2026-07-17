const express = require("express");
const router = express.Router();

const { signup, login, getMe } = require("../controllers/auth.controller");
const { authenticateAccessToken } = require("../middlewares/auth.middleware");

// Public Legacy Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Legacy Route
router.get("/profile", authenticateAccessToken, (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Welcome to your profile",
    userId: req.user.id,
  });
});

module.exports = router;