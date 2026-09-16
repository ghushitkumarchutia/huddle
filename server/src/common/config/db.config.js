import mongoose from "mongoose";
import { mongoUri } from "./env.config.js";
import logger from "../utils/logger.utils.js";

const connectDB = async () => {
  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

export default connectDB;
