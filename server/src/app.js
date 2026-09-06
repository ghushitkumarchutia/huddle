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
const spaceRoutes = require("./modules/spaces/space.routes");
const groupRoutes = require("./modules/groups/group.routes");
const followRoutes = require("./modules/follows/follow.routes");
const postRoutes = require("./modules/posts/post.routes");
const feedRoutes = require("./modules/feed/feed.routes");
const likeRoutes = require("./modules/likes/like.routes");

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(standardLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/likes", likeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
