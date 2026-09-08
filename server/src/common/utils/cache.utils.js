import cacheClient from "../config/cache.config.js";
import logger from "./logger.utils.js";

const getOrSetCache = async (key, ttlSeconds, fetchFn) => {
  try {
    const cachedData = await cacheClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch {
    logger.warn("Cache read failed, falling back to database");
  }

  const freshData = await fetchFn();

  try {
    await cacheClient.set(key, JSON.stringify(freshData), "EX", ttlSeconds);
  } catch {
    logger.warn("Cache write failed");
  }

  return freshData;
};

const invalidateCache = async (key) => {
  try {
    await cacheClient.del(key);
  } catch {
    logger.warn("Cache invalidation failed");
  }
};

export { getOrSetCache, invalidateCache };
