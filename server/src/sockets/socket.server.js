import { Server } from "socket.io";
import socketAuthMiddleware from "./socket.auth.js";
import { registerEngagementHandlers } from "./engagement.socket.js";
import corsOptions from "../common/config/cors.config.js";

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

export { initSocket, getIo };
