const { Server } = require("socket.io");
const socketAuthMiddleware = require("./socket.auth");
const { registerEngagementHandlers } = require("./engagement.socket");
const corsOptions = require("../common/config/cors.config");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerEngagementHandlers(io, socket);
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {
  initSocket,
  getIo,
};
