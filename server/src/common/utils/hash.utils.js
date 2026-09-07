import bcrypt from "bcrypt";
import crypto from "crypto";

const hashPassword = async (plain) => {
  return bcrypt.hash(plain, 12);
};

const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

const hashToken = (rawToken) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

export { hashPassword, comparePassword, hashToken };
