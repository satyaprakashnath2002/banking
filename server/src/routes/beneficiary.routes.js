const { authMiddleware } = require("../middleware");
const controller = require("../controllers/beneficiary.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get all beneficiaries
  app.get(
    "/api/customer/beneficiaries",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.getBeneficiaries
  );

  // Get beneficiary by ID
  app.get(
    "/api/customer/beneficiaries/:id",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.getBeneficiaryById
  );

  // Create a new beneficiary
  app.post(
    "/api/customer/beneficiaries",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.createBeneficiary
  );

  // Update a beneficiary
  app.put(
    "/api/customer/beneficiaries/:id",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.updateBeneficiary
  );

  // Delete a beneficiary (or mark as inactive)
  app.delete(
    "/api/customer/beneficiaries/:id",
    [authMiddleware.verifyToken, authMiddleware.isCustomer],
    controller.deleteBeneficiary
  );
}; 