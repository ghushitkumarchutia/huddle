const rateLimit = require('express-rate-limit');

const createRateLimiter = ({ windowMs, max }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5
});

const standardLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

module.exports = {
  createRateLimiter,
  strictLimiter,
  standardLimiter
};
