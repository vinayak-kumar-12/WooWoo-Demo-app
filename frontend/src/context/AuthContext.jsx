import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import authService from '../services/authService';
import { constants } from '../utils/constants';

export const AuthContext = createContext();

/**
 * Pure JS base64 decoder to bypass global atob limits in Hermes/JSC environments
 */
const decodeBase64 = (str) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  str = String(str).replace(/=+$/, '');
  if (str.length % 4 === 1) {
    throw new Error("'decodeBase64' failed: The string is not correctly encoded.");
  }
  for (
    let bc = 0, bs, buffer, idx = 0;
    (buffer = str.charAt(idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

/**
 * Helper to decode and check if a JWT is expired
 * @param {string} token - JWT Access Token
 * @returns {boolean} True if expired
 */
const isTokenExpired = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode base64 payload adding padding if necessary
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(decodeBase64(padded));
    
    // Return whether current time is past expiration claim (in milliseconds)
    return decoded.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from SecureStore on launch
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(constants.TOKEN_KEY);
        const storedRefreshToken = await SecureStore.getItemAsync(constants.REFRESH_TOKEN_KEY);
        const storedUserData = await SecureStore.getItemAsync(constants.USER_KEY);
        
        if (storedToken && storedRefreshToken) {
          const expired = isTokenExpired(storedToken);
          
          if (expired) {
            // Silently call refresh endpoint
            try {
              const response = await axios.post(`${constants.API_URL}/auth/refresh`, {
                refreshToken: storedRefreshToken,
              });
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
              
              await SecureStore.setItemAsync(constants.TOKEN_KEY, newAccessToken);
              await SecureStore.setItemAsync(constants.REFRESH_TOKEN_KEY, newRefreshToken);
              
              setToken(newAccessToken);
              if (storedUserData) {
                setUser(JSON.parse(storedUserData));
              }
            } catch (refreshErr) {
              console.error('Silent refresh failed on startup:', refreshErr);
              // Clear stored items if refresh token expired/revoked
              await SecureStore.deleteItemAsync(constants.TOKEN_KEY);
              await SecureStore.deleteItemAsync(constants.REFRESH_TOKEN_KEY);
              await SecureStore.deleteItemAsync(constants.USER_KEY);
            }
          } else {
            setToken(storedToken);
            if (storedUserData) {
              setUser(JSON.parse(storedUserData));
            }
          }
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.accessToken && data.refreshToken) {
        await SecureStore.setItemAsync(constants.TOKEN_KEY, data.accessToken);
        await SecureStore.setItemAsync(constants.REFRESH_TOKEN_KEY, data.refreshToken);
        await SecureStore.setItemAsync(constants.USER_KEY, JSON.stringify(data.user));
        
        setToken(data.accessToken);
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await authService.signup(username, email, password);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = await SecureStore.getItemAsync(constants.REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (e) {
      console.warn('Backend logout failed or offline:', e);
    } finally {
      await SecureStore.deleteItemAsync(constants.TOKEN_KEY);
      await SecureStore.deleteItemAsync(constants.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(constants.USER_KEY);
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const logoutAll = async () => {
    setLoading(true);
    try {
      await authService.logoutAll();
    } catch (e) {
      console.warn('Backend logout-all failed:', e);
    } finally {
      await SecureStore.deleteItemAsync(constants.TOKEN_KEY);
      await SecureStore.deleteItemAsync(constants.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(constants.USER_KEY);
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: token,
        loading,
        isLoading: loading, // Aliased for maximum compatibility
        isAuthenticated,
        login,
        signup,
        logout,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
