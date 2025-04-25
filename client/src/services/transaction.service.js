import apiClient from './api';

class TransactionService {
  // Customer: Get all transactions with retry capability
  async getCustomerTransactions(retryCount = 2) {
    try {
      return await apiClient.get('/customer/transactions');
    } catch (error) {
      // If we have retries left and it's a network error or 5xx server error, retry the request
      if (
        retryCount > 0 && 
        (
          !error.response || // Network error
          (error.response && error.response.status >= 500) // Server error
        )
      ) {
        console.log(`Retrying getCustomerTransactions, ${retryCount} attempts left`);
        
        // Wait a bit before retrying (exponential backoff)
        const waitTime = 1000 * (3 - retryCount); // 1s, 2s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Retry with one less retry count
        return this.getCustomerTransactions(retryCount - 1);
      }
      
      // If we're out of retries or it's a client error, throw the error
      throw error;
    }
  }

  // Check transaction service status with retry
  async checkServiceStatus(retryCount = 1) {
    try {
      return await apiClient.get('/customer/transactions/status', { 
        timeout: 5000,  // 5 second timeout for quick response
      });
    } catch (error) {
      // Only retry on network errors, not on API errors
      if (retryCount > 0 && !error.response) {
        console.log(`Retrying checkServiceStatus, ${retryCount} attempts left`);
        
        // Short wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry with no more retries
        return this.checkServiceStatus(0);
      }
      
      // If it's an API error or we're out of retries, we'll consider the service down
      // Create a standardized response for down service
      return {
        data: {
          status: 'down',
          message: 'Transaction service appears to be down. Some features may not work properly.'
        }
      };
    }
  }

  // Customer: Transfer money to beneficiary with retry capability
  async transferMoney(transferData, retryCount = 1) {
    try {
      return await apiClient.post('/customer/transactions/transfer', transferData);
    } catch (error) {
      // Only retry on network errors or server errors, not on validation errors
      if (
        retryCount > 0 && 
        (
          !error.response || // Network error
          (error.response && error.response.status >= 500) // Server error
        )
      ) {
        console.log(`Retrying transferMoney, ${retryCount} attempts left`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry with one less retry count
        return this.transferMoney(transferData, retryCount - 1);
      }
      
      throw error;
    }
  }

  // Admin: Get all transactions
  async getAllTransactions() {
    return apiClient.get('/admin/transactions');
  }

  // Admin: Get transactions by account ID
  async getTransactionsByAccount(accountId) {
    return apiClient.get(`/admin/transactions/account/${accountId}`);
  }

  // Admin: Process a deposit
  async deposit(depositData) {
    return apiClient.post('/admin/transactions/deposit', depositData);
  }

  // Admin: Process a withdrawal
  async withdraw(withdrawalData) {
    return apiClient.post('/admin/transactions/withdraw', withdrawalData);
  }

  // Admin: Process a transfer
  async adminTransfer(transferData) {
    return apiClient.post('/admin/transactions/transfer', transferData);
  }
}

export default new TransactionService(); 