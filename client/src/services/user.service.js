import apiClient from './api';

class UserService {
  // Get current user profile
  async getUserProfile() {
    return apiClient.get('/user/profile');
  }

  // Update user profile
  async updateProfile(userData) {
    return apiClient.put('/user/profile', userData);
  }

  // Admin: Get all users
  async getAllUsers() {
    return apiClient.get('/admin/users');
  }

  // Admin: Get user by ID
  async getUserById(userId) {
    return apiClient.get(`/admin/users/${userId}`);
  }
}

export default new UserService(); 