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

describe("Auth Routes — Full E2E Flow", () => {
  it("should complete signup → login → refresh → forgot → reset → login-with-new-password", async () => {
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
    expect(refreshRes.body.data.accessToken).toBeDefined();

    const forgotRes = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(forgotRes.statusCode).toBe(200);
    expect(mockSendPasswordResetEmail).toHaveBeenCalledTimes(1);

    const rawResetToken = mockSendPasswordResetEmail.mock.calls[0][1];

    const resetRes = await request(app).post("/api/auth/reset-password").send({
      token: rawResetToken,
      newPassword: "NewSecurePassword456",
    });

    expect(resetRes.statusCode).toBe(200);

    const newLoginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "NewSecurePassword456",
    });

    expect(newLoginRes.statusCode).toBe(200);
  });

  it("should reject signup with duplicate email", async () => {
    await request(app).post("/api/auth/signup").send({
      username: "user1",
      email: "dup@example.com",
      password: "SecurePassword123",
      displayName: "User 1",
    });

    const res = await request(app).post("/api/auth/signup").send({
      username: "user2",
      email: "dup@example.com",
      password: "SecurePassword123",
      displayName: "User 2",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should reject signup with duplicate username", async () => {
    await request(app).post("/api/auth/signup").send({
      username: "dupuser",
      email: "email1@example.com",
      password: "SecurePassword123",
      displayName: "User 1",
    });

    const res = await request(app).post("/api/auth/signup").send({
      username: "dupuser",
      email: "email2@example.com",
      password: "SecurePassword123",
      displayName: "User 2",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should reject login with wrong password", async () => {
    await request(app).post("/api/auth/signup").send({
      username: "user1",
      email: "user1@example.com",
      password: "SecurePassword123",
      displayName: "User 1",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "user1@example.com",
      password: "WrongPassword123",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should reject login with non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "SecurePassword123",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should reject protected routes without auth token", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .send({ displayName: "Hacked" });
    expect(res.statusCode).toBe(401);
  });

  it("should reject refresh with no cookie", async () => {
    const res = await request(app).post("/api/auth/refresh").send();
    expect(res.statusCode).toBe(401);
  });

  it("should not reveal whether email exists on forgot-password", async () => {
    const res1 = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" });

    const res2 = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" });

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  });

  it("should reject signup with missing required fields", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(400);
  });
});
