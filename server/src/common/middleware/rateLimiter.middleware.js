import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

const createRateLimiter = ({ windowMs, max }) => {
  return rateLimit({
    windowMs,
    max: isDev ? 1000 : max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      statusCode: 429,
      message: "Too many requests, please try again later.",
    },
  });
};

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const standardLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export { createRateLimiter, strictLimiter, standardLimiter };
