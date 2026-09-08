import { jest } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";

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

describe("Feed Routes - Integration (Fan-out-on-write flow)", () => {
  it("should deliver a new post into a follower's feed", async () => {
    const authorRes = await request(app).post("/api/auth/signup").send({
      username: "author1",
      email: "author1@test.com",
      password: "SecurePassword1",
      displayName: "Author User",
    });
    const authorId = authorRes.body.data._id;

    await request(app).post("/api/auth/signup").send({
      username: "follower1",
      email: "follower1@test.com",
      password: "SecurePassword1",
      displayName: "Follower User",
    });

    const loginAuthor = await request(app).post("/api/auth/login").send({
      email: "author1@test.com",
      password: "SecurePassword1",
    });
    const authorToken = loginAuthor.body.data.accessToken;

    const loginFollower = await request(app).post("/api/auth/login").send({
      email: "follower1@test.com",
      password: "SecurePassword1",
    });
    const followerToken = loginFollower.body.data.accessToken;

    const spaceRes = await request(app)
      .post("/api/spaces")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Dev Space", description: "Testing space" });
    const spaceId = spaceRes.body.data._id;
    const inviteCode = spaceRes.body.data.inviteCode;

    await request(app)
      .post("/api/spaces/join")
      .set("Authorization", `Bearer ${followerToken}`)
      .send({ inviteCode });

    const groupRes = await request(app)
      .post(`/api/groups/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General" });
    const groupId = groupRes.body.data._id;

    await request(app)
      .post(`/api/follows/${spaceId}/${authorId}`)
      .set("Authorization", `Bearer ${followerToken}`);

    const postRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        content: "Hello world, this is a fan-out test!",
        spaceId,
        groupId,
      });
    const postId = postRes.body.data._id;

    const feedRes = await request(app)
      .get("/api/feed")
      .set("Authorization", `Bearer ${followerToken}`);

    expect(feedRes.statusCode).toBe(200);
    expect(feedRes.body.success).toBe(true);

    const feedPosts = feedRes.body.data.posts;
    expect(feedPosts).toBeInstanceOf(Array);
    expect(feedPosts.length).toBeGreaterThan(0);

    const foundPost = feedPosts.find((p) => p._id === postId);
    expect(foundPost).toBeDefined();
    expect(foundPost.content).toBe("Hello world, this is a fan-out test!");
    expect(foundPost.authorSnapshot.username).toBe("author1");
  });
});
