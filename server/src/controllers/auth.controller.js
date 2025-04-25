const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Account = db.accounts;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to generate a random account number
const generateAccountNumber = () => {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
};

// User signup
exports.signup = async (req, res) => {
  try {
    // Create user
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      role: req.body.role || "customer"
    });

    // If the role is customer, create a bank account
    if (user.role === "customer") {
      let accountNumber;
      let isUnique = false;
      
      // Make sure the account number is unique
      while (!isUnique) {
        accountNumber = generateAccountNumber();
        const existingAccount = await Account.findOne({
          where: { accountNumber: accountNumber }
        });
        if (!existingAccount) {
          isUnique = true;
        }
      }
      
      await Account.create({
        userId: user.id,
        accountNumber: accountNumber,
        accountType: "savings",
        balance: 0.00
      });
    }

    res.status(200).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// User signin
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password!"
      });
    }

    // Update last login
    await User.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.secret,
      {
        expiresIn: config.jwtExpiration
      }
    );

    // Return user info (excluding password) with token
    res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Verify user token
exports.verifyToken = async (req, res) => {
  try {
    // Authentication middleware has already verified the token
    // If we've reached here, the token is valid
    res.status(200).send({ 
      message: "Token is valid",
      valid: true 
    });
  } catch (error) {
    res.status(401).send({ 
      message: "Token verification failed",
      valid: false
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).send({ message: "Refresh token is required!" });
  }
  
  try {
    // Verify the refresh token (since we're using access token as refresh token)
    const decoded = jwt.verify(refreshToken, config.secret);
    
    // Get user from database
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    
    // Generate a new token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.secret,
      {
        expiresIn: config.jwtExpiration
      }
    );
    
    // Return new token
    res.status(200).send({
      token: token,
      newRefreshToken: token // Using the same token as refresh token
    });
  } catch (error) {
    return res.status(401).send({ message: "Invalid refresh token!" });
  }
}; 