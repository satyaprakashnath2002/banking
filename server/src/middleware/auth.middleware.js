const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  // Remove Bearer prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

isCustomer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === "customer") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Customer Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isCustomer
};

module.exports = authMiddleware; 