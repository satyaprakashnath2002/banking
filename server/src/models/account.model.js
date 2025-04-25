module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    accountNumber: {
      type: Sequelize.STRING(16),
      allowNull: false,
      unique: true
    },
    accountType: {
      type: Sequelize.ENUM('savings', 'checking', 'fixed_deposit'),
      allowNull: false,
      defaultValue: 'savings'
    },
    balance: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    kycVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    dateOpened: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    lastActivity: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Account;
}; 