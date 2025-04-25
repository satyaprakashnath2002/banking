module.exports = {
  secret: process.env.JWT_SECRET || "banking-app-secret-key",
  // Token expiration time (in seconds)
  jwtExpiration: 3600, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours
}; 