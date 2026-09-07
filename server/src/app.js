import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import corsOptions from "./common/config/cors.config.js";
import { standardLimiter } from "./common/middleware/rateLimiter.middleware.js";
import notFound from "./common/middleware/notFound.middleware.js";
import errorHandler from "./common/middleware/errorHandler.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import spaceRoutes from "./modules/spaces/space.routes.js";
import groupRoutes from "./modules/groups/group.routes.js";
import followRoutes from "./modules/follows/follow.routes.js";
import postRoutes from "./modules/posts/post.routes.js";
import feedRoutes from "./modules/feed/feed.routes.js";
import likeRoutes from "./modules/likes/like.routes.js";
import commentRoutes from "./modules/comments/comment.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import digestRoutes from "./modules/digest/digest.routes.js";

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
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/digest", digestRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
