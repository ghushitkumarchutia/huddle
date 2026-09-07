import http from "http";
import app from "./app.js";
import connectDB from "./common/config/db.config.js";
import { port } from "./common/config/env.config.js";
import logger from "./common/utils/logger.utils.js";
import cacheClient from "./common/config/cache.config.js";
import { initSocket } from "./sockets/socket.server.js";

const server = http.createServer(app);
const io = initSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    if (cacheClient.status !== "ready") {
      await new Promise((resolve, reject) => {
        cacheClient.once("ready", resolve);
        cacheClient.once("error", reject);
      });
    }

    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
