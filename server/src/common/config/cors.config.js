import { clientOrigin } from "./env.config.js";

const corsOptions = {
  origin: clientOrigin,
  credentials: true,
};

export default corsOptions;
