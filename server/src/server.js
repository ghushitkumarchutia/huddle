const http = require("http");
const app = require("./app");
const connectDB = require("./common/config/db.config");
const { port } = require("./common/config/env.config");
const logger = require("./common/utils/logger.utils");
const cacheClient = require("./common/config/cache.config");
const { initSocket } = require("./sockets/socket.server");

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
