const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
  * Hahses a raw token string using SHA-256
  * @param {string} token - The raw token
  * @returns {string} The hex representation of the SHA-256 hash
  */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
  * Generates a short-lived access token
  * @param {object} user - User object containing id and email
  * @returns {string} The signed JWT access token
  */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET || "fallback_access_secret_123",
    { expiresIn: "15m" }
  );
};

/**
  * Generates a long-lived refresh token
  * @param {object} user - User object containing id and token_version
  * @returns {string} The signed JWT refresh token
  */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.token_version || 1 },
    process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret_123",
    { expiresIn: "7d" }
  );
};

module.exports = {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
};
