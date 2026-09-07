import mongoose from "mongoose";
import { mongoUri } from "./env.config.js";

const connectDB = async () => {
  mongoose.connection.on("error", (err) => {
    console.error(err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

export default connectDB;
