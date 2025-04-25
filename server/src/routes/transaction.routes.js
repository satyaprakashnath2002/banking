const { authMiddleware } = require("../middleware");
const controller = require("../controllers/transaction.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Public route for service status check
  app.get(
    "/api/customer/transactions/status",
    controller.getServiceStatus
  );

  // Customer routes
  app.get(
    "/api/customer/transactions",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.getCustomerTransactions
  );

  app.post(
    "/api/customer/transactions/transfer",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.transferMoney
  );

  // Admin routes
  app.get(
    "/api/admin/transactions",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getAllTransactions
  );

  app.get(
    "/api/admin/transactions/account/:accountId",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getTransactionsByAccount
  );

  app.post(
    "/api/admin/transactions/deposit",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.deposit
  );

  app.post(
    "/api/admin/transactions/withdraw",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.withdraw
  );

  app.post(
    "/api/admin/transactions/transfer",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.adminTransfer
  );
}; 