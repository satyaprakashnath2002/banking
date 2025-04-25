import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { setAuthToken } from '../services/api';

// Create auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenVerified, setTokenVerified] = useState(null);

  // Check if token is valid
  const verifyToken = async (token) => {
    try {
      // Set auth token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Make request to verify endpoint
      const response = await axios.get('http://localhost:8081/api/auth/verify-token');
      return response.data.valid;
    } catch (err) {
      console.error('Token verification failed:', err);
      return false;
    }
  };

  // Load user from local storage and verify token on initial render
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Try getting user from local storage
        const userStr = localStorage.getItem('user');
        
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            
            if (user && user.accessToken) {
              // Initialize user state immediately from localStorage
              setCurrentUser(user);
              
              // Set auth token in axios headers and in the api service
              axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
              setAuthToken(user.accessToken);
              
              // Verify the token is still valid (in background)
              const isValid = await verifyToken(user.accessToken);
              
              if (isValid) {
                setTokenVerified(true);
              } else {
                // Token is invalid, clear user
                setCurrentUser(null);
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                setAuthToken(null);
                setTokenVerified(false);
              }
            } else {
              setTokenVerified(false); // No valid token in user object
            }
          } catch (parseError) {
            // Handle JSON parse error
            console.error('Error parsing user from localStorage:', parseError);
            localStorage.removeItem('user');
            setTokenVerified(false);
          }
        } else {
          setTokenVerified(false); // Mark as verified if no token exists
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setTokenVerified(false); // Mark as verified to allow navigation
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:8081/api/auth/signin', {
        email,
        password
      });

      const user = response.data;
      
      // Set auth token in axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
      setAuthToken(user.accessToken);
      
      // Save user to state and localStorage
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setTokenVerified(true);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:8081/api/auth/signup', userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    // Remove auth token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    setAuthToken(null);
    // Clear user from state
    setCurrentUser(null);
    setTokenVerified(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.put('http://localhost:8081/api/user/profile', userData);
      
      // Update user in state and localStorage
      const updatedUser = {
        ...currentUser,
        ...response.data
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during profile update');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set auth token for API requests when user exists
  useEffect(() => {
    if (currentUser && currentUser.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentUser.accessToken}`;
      setAuthToken(currentUser.accessToken);
    }
  }, [currentUser]);

  // Export context values
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    tokenVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 