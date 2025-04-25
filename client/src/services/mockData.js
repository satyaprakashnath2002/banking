/**
 * Mock data for development
 * This can be used to simulate API responses while building the UI
 */

export const mockUser = {
  id: "user123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  profilePicture: null,
  role: "customer",
  createdAt: "2023-01-15T10:30:45Z",
  updatedAt: "2023-04-22T14:20:18Z"
};

export const mockAccounts = [
  {
    id: "acc1001",
    accountNumber: "1234567890",
    accountType: "savings",
    balance: 15678.45,
    currency: "USD",
    status: "active",
    createdAt: "2023-01-15T11:45:22Z"
  },
  {
    id: "acc1002",
    accountNumber: "0987654321",
    accountType: "checking",
    balance: 3452.12,
    currency: "USD",
    status: "active",
    createdAt: "2023-01-15T11:48:35Z"
  }
];

export const mockBeneficiaries = [
  {
    id: "ben1001",
    name: "Jane Smith",
    accountNumber: "5678901234",
    bankName: "Chase Bank",
    accountType: "checking",
    description: "Sister",
    createdAt: "2023-02-10T09:15:30Z"
  },
  {
    id: "ben1002",
    name: "Robert Johnson",
    accountNumber: "6789012345",
    bankName: "Bank of America",
    accountType: "savings",
    description: "Friend",
    createdAt: "2023-03-05T14:22:18Z"
  }
];

export const mockTransactions = [
  {
    id: "trx1001",
    type: "transfer",
    amount: 350.00,
    currency: "USD",
    fromAccount: "1234567890",
    toAccount: "5678901234",
    description: "Monthly rent",
    status: "completed",
    createdAt: "2023-04-01T10:45:12Z"
  },
  {
    id: "trx1002",
    type: "deposit",
    amount: 1250.50,
    currency: "USD",
    toAccount: "1234567890",
    description: "Salary deposit",
    status: "completed",
    createdAt: "2023-03-28T09:30:45Z"
  },
  {
    id: "trx1003",
    type: "withdrawal",
    amount: 80.00,
    currency: "USD",
    fromAccount: "0987654321",
    description: "ATM withdrawal",
    status: "completed",
    createdAt: "2023-03-25T16:20:33Z"
  }
];

export const mockNotifications = [
  {
    id: "not1001",
    type: "transaction",
    title: "New transaction",
    message: "You have received $1250.50 in your account.",
    read: false,
    createdAt: "2023-03-28T09:31:00Z"
  },
  {
    id: "not1002",
    type: "security",
    title: "New login detected",
    message: "A new login was detected from New York, USA.",
    read: true,
    createdAt: "2023-03-27T14:15:22Z"
  }
];

export const mockNotificationPreferences = {
  email: {
    transactions: true,
    security: true,
    promotions: false
  },
  sms: {
    transactions: true,
    security: true,
    promotions: false
  },
  push: {
    transactions: true,
    security: true,
    promotions: true
  }
};

export const mockActiveSessions = [
  {
    id: "ses1001",
    device: "Chrome on Windows",
    ip: "192.168.1.1",
    location: "New York, USA",
    lastActive: "2023-04-22T15:30:22Z",
    current: true
  },
  {
    id: "ses1002",
    device: "Mobile App on iPhone",
    ip: "192.168.2.1",
    location: "New York, USA",
    lastActive: "2023-04-21T10:15:45Z",
    current: false
  }
];

// Export all mock data as a single object for easy imports
export default {
  user: mockUser,
  accounts: mockAccounts,
  beneficiaries: mockBeneficiaries,
  transactions: mockTransactions,
  notifications: mockNotifications,
  notificationPreferences: mockNotificationPreferences,
  activeSessions: mockActiveSessions
}; 