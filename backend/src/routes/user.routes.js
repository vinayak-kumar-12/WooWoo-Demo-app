const express = require("express");
const router = express.Router();

const { getMe } = require("../controllers/auth.controller");
const { authenticateAccessToken } = require("../middlewares/auth.middleware");

// GET /api/user/me -> Returns authenticated user profile
router.get("/me", authenticateAccessToken, getMe);

module.exports = router;
