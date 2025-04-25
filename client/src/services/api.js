import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Track network status
let isOnline = navigator.onLine;
window.addEventListener('online', () => { isOnline = true; });
window.addEventListener('offline', () => { isOnline = false; });

// Function to check if server is reachable
const checkServerReachable = async () => {
  try {
    await axios.get(`${api.defaults.baseURL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};

// Get auth token from storage
const getAuthToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

// Get refresh token from storage
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

// Store tokens in local or session storage
const storeTokens = (token, refreshToken, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('accessToken', token);
  storage.setItem('refreshToken', refreshToken);
};

// Helper function to set the JWT token in the headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize token from storage on app start
const initToken = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

// Call initToken to set token from storage
initToken();

// Add request interceptor for showing loading indicators, etc.
api.interceptors.request.use(
  (config) => {
    // You can add global loading state here
    // store.dispatch(setLoading(true));
    
    // Refresh token if needed
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    // Do something with request error
    // store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

// Function to refresh the auth token
const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    // Use a new axios instance to avoid interceptors loop
    const response = await axios.post(
      `${api.defaults.baseURL}/auth/refresh-token`, 
      { refreshToken },
      { timeout: 10000 } // 10 seconds timeout for token refresh
    );
    
    const { token, newRefreshToken } = response.data;
    
    // Store the new tokens
    const rememberMe = Boolean(localStorage.getItem('refreshToken'));
    storeTokens(token, newRefreshToken || refreshToken, rememberMe);
    
    return token;
  } catch (error) {
    // If refresh fails, clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    throw error;
  }
};

// Add response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx cause this function to trigger
    // store.dispatch(setLoading(false));
    
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    
    // Return the response directly, don't extract data
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // store.dispatch(setLoading(false));
    
    // Handle network errors and timeouts
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server might be down or network issues.');
    }
    
    const originalRequest = error.config;
    
    // Implement request retry for network errors (up to 2 retries)
    if ((!error.response || error.code === 'ECONNABORTED') && originalRequest && !originalRequest._retry && !originalRequest._retryCount) {
      originalRequest._retryCount = 1;
      
      // Check if we're online before retrying
      if (isOnline) {
        console.log('Network error, retrying request (1/2)...');
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      }
    }
    
    // Second retry attempt
    if ((!error.response || error.code === 'ECONNABORTED') && originalRequest && !originalRequest._retry && originalRequest._retryCount === 1) {
      originalRequest._retryCount = 2;
      
      // Check if we're online before retrying
      if (isOnline) {
        console.log('Network error, retrying request (2/2)...');
        // Wait longer before second retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api(originalRequest);
      }
    }
    
    // Handle token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshAuthToken();
        
        // Set new token in header
        setAuthToken(newToken);
        
        // Update the auth header in the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed', refreshError);
        
        // Clear any auth tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other common error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      switch (error.response.status) {
        case 400:
          // Bad request
          console.error('Bad Request:', error.response.data);
          break;
        case 403:
          // Forbidden
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          // Not found
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          // Server error
          console.error('Server Error:', error.response.data);
          break;
        default:
          // Other error
          console.error('API Error:', error.response.status, error.response.data);
          break;
      }
      
      // You can dispatch specific error actions here
      // store.dispatch(setError(error.response.data.message));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      // Try to detect offline status
      if (!navigator.onLine) {
        console.error('Browser is offline');
        // store.dispatch(setError('You are currently offline. Please check your internet connection.'));
      } else {
        console.error('Server might be down or unreachable');
        // store.dispatch(setError('Server is unreachable. Please try again later.'));
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      // store.dispatch(setError('An error occurred. Please try again.'));
    }
    
    return Promise.reject(error);
  }
);

export default api; 