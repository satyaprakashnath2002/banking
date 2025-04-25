import api from './api';
import mockData, { 
  mockUser, 
  mockAccounts, 
  mockBeneficiaries, 
  mockTransactions,
  mockNotifications,
  mockNotificationPreferences,
  mockActiveSessions 
} from './mockData';

// Set this to true for development mode with mock data,
// false to use real API endpoints
const USE_MOCK_DATA = true;

const userService = {
  /**
   * Get all users (admin only)
   * @returns {Promise} - Promise with users data
   */
  getUsers: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve([mockUser]);
    }
    return await api.get('/users');
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with user data
   */
  getUserById: async (userId) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockUser);
    }
    return await api.get(`/users/${userId}`);
  },

  /**
   * Update user (admin function)
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with updated user data
   */
  updateUser: async (userId, userData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockUser, ...userData });
    }
    return await api.put(`/users/${userId}`, userData);
  },

  /**
   * Delete user account (admin function)
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteUser: async (userId) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.delete(`/users/${userId}`);
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise with user data
   */
  getProfile: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockUser);
    }
    return await api.get('/users/profile');
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with updated user data
   */
  updateProfile: async (profileData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockUser, ...profileData });
    }
    return await api.put('/users/profile', profileData);
  },

  /**
   * Upload profile picture
   * @param {File} imageFile - Image file to upload
   * @returns {Promise} - Promise with upload result
   */
  uploadProfilePicture: async (imageFile) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true, profilePicture: 'https://via.placeholder.com/150' });
    }
    
    const formData = new FormData();
    formData.append('profilePicture', imageFile);
    
    return await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Delete profile picture
   * @returns {Promise} - Promise with deletion result
   */
  deleteProfilePicture: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.delete('/users/profile/picture');
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} - Promise with result
   */
  changePassword: async (passwordData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.put('/users/password', passwordData);
  },

  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with notifications data
   */
  getNotifications: async (params = {}) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockNotifications);
    }
    return await api.get('/users/notifications', { params });
  },

  /**
   * Mark notifications as read
   * @param {Array} notificationIds - IDs of notifications to mark as read
   * @returns {Promise} - Promise with result
   */
  markNotificationsAsRead: async (notificationIds) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.put('/users/notifications/read', { notificationIds });
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} - Promise with result
   */
  markAllNotificationsAsRead: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.put('/users/notifications/read-all');
  },

  /**
   * Get notification preferences
   * @returns {Promise} - Promise with preferences data
   */
  getNotificationPreferences: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockNotificationPreferences);
    }
    return await api.get('/users/notification-preferences');
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Updated notification preferences
   * @returns {Promise} - Promise with updated preferences
   */
  updateNotificationPreferences: async (preferences) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockNotificationPreferences, ...preferences });
    }
    return await api.put('/users/notification-preferences', preferences);
  },

  /**
   * Get security settings
   * @returns {Promise} - Promise with settings data
   */
  getSecuritySettings: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        twoFactorEnabled: false,
        lastPasswordChange: '2023-02-15T08:30:22Z',
        securityQuestions: true
      });
    }
    return await api.get('/users/security-settings');
  },

  /**
   * Update security settings
   * @param {Object} securitySettings - Updated security settings
   * @returns {Promise} - Promise with updated settings
   */
  updateSecuritySettings: async (securitySettings) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.put('/users/security-settings', securitySettings);
  },

  /**
   * Enable two-factor authentication
   * @returns {Promise} - Promise with setup data (secret, QR code)
   */
  enableTwoFactorAuth: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        secret: 'MOCK_SECRET_KEY',
        qrCodeUrl: 'https://via.placeholder.com/150'
      });
    }
    return await api.post('/users/2fa/enable');
  },

  /**
   * Verify two-factor authentication setup
   * @param {string} verificationCode - Verification code
   * @returns {Promise} - Promise with verification result
   */
  verifyTwoFactorAuth: async (verificationCode) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.post('/users/2fa/verify', { code: verificationCode });
  },

  /**
   * Disable two-factor authentication
   * @param {string} verificationCode - Verification code
   * @returns {Promise} - Promise with disabling result
   */
  disableTwoFactorAuth: async (verificationCode) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.post('/users/2fa/disable', { code: verificationCode });
  },

  /**
   * Get active sessions
   * @returns {Promise} - Promise with sessions data
   */
  getActiveSessions: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockActiveSessions);
    }
    return await api.get('/users/sessions');
  },

  /**
   * Terminate specific session
   * @param {string} sessionId - Session ID to terminate
   * @returns {Promise} - Promise with termination result
   */
  terminateSession: async (sessionId) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.delete(`/users/sessions/${sessionId}`);
  },

  /**
   * Terminate all sessions except current
   * @returns {Promise} - Promise with termination result
   */
  terminateAllSessions: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.delete('/users/sessions');
  },

  /**
   * Get user's activity history
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with activity history
   */
  getActivityHistory: async (params = {}) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve([
        { type: 'login', ipAddress: '192.168.1.1', device: 'Chrome on Windows', timestamp: '2023-04-22T14:30:22Z' },
        { type: 'profile_update', timestamp: '2023-04-20T11:15:45Z' },
        { type: 'password_change', timestamp: '2023-03-15T09:22:18Z' }
      ]);
    }
    return await api.get('/users/activity', { params });
  },
  
  /**
   * Export user data (GDPR)
   * @returns {Promise} - Promise with exported data
   */
  exportUserData: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(new Blob([JSON.stringify(mockData)], { type: 'application/json' }));
    }
    return await api.get('/users/export-data', {
      responseType: 'blob'
    });
  },

  /**
   * Get user accounts
   * @returns {Promise} - Promise with user accounts
   */
  getUserAccounts: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockAccounts);
    }
    return await api.get('/accounts');
  },

  /**
   * Get beneficiaries
   * @returns {Promise} - Promise with beneficiaries data
   */
  getBeneficiaries: async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockBeneficiaries);
    }
    return await api.get('/beneficiaries');
  },

  /**
   * Get beneficiary by id
   * @param {string} id - Beneficiary ID
   * @returns {Promise} - Promise with beneficiary data
   */
  getBeneficiaryById: async (id) => {
    if (USE_MOCK_DATA) {
      const beneficiary = mockBeneficiaries.find(b => b.id === id) || mockBeneficiaries[0];
      return Promise.resolve(beneficiary);
    }
    return await api.get(`/beneficiaries/${id}`);
  },

  /**
   * Add new beneficiary
   * @param {Object} beneficiaryData - Beneficiary data
   * @returns {Promise} - Promise with created beneficiary
   */
  addBeneficiary: async (beneficiaryData) => {
    if (USE_MOCK_DATA) {
      const newBeneficiary = {
        id: `ben_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...beneficiaryData
      };
      // Add to the mock beneficiaries array for immediate reflection in the UI
      mockBeneficiaries.push(newBeneficiary);
      return Promise.resolve(newBeneficiary);
    }
    return await api.post('/beneficiaries', beneficiaryData);
  },

  /**
   * Update beneficiary
   * @param {string} id - Beneficiary ID
   * @param {Object} beneficiaryData - Updated beneficiary data
   * @returns {Promise} - Promise with updated beneficiary
   */
  updateBeneficiary: async (id, beneficiaryData) => {
    if (USE_MOCK_DATA) {
      const index = mockBeneficiaries.findIndex(b => b.id === id);
      if (index !== -1) {
        // Update the existing beneficiary in the mock data
        mockBeneficiaries[index] = {
          ...mockBeneficiaries[index],
          ...beneficiaryData,
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve(mockBeneficiaries[index]);
      }
      return Promise.reject(new Error('Beneficiary not found'));
    }
    return await api.put(`/beneficiaries/${id}`, beneficiaryData);
  },

  /**
   * Delete beneficiary
   * @param {string} id - Beneficiary ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteBeneficiary: async (id) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return await api.delete(`/beneficiaries/${id}`);
  },

  /**
   * Initiate a transfer
   * @param {Object} transferData - Transfer data
   * @returns {Promise} - Promise with transfer result
   */
  initiateTransfer: async (transferData) => {
    if (USE_MOCK_DATA) {
      const newTransfer = {
        id: `trx${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString(),
        ...transferData
      };
      return Promise.resolve(newTransfer);
    }
    return await api.post('/transfers', transferData);
  }
};

// Export both as a named export and as default for backward compatibility
export { userService };
export default userService; 