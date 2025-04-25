const db = require("../models");
const User = db.users;
const Account = db.accounts;
const Transaction = db.transactions;

// Function to generate a random account number
const generateAccountNumber = () => {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
};

// Customer: Get account details
exports.getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { userId: req.userId },
      include: [{
        model: User,
        as: "user",
        attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
      }]
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    res.status(200).send(account);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Create a new account for a user
exports.createAccount = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if user already has an account
    const existingAccount = await Account.findOne({
      where: { userId: req.body.userId }
    });

    if (existingAccount) {
      return res.status(400).send({ message: "User already has an account." });
    }

    // Generate unique account number
    let accountNumber;
    let isUnique = false;
    
    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const accountWithNumber = await Account.findOne({
        where: { accountNumber: accountNumber }
      });
      if (!accountWithNumber) {
        isUnique = true;
      }
    }

    // Create new account
    const newAccount = await Account.create({
      userId: req.body.userId,
      accountNumber: accountNumber,
      accountType: req.body.accountType || "savings",
      balance: req.body.initialDeposit || 0.00,
      kycVerified: req.body.kycVerified || false
    });

    // If there's an initial deposit, create a transaction record
    if (req.body.initialDeposit && req.body.initialDeposit > 0) {
      await Transaction.create({
        accountId: newAccount.id,
        transactionType: "deposit",
        amount: req.body.initialDeposit,
        description: "Initial deposit",
        balanceAfter: req.body.initialDeposit,
        performedBy: req.userId // Admin who created the account
      });
    }

    res.status(201).send({
      message: "Account created successfully",
      account: newAccount
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      include: [{
        model: User,
        as: "user",
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
      }]
    });

    res.status(200).send(accounts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get account by ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id, {
      include: [{
        model: User,
        as: "user",
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'state', 'zipCode']
      }]
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    res.status(200).send(account);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Update KYC status
exports.updateKycStatus = async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    await Account.update(
      { kycVerified: req.body.kycVerified },
      { where: { id: req.params.id } }
    );

    res.status(200).send({ message: "KYC status updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Update account status (activate/deactivate)
exports.updateAccountStatus = async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    await Account.update(
      { isActive: req.body.isActive },
      { where: { id: req.params.id } }
    );

    res.status(200).send({ message: "Account status updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 