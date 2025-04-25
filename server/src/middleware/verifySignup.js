const db = require("../models");
const User = db.users;

checkDuplicateEmail = async (req, res, next) => {
  try {
    // Check for duplicate email
    const userWithEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userWithEmail) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate email!"
    });
  }
};

validateSignupFields = (req, res, next) => {
  // Check required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'address', 'city', 'state', 'zipCode'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({
      message: "Invalid email format!"
    });
  }

  // Validate password strength (at least 8 characters with letters and numbers)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).send({
      message: "Password must be at least 8 characters with both letters and numbers!"
    });
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  validateSignupFields
};

module.exports = verifySignUp; 