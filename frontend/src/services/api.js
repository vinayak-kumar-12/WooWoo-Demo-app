import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { constants } from '../utils/constants';

/**
 * Configure global Axios instance.
 * Automatically injects the JWT access token and handles token refreshes transparently.
 */
const api = axios.create({
  baseURL: constants.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync(constants.TOKEN_KEY);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error retrieving access token from SecureStore:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// State for handling token refresh requests
let isRefreshing = false;
let failedQueue = [];

/**
 * Resolves or rejects queued promises in the waiting list
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New access token if refresh succeeded
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and code is TOKEN_EXPIRED, and request is not retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(constants.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Call the refresh endpoint (using axios directly to prevent infinite interceptor loops)
        const response = await axios.post(`${constants.API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Save new rotated tokens
        await SecureStore.setItemAsync(constants.TOKEN_KEY, newAccessToken);
        await SecureStore.setItemAsync(constants.REFRESH_TOKEN_KEY, newRefreshToken);

        // Process queue with the new access token
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear session on refresh failure
        await SecureStore.deleteItemAsync(constants.TOKEN_KEY);
        await SecureStore.deleteItemAsync(constants.REFRESH_TOKEN_KEY);
        
        // Mark that the token refresh process has failed
        return Promise.reject({ ...error, isRefreshFailed: true });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || { message: 'Network connection failed' });
  }
);

export default api;
