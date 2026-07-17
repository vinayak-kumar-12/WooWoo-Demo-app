const { body, validationResult } = require("express-validator");

/**
 * Middleware to check validation results and return errors if validation failed
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
      message: "Validation failed",
    });
  }
  next();
};

/**
 * Validation rules for user signup
 */
const validateSignup = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateResults,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  validateResults,
];

/**
 * Validation rules for token actions
 */
const validateTokenAction = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isString()
    .withMessage("Refresh token must be a string"),
  validateResults,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateTokenAction,
};
