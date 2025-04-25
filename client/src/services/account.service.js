import apiClient from './api';

class AccountService {
  // Customer: Get account details
  async getAccountDetails() {
    return apiClient.get('/customer/account');
  }

  // Admin: Get all accounts
  async getAllAccounts() {
    return apiClient.get('/admin/accounts');
  }

  // Admin: Get account by ID
  async getAccountById(accountId) {
    return apiClient.get(`/admin/accounts/${accountId}`);
  }

  // Admin: Create a new account
  async createAccount(accountData) {
    return apiClient.post('/admin/accounts', accountData);
  }

  // Admin: Update KYC status
  async updateKycStatus(accountId, kycVerified) {
    return apiClient.put(`/admin/accounts/${accountId}/kyc`, { kycVerified });
  }

  // Admin: Update account status (activate/deactivate)
  async updateAccountStatus(accountId, isActive) {
    return apiClient.put(`/admin/accounts/${accountId}/status`, { isActive });
  }
}

export default new AccountService(); 