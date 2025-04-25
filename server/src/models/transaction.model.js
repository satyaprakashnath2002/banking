module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transaction", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    transactionType: {
      type: Sequelize.ENUM('deposit', 'withdrawal', 'transfer', 'fee'),
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: true
    },
    toAccount: {
      type: Sequelize.STRING,
      allowNull: true,
      // This is for transfers - can be null for other transaction types
    },
    fromAccount: {
      type: Sequelize.STRING,
      allowNull: true,
      // This is for transfers - can be null for other transaction types
    },
    balanceAfter: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'completed'
    },
    performedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // User ID of the person who performed this transaction (could be admin or customer)
    }
  });

  return Transaction;
}; 