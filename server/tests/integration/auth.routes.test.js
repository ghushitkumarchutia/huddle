import { jest } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";

const mockSendPasswordResetEmail = jest.fn().mockResolvedValue();

jest.unstable_mockModule("../../src/common/utils/email.utils.js", () => ({
  sendPasswordResetEmail: mockSendPasswordResetEmail,
}));

jest.unstable_mockModule("../../src/common/utils/cache.utils.js", () => ({
  getOrSetCache: jest.fn(async (key, ttl, fetchFn) => await fetchFn()),
  invalidateCache: jest.fn().mockResolvedValue(),
}));

const app = (await import("../../src/app.js")).default;
const User = (await import("../../src/modules/users/user.model.js")).default;
const PasswordResetToken = (
  await import("../../src/modules/auth/passwordResetToken.model.js")
).default;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/huddle_test",
    );
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
});

describe("Auth Routes - Integration (E2E Flow)", () => {
  it("should complete the full signup, login, refresh, and reset password flow", async () => {
    const signupRes = await request(app).post("/api/auth/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePassword123",
      displayName: "Test User",
    });

    expect(signupRes.statusCode).toBe(201);
    expect(signupRes.body.success).toBe(true);
    expect(signupRes.body.data.username).toBe("testuser");
    expect(signupRes.body.data.passwordHash).toBeUndefined();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "SecurePassword123",
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.accessToken).toBeDefined();

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshTokenCookie = cookies.find((c) =>
      c.startsWith("refreshToken="),
    );
    expect(refreshTokenCookie).toBeDefined();

    const cookieValue = refreshTokenCookie.split(";")[0];

    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookieValue)
      .send();

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.accessToken).toBeDefined();

    const forgotRes = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(forgotRes.statusCode).toBe(200);
    expect(forgotRes.body.success).toBe(true);

    expect(mockSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    const rawResetToken = mockSendPasswordResetEmail.mock.calls[0][1];
    expect(rawResetToken).toBeDefined();

    const resetRes = await request(app).post("/api/auth/reset-password").send({
      token: rawResetToken,
      newPassword: "NewSecurePassword456",
    });

    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.success).toBe(true);

    const newLoginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "NewSecurePassword456",
    });

    expect(newLoginRes.statusCode).toBe(200);
    expect(newLoginRes.body.success).toBe(true);
  });
});
