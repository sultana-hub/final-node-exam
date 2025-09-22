const rateLimit = require('express-rate-limit');


const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50, // Limit each IP to 5 requests per `window` (here, per 1 minutes).
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;