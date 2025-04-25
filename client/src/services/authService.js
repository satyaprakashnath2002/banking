import api from './api';
import jwtDecode from 'jwt-decode';

// Helper functions for token storage
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const storeTokens = (token, refreshToken, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

const getRefreshTokenFromStorage = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

// Authentication service functions
const authService = {
  // Login user and store tokens
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/signin', { email, password });
    const { accessToken } = response.data;
    
    storeTokens(accessToken, accessToken, rememberMe); // Using accessToken as both token and refreshToken
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return response.data;
  },
  
  // Register a new user
  register: async (userData) => {
    return await api.post('/auth/signup', userData);
  },
  
  // Logout user and clear tokens
  logout: () => {
    api.defaults.headers.common['Authorization'] = '';
    clearTokens();
  },
  
  // Refresh authentication token
  refreshAuthToken: async () => {
    const refreshToken = getRefreshTokenFromStorage();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token, newRefreshToken } = response.data;
      
      // Store new tokens with the same storage method as before
      const rememberMe = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeTokens(token, newRefreshToken, rememberMe);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return token;
    } catch (error) {
      clearTokens();
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email) => {
    return await api.post('/auth/request-password-reset', { email });
  },
  
  // Reset password with token
  resetPassword: async (token, newPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword });
  },
  
  // Change password (authenticated)
  changePassword: async (currentPassword, newPassword) => {
    return await api.post('/auth/change-password', { currentPassword, newPassword });
  },
  
  // Verify email with token
  verifyEmail: async (token) => {
    return await api.post('/auth/verify-email', { token });
  },
  
  // Resend verification email
  resendVerificationEmail: async (email) => {
    return await api.post('/auth/resend-verification', { email });
  },
  
  // Two-factor authentication
  setupTwoFactorAuth: async () => {
    return await api.post('/auth/2fa/setup');
  },
  
  verifyTwoFactorAuth: async (code) => {
    return await api.post('/auth/2fa/verify', { code });
  },
  
  disableTwoFactorAuth: async (code) => {
    return await api.post('/auth/2fa/disable', { code });
  },
  
  getTwoFactorBackupCodes: async () => {
    return await api.get('/auth/2fa/backup-codes');
  },
  
  regenerateTwoFactorBackupCodes: async () => {
    return await api.post('/auth/2fa/regenerate-backup-codes');
  },
  
  // Get authentication token
  getToken: () => {
    return getTokenFromStorage();
  },
  
  // Get refresh token
  getRefreshToken: () => {
    return getRefreshTokenFromStorage();
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getTokenFromStorage();
    
    if (!token) {
      return false;
    }
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Get current user data from token
  getCurrentUser: () => {
    const token = getTokenFromStorage();
    
    if (!token) {
      return null;
    }
    
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },
  
  // Initialize authentication (call on app startup)
  initializeAuth: () => {
    const token = getTokenFromStorage();
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Optional: Validate token here or refresh if needed
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        // If token is about to expire, refresh it
        if (decoded.exp - currentTime < 300) { // less than 5 minutes left
          authService.refreshAuthToken().catch(() => {
            // If refresh fails, just clear the token
            authService.logout();
          });
        }
      } catch (error) {
        authService.logout();
      }
    }
  }
};

export default authService; 