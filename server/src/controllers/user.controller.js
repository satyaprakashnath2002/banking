const db = require("../models");
const User = db.users;
const Account = db.accounts;
const bcrypt = require("bcryptjs");

// Get current user's profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Account,
        as: "account",
        attributes: ['accountNumber', 'accountType', 'balance', 'isActive', 'kycVerified']
      }]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    // Check which fields can be updated
    const updateData = {};
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'city', 'state', 'zipCode'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({ message: "No valid fields to update" });
    }

    // Handle password update separately with hashing
    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 8);
    }

    // Update the user
    const result = await User.update(updateData, {
      where: { id: req.userId }
    });

    if (result[0] === 0) {
      return res.status(404).send({ message: "User not found or no changes made." });
    }

    res.status(200).send({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: Account,
        as: "account",
        attributes: ['accountNumber', 'accountType', 'balance', 'isActive', 'kycVerified']
      }],
      where: { role: "customer" } // Only return customers
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin: Get user by ID (excluding password)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Account,
        as: "account",
        attributes: ['accountNumber', 'accountType', 'balance', 'isActive', 'kycVerified']
      }]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 