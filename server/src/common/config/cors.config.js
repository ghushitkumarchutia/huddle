const { clientOrigin } = require('./env.config');

const corsOptions = {
  origin: clientOrigin,
  credentials: true
};

module.exports = corsOptions;
