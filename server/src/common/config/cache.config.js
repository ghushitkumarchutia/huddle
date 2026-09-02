const Redis = require('ioredis');
const { valkeyUrl } = require('./env.config');

const cacheClient = new Redis(valkeyUrl);

module.exports = cacheClient;
