const { Server } = require("socket.io");
const socketAuthMiddleware = require("./socket.auth");
const { registerEngagementHandlers } = require("./engagement.socket");
const corsOptions = require("../common/config/cors.config");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerEngagementHandlers(io, socket);
  });

  return io;
};

module.exports = {
  initSocket,
};
