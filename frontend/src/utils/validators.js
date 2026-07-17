import { messages } from '../constants/messages';

/**
 * Validates an email address format
 * @param {string} email - Email to check
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password length
 * @param {string} password - Password to check
 * @returns {boolean} True if password is valid
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validates a username length
 * @param {string} username - Username to check
 * @returns {boolean} True if username is valid
 */
export const validateUsername = (username) => {
  return username && username.trim().length >= 3;
};

/**
 * Validates signup fields
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm Password
 * @returns {object} Error messages mapped by field name
 */
export const getSignupErrors = (username, email, password, confirmPassword) => {
  const errors = {};

  if (!username) {
    errors.username = messages.validation.usernameRequired;
  } else if (!validateUsername(username)) {
    errors.username = messages.validation.usernameTooShort;
  }

  if (!email) {
    errors.email = messages.validation.emailRequired;
  } else if (!validateEmail(email)) {
    errors.email = messages.validation.emailInvalid;
  }

  if (!password) {
    errors.password = messages.validation.passwordRequired;
  } else if (!validatePassword(password)) {
    errors.password = messages.validation.passwordTooShort;
  }

  if (!confirmPassword) {
    errors.confirmPassword = messages.validation.confirmPasswordRequired;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = messages.validation.passwordsDontMatch;
  }

  return errors;
};

/**
 * Validates login fields
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} Error messages mapped by field name
 */
export const getLoginErrors = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = messages.validation.emailRequired;
  } else if (!validateEmail(email)) {
    errors.email = messages.validation.emailInvalid;
  }

  if (!password) {
    errors.password = messages.validation.passwordRequired;
  }

  return errors;
};
