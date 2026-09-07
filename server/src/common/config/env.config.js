import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "MONGODB_URI",
  "VALKEY_URL",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_EXPIRY",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRY",
  "CLIENT_ORIGIN",
  "CLOUD_MEDIA_KEY",
  "CLOUD_MEDIA_SECRET",
  "CLOUD_MEDIA_BUCKET",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "NODE_ENV",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const port = process.env.PORT;
export const mongoUri = process.env.MONGODB_URI;
export const valkeyUrl = process.env.VALKEY_URL;
export const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
export const jwtAccessExpiry = process.env.JWT_ACCESS_EXPIRY;
export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
export const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY;
export const clientOrigin = process.env.CLIENT_ORIGIN;
export const cloudMediaKey = process.env.CLOUD_MEDIA_KEY;
export const cloudMediaSecret = process.env.CLOUD_MEDIA_SECRET;
export const cloudMediaBucket = process.env.CLOUD_MEDIA_BUCKET;
export const emailHost = process.env.EMAIL_HOST;
export const emailPort = process.env.EMAIL_PORT;
export const emailUser = process.env.EMAIL_USER;
export const emailPass = process.env.EMAIL_PASS;
export const nodeEnv = process.env.NODE_ENV;
