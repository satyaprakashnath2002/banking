const { authMiddleware } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get user profile
  app.get(
    "/api/user/profile",
    [authMiddleware.verifyToken],
    controller.getUserProfile
  );

  // Update user profile
  app.put(
    "/api/user/profile",
    [authMiddleware.verifyToken],
    controller.updateUserProfile
  );

  // Admin access to all users (excluding passwords)
  app.get(
    "/api/admin/users",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getAllUsers
  );

  // Admin access to specific user (excluding password)
  app.get(
    "/api/admin/users/:id",
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    controller.getUserById
  );
}; 