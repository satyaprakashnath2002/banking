const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Registration route
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.validateSignupFields
    ],
    controller.signup
  );

  // Login route
  app.post("/api/auth/signin", controller.signin);
  
  // Refresh token route
  app.post("/api/auth/refresh-token", controller.refreshToken);
  
  // Verify token route
  app.get(
    "/api/auth/verify-token",
    [authMiddleware.verifyToken],
    controller.verifyToken
  );
}; 