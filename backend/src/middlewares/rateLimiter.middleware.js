const rateLimit = require("express-rate-limit");

/**
 * General rate limiter for login attempts
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * General rate limiter for user registration
 */
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 signup requests per windowMs
  message: {
    success: false,
    message: "Too many accounts created from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General rate limiter for token refreshing
 */
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 refresh requests per windowMs
  message: {
    success: false,
    message: "Too many token refresh requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  signupLimiter,
  refreshLimiter,
};
