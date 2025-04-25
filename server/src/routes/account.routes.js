const { authMiddleware } = require("../middleware");
const controller = require("../controllers/account.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Customer routes
  app.get(
    "/api/customer/account",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.getAccountDetails
  );

  // Admin routes
  app.post(
    "/api/admin/accounts",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.createAccount
  );

  app.get(
    "/api/admin/accounts",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getAllAccounts
  );

  app.get(
    "/api/admin/accounts/:id",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getAccountById
  );

  app.put(
    "/api/admin/accounts/:id/kyc",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.updateKycStatus
  );

  app.put(
    "/api/admin/accounts/:id/status",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.updateAccountStatus
  );
}; 