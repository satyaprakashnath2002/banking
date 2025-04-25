const db = require("../models");
const Beneficiary = db.beneficiaries;
const Account = db.accounts;

// Get all beneficiaries for the logged-in customer
exports.getBeneficiaries = async (req, res) => {
  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Get all beneficiaries for this account
    const beneficiaries = await Beneficiary.findAll({
      where: { accountId: account.id }
    });

    res.status(200).send(beneficiaries);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a specific beneficiary by ID
exports.getBeneficiaryById = async (req, res) => {
  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Get the beneficiary and ensure it belongs to this customer
    const beneficiary = await Beneficiary.findOne({
      where: {
        id: req.params.id,
        accountId: account.id
      }
    });

    if (!beneficiary) {
      return res.status(404).send({ message: "Beneficiary not found." });
    }

    res.status(200).send(beneficiary);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new beneficiary
exports.createBeneficiary = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.accountNumber || !req.body.bankName) {
      return res.status(400).send({ message: "Name, account number, and bank name are required fields." });
    }

    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Create the beneficiary
    const beneficiary = await Beneficiary.create({
      accountId: account.id,
      name: req.body.name,
      accountNumber: req.body.accountNumber,
      bankName: req.body.bankName,
      transferLimit: req.body.transferLimit || 10000.00,
      nickname: req.body.nickname || null
    });

    res.status(201).send({
      message: "Beneficiary added successfully.",
      beneficiary: beneficiary
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a beneficiary
exports.updateBeneficiary = async (req, res) => {
  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Find the beneficiary and ensure it belongs to this customer
    const beneficiary = await Beneficiary.findOne({
      where: {
        id: req.params.id,
        accountId: account.id
      }
    });

    if (!beneficiary) {
      return res.status(404).send({ message: "Beneficiary not found." });
    }

    // Check which fields can be updated
    const updateData = {};
    const allowedFields = ['name', 'bankName', 'transferLimit', 'nickname', 'isActive'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({ message: "No valid fields to update" });
    }

    // Update the beneficiary
    const result = await Beneficiary.update(updateData, {
      where: { id: req.params.id }
    });

    if (result[0] === 0) {
      return res.status(404).send({ message: "Beneficiary not found or no changes made." });
    }

    res.status(200).send({ message: "Beneficiary updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a beneficiary (or mark as inactive)
exports.deleteBeneficiary = async (req, res) => {
  try {
    // Get customer's account
    const account = await Account.findOne({
      where: { userId: req.userId }
    });

    if (!account) {
      return res.status(404).send({ message: "Account not found." });
    }

    // Find the beneficiary and ensure it belongs to this customer
    const beneficiary = await Beneficiary.findOne({
      where: {
        id: req.params.id,
        accountId: account.id
      }
    });

    if (!beneficiary) {
      return res.status(404).send({ message: "Beneficiary not found." });
    }

    // Instead of deleting, mark as inactive
    await Beneficiary.update(
      { isActive: false },
      { where: { id: req.params.id } }
    );

    res.status(200).send({ message: "Beneficiary deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 