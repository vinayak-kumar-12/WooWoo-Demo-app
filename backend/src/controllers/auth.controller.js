const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/users.models");
const {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  incrementUserTokenVersion,
} = require("../models/refreshTokens.models");
const {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

/**
 * Handle user registration (Signup)
 * Creates user, generates access and refresh tokens, hashes and stores refresh token
 */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (default token_version is 1)
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store Hashed Refresh Token
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await saveRefreshToken(user.id, refreshTokenHash, expiresAt);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      refreshToken,
      token: accessToken, // Compatibility alias
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user authentication (Login)
 * Verifies password, generates access and refresh tokens, hashes and stores refresh token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store Hashed Refresh Token
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await saveRefreshToken(user.id, refreshTokenHash, expiresAt);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      token: accessToken, // Compatibility alias
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle refresh token rotation
 * Validates, rotates refresh token, generates a new access token
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret_123"
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        code: "REFRESH_TOKEN_INVALID",
        message: "Invalid or expired refresh token",
      });
    }

    const { userId, tokenVersion } = decoded;

    // Hash Token to check DB
    const tokenHash = hashToken(refreshToken);
    const dbToken = await findRefreshToken(tokenHash);

    // Check if token exists in DB, is expired or is revoked
    if (!dbToken || dbToken.revoked_at || new Date() > new Date(dbToken.expires_at)) {
      return res.status(401).json({
        success: false,
        code: "REFRESH_TOKEN_REVOKED",
        message: "Refresh token has been revoked or expired",
      });
    }

    // Fetch user to compare token version
    const user = await findUserById(userId);
    if (!user || user.token_version !== tokenVersion) {
      return res.status(401).json({
        success: false,
        code: "REFRESH_TOKEN_REVOKED",
        message: "Token has been invalidated globally",
      });
    }

    // Revoke the old refresh token (Mark as revoked)
    await revokeRefreshToken(tokenHash);

    // Generate New Tokens (Token Rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new Refresh Token
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await saveRefreshToken(user.id, newHash, expiresAt);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke specific refresh token (Logout)
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokenHash = hashToken(refreshToken);
    await revokeRefreshToken(tokenHash);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke all refresh tokens for a user by incrementing token version (Logout All)
 */
const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await incrementUserTokenVersion(userId);

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
  getMe,
};
