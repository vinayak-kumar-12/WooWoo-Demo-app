import api from './api';

/**
 * Authentication service handling API requests for logins, signups, and logouts.
 */
const authService = {
  /**
   * Authenticates user credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object} Access token, refresh token, and user details
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registers a new user account
   * @param {string} username - User username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object} Access token, refresh token, and user details
   */
  signup: async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Revokes a specific session refresh token (Logout)
   * @param {string} refreshToken - Refresh token to invalidate
   * @returns {object} Success status message
   */
  logout: async (refreshToken) => {
    try {
      const response = await api.post('/auth/logout', { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Revokes all active user refresh tokens across all devices (Logout All)
   * @returns {object} Success status message
   */
  logoutAll: async () => {
    try {
      const response = await api.post('/auth/logout-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
