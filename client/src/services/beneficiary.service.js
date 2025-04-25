import apiClient from './api';

class BeneficiaryService {
  // Get all beneficiaries
  async getBeneficiaries() {
    return apiClient.get('/customer/beneficiaries');
  }

  // Get beneficiary by ID
  async getBeneficiaryById(id) {
    return apiClient.get(`/customer/beneficiaries/${id}`);
  }

  // Create a new beneficiary
  async createBeneficiary(beneficiaryData) {
    return apiClient.post('/customer/beneficiaries', beneficiaryData);
  }

  // Update a beneficiary
  async updateBeneficiary(id, beneficiaryData) {
    return apiClient.put(`/customer/beneficiaries/${id}`, beneficiaryData);
  }

  // Delete a beneficiary
  async deleteBeneficiary(id) {
    return apiClient.delete(`/customer/beneficiaries/${id}`);
  }
}

const beneficiaryService = new BeneficiaryService();
export default beneficiaryService; 