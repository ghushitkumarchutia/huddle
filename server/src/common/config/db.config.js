const mongoose = require('mongoose');
const { mongoUri } = require('./env.config');

const connectDB = async () => {
  mongoose.connection.on('error', (err) => {
    console.error(err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

module.exports = connectDB;
