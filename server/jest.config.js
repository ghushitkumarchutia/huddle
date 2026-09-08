export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: [],
  setupFiles: ["dotenv/config"],
  testTimeout: 15000,
};
