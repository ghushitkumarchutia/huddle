import crypto from "crypto";

const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export { generateSecureToken };
