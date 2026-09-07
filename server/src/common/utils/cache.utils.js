import cacheClient from "../config/cache.config.js";

const getOrSetCache = async (key, ttlSeconds, fetchFn) => {
  const cachedData = await cacheClient.get(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const freshData = await fetchFn();
  await cacheClient.set(key, JSON.stringify(freshData), "EX", ttlSeconds);

  return freshData;
};

const invalidateCache = async (key) => {
  await cacheClient.del(key);
};

export { getOrSetCache, invalidateCache };
