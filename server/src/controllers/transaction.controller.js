const db = require("../models");
const User = db.users;
const Account = db.accounts;
const Transaction = db.transactions;
const Beneficiary = db.beneficiaries;
const { Sequelize, sequelize } = db;

// Customer: Get all transactions for the logged-in customer
exports.getCustomerTransactions = async (req, res) => {
  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Get all transactions for this account
    const transactions = await Transaction.findAll({
      where: { accountId: account.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Customer: Transfer money to a beneficiary
exports.transferMoney = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId },
      transaction: t
    });

    if (!account) {
      await t.rollback();
      return res.status(404).send({ message: "Account not found." });
    }

    // Check if account is active and KYC verified
    if (!account.isActive) {
      await t.rollback();
      return res.status(403).send({ message: "Your account is inactive. Please contact support." });
    }

    if (!account.kycVerified) {
      await t.rollback();
      return res.status(403).send({ message: "Your KYC verification is pending. Transfers are not allowed." });
    }

    // Get the beneficiary
    const beneficiary = await Beneficiary.findOne({
      where: { 
        id: req.body.beneficiaryId,
        accountId: account.id,
        isActive: true
      },
      transaction: t
    });

    if (!beneficiary) {
      await t.rollback();
      return res.status(404).send({ message: "Beneficiary not found or inactive." });
    }

    // Check transfer amount
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(400).send({ message: "Invalid transfer amount." });
    }

    // Check if amount exceeds beneficiary transfer limit
    if (amount > beneficiary.transferLimit) {
      await t.rollback();
      return res.status(403).send({ 
        message: `Transfer amount exceeds beneficiary limit of ${beneficiary.transferLimit}.` 
      });
    }

    // Check sufficient balance
    if (account.balance < amount) {
      await t.rollback();
      return res.status(400).send({ message: "Insufficient balance." });
    }

    // Update account balance
    const newBalance = parseFloat(account.balance) - amount;
    await Account.update(
      { 
        balance: newBalance,
        lastActivity: new Date()
      },
      { 
        where: { id: account.id },
        transaction: t
      }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      accountId: account.id,
      transactionType: "transfer",
      amount: amount,
      description: req.body.description || `Transfer to ${beneficiary.name}`,
      reference: req.body.reference || `TRF-${Date.now()}`,
      toAccount: beneficiary.accountNumber,
      fromAccount: account.accountNumber,
      balanceAfter: newBalance,
      status: "completed",
      performedBy: req.userId
    }, { transaction: t });

    await t.commit();

    res.status(200).send({
      message: "Transfer completed successfully.",
      transaction: transaction
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{
        model: Account,
        as: "account",
        attributes: ['accountNumber'],
        include: [{
          model: User,
          as: "user",
          attributes: ['firstName', 'lastName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get transactions by account ID
exports.getTransactionsByAccount = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    
    // Verify account exists
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Get transactions
    const transactions = await Transaction.findAll({
      where: { accountId: accountId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Process a deposit
exports.deposit = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Get the account
    const account = await Account.findByPk(req.body.accountId, { transaction: t });
    if (!account) {
      await t.rollback();
      return res.status(404).send({ message: "Account not found." });
    }

    // Check if account is active
    if (!account.isActive) {
      await t.rollback();
      return res.status(403).send({ message: "Account is inactive." });
    }

    // Validate deposit amount
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(400).send({ message: "Invalid deposit amount." });
    }

    // Update account balance
    const newBalance = parseFloat(account.balance) + amount;
    await Account.update(
      { 
        balance: newBalance,
        lastActivity: new Date()
      },
      { 
        where: { id: account.id },
        transaction: t
      }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      accountId: account.id,
      transactionType: "deposit",
      amount: amount,
      description: req.body.description || "Deposit",
      reference: req.body.reference || `DEP-${Date.now()}`,
      balanceAfter: newBalance,
      status: "completed",
      performedBy: req.userId
    }, { transaction: t });

    await t.commit();

    res.status(200).send({
      message: "Deposit processed successfully.",
      transaction: transaction
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
};

// Admin: Process a withdrawal
exports.withdraw = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Get the account
    const account = await Account.findByPk(req.body.accountId, { transaction: t });
    if (!account) {
      await t.rollback();
      return res.status(404).send({ message: "Account not found." });
    }

    // Check if account is active and KYC verified
    if (!account.isActive) {
      await t.rollback();
      return res.status(403).send({ message: "Account is inactive." });
    }

    if (!account.kycVerified) {
      await t.rollback();
      return res.status(403).send({ message: "KYC verification pending. Withdrawals not allowed." });
    }

    // Validate withdrawal amount
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(400).send({ message: "Invalid withdrawal amount." });
    }

    // Check sufficient balance
    if (account.balance < amount) {
      await t.rollback();
      return res.status(400).send({ message: "Insufficient balance." });
    }

    // Update account balance
    const newBalance = parseFloat(account.balance) - amount;
    await Account.update(
      { 
        balance: newBalance,
        lastActivity: new Date()
      },
      { 
        where: { id: account.id },
        transaction: t
      }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      accountId: account.id,
      transactionType: "withdrawal",
      amount: amount,
      description: req.body.description || "Withdrawal",
      reference: req.body.reference || `WDR-${Date.now()}`,
      balanceAfter: newBalance,
      status: "completed",
      performedBy: req.userId
    }, { transaction: t });

    await t.commit();

    res.status(200).send({
      message: "Withdrawal processed successfully.",
      transaction: transaction
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
};

// Admin: Process a transfer
exports.adminTransfer = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Get source account
    const sourceAccount = await Account.findOne({
      where: { accountNumber: req.body.fromAccountNumber },
      transaction: t
    });

    if (!sourceAccount) {
      await t.rollback();
      return res.status(404).send({ message: "Source account not found." });
    }

    // Check if source account is active and KYC verified
    if (!sourceAccount.isActive) {
      await t.rollback();
      return res.status(403).send({ message: "Source account is inactive." });
    }

    if (!sourceAccount.kycVerified) {
      await t.rollback();
      return res.status(403).send({ message: "Source account KYC verification pending. Transfers not allowed." });
    }

    // Get destination account
    const destinationAccount = await Account.findOne({
      where: { accountNumber: req.body.toAccountNumber },
      transaction: t
    });

    if (!destinationAccount) {
      await t.rollback();
      return res.status(404).send({ message: "Destination account not found." });
    }

    // Check if destination account is active
    if (!destinationAccount.isActive) {
      await t.rollback();
      return res.status(403).send({ message: "Destination account is inactive." });
    }

    // Validate transfer amount
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(400).send({ message: "Invalid transfer amount." });
    }

    // Check sufficient balance
    if (sourceAccount.balance < amount) {
      await t.rollback();
      return res.status(400).send({ message: "Insufficient balance in source account." });
    }

    // Update source account balance
    const newSourceBalance = parseFloat(sourceAccount.balance) - amount;
    await Account.update(
      { 
        balance: newSourceBalance,
        lastActivity: new Date()
      },
      { 
        where: { id: sourceAccount.id },
        transaction: t
      }
    );

    // Update destination account balance
    const newDestBalance = parseFloat(destinationAccount.balance) + amount;
    await Account.update(
      { 
        balance: newDestBalance,
        lastActivity: new Date()
      },
      { 
        where: { id: destinationAccount.id },
        transaction: t
      }
    );

    // Create transaction records for both accounts
    const sourceTransaction = await Transaction.create({
      accountId: sourceAccount.id,
      transactionType: "transfer",
      amount: amount,
      description: req.body.description || "Transfer out",
      reference: req.body.reference || `TRF-${Date.now()}`,
      toAccount: destinationAccount.accountNumber,
      fromAccount: sourceAccount.accountNumber,
      balanceAfter: newSourceBalance,
      status: "completed",
      performedBy: req.userId
    }, { transaction: t });

    const destTransaction = await Transaction.create({
      accountId: destinationAccount.id,
      transactionType: "transfer",
      amount: amount,
      description: req.body.description || "Transfer in",
      reference: req.body.reference || `TRF-${Date.now()}`,
      toAccount: destinationAccount.accountNumber,
      fromAccount: sourceAccount.accountNumber,
      balanceAfter: newDestBalance,
      status: "completed",
      performedBy: req.userId
    }, { transaction: t });

    await t.commit();

    res.status(200).send({
      message: "Transfer processed successfully.",
      sourceTransaction: sourceTransaction,
      destinationTransaction: destTransaction
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
};

// Customer: Get transaction service status
exports.getServiceStatus = async (req, res) => {
  try {
    // Check database connection 
    await sequelize.authenticate();
    
    // Check if we can access the transactions table
    await Transaction.findOne();
    
    res.status(200).send({ 
      status: 'up',
      message: 'Transaction service is operating normally'
    });
  } catch (error) {
    console.error('Transaction service health check failed:', error);
    res.status(500).send({ 
      status: 'down',
      message: 'Transaction service is currently experiencing issues',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 