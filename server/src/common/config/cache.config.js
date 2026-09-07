import Redis from "ioredis";
import { valkeyUrl } from "./env.config.js";

const cacheClient = new Redis(valkeyUrl);

export default cacheClient;
