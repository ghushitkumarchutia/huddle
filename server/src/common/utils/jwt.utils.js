const jwt = require('jsonwebtoken');
const { 
  jwtAccessSecret, 
  jwtAccessExpiry, 
  jwtRefreshSecret, 
  jwtRefreshExpiry 
} = require('../config/env.config');

const signAccessToken = (payload) => {
  return jwt.sign(payload, jwtAccessSecret, { expiresIn: jwtAccessExpiry });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtAccessSecret);
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: jwtRefreshExpiry });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtRefreshSecret);
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
};
