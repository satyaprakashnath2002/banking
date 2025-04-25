const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require("./user.model.js")(sequelize, Sequelize);
db.accounts = require("./account.model.js")(sequelize, Sequelize);
db.transactions = require("./transaction.model.js")(sequelize, Sequelize);
db.beneficiaries = require("./beneficiary.model.js")(sequelize, Sequelize);

// Define relationships
db.users.hasOne(db.accounts, {
  foreignKey: "userId",
  as: "account"
});
db.accounts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user"
});

db.accounts.hasMany(db.transactions, {
  foreignKey: "accountId",
  as: "transactions"
});
db.transactions.belongsTo(db.accounts, {
  foreignKey: "accountId",
  as: "account"
});

db.accounts.hasMany(db.beneficiaries, {
  foreignKey: "accountId",
  as: "beneficiaries"
});
db.beneficiaries.belongsTo(db.accounts, {
  foreignKey: "accountId",
  as: "account"
});

module.exports = db; 