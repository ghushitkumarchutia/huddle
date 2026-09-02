require('dotenv').config();

const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'VALKEY_URL',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRY',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRY',
  'CLIENT_ORIGIN',
  'CLOUD_MEDIA_KEY',
  'CLOUD_MEDIA_SECRET',
  'CLOUD_MEDIA_BUCKET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  valkeyUrl: process.env.VALKEY_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  clientOrigin: process.env.CLIENT_ORIGIN,
  cloudMediaKey: process.env.CLOUD_MEDIA_KEY,
  cloudMediaSecret: process.env.CLOUD_MEDIA_SECRET,
  cloudMediaBucket: process.env.CLOUD_MEDIA_BUCKET,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  nodeEnv: process.env.NODE_ENV
};
