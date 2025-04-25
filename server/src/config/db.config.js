require('dotenv').config();

module.exports = {
  // Use SQLite storage instead of MySQL
  dialect: "sqlite",
  storage: "./database.sqlite", // SQLite database file
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}; 