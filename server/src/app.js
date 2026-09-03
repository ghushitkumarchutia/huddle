const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const corsOptions = require("./common/config/cors.config");
const {
  standardLimiter,
} = require("./common/middleware/rateLimiter.middleware");
const notFound = require("./common/middleware/notFound.middleware");
const errorHandler = require("./common/middleware/errorHandler.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(standardLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
