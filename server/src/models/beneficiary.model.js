module.exports = (sequelize, Sequelize) => {
  const Beneficiary = sequelize.define("beneficiary", {
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
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    accountNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bankName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    transferLimit: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 10000.00
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return Beneficiary;
}; 