const express = require("express");
const cors = require("cors");
const db = require("./models");

// Create Express app
const app = express();

// Setup CORS
var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Sync database
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
}).catch((err) => {
  console.log("Failed to sync database: " + err.message);
});

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Banking Application API." });
});

// Import and use routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/account.routes")(app);
require("./routes/transaction.routes")(app);
require("./routes/beneficiary.routes")(app);

// Set port and start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}); 