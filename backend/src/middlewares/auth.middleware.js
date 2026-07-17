const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate access tokens.
 * Verifies JWT signature, payload structure, and checks expiration.
 * In case of expiration, it responds with code: "TOKEN_EXPIRED" to trigger silent refresh on the client.
 */
const authenticateAccessToken = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token Provided
    if (!token) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_MISSING",
        message: "Access denied. No token provided.",
      });
    }

    // Verify Access Token JWT
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "fallback_access_secret_123"
    );

    // Attach user payload
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Access token has expired. Please refresh.",
      });
    }

    return res.status(401).json({
      success: false,
      code: "TOKEN_INVALID",
      message: "Invalid access token.",
    });
  }
};

// Alias to retain compatibility with legacy routes
const protect = authenticateAccessToken;

module.exports = {
  authenticateAccessToken,
  protect,
};