import apiClient from './api';

class AuthService {
  // User login
  async login(email, password) {
    const response = await apiClient.post('/auth/signin', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  }

  // User logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // User registration
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  // Check if user is logged in
  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user && !!user.accessToken;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return !!user && user.role === 'admin';
  }

  // Check if user is customer
  isCustomer() {
    const user = this.getCurrentUser();
    return !!user && user.role === 'customer';
  }
}

const authService = new AuthService();
export default authService; 