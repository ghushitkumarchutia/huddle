import { jest } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";

jest.unstable_mockModule("../../src/common/utils/cache.utils.js", () => ({
  getOrSetCache: jest.fn(async (key, ttl, fetchFn) => await fetchFn()),
  invalidateCache: jest.fn().mockResolvedValue(),
}));

jest.unstable_mockModule("../../src/common/utils/email.utils.js", () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
}));

jest.unstable_mockModule("../../src/sockets/socket.server.js", () => ({
  getIo: jest.fn().mockReturnValue({}),
}));

jest.unstable_mockModule("../../src/sockets/engagement.socket.js", () => ({
  emitLikeCountUpdate: jest.fn(),
  emitCommentCountUpdate: jest.fn(),
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

const signup = async (username, email) => {
  const res = await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      email,
      password: "SecurePassword1",
      displayName: `User ${username}`,
    });
  return res.body.data;
};

const login = async (email) => {
  const res = await request(app).post("/api/auth/login").send({
    email,
    password: "SecurePassword1",
  });
  return res.body.data.accessToken;
};

describe("Organization → Space → Group → Post → Feed E2E Flow", () => {
  it("should deliver a post to a follower's feed through the full hierarchy", async () => {
    const author = await signup("author1", "author1@test.com");
    const follower = await signup("follower1", "follower1@test.com");

    const authorToken = await login("author1@test.com");
    const followerToken = await login("follower1@test.com");

    const orgRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        name: "Test Org",
        slug: "test-org",
        type: "company",
      });

    expect(orgRes.statusCode).toBe(201);
    const orgId = orgRes.body.data._id;

    const spaceRes = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Dev Space", description: "Testing" });

    expect(spaceRes.statusCode).toBe(201);
    const spaceId = spaceRes.body.data._id;
    const inviteCode = spaceRes.body.data.inviteCode;

    const addOrgMemRes = await request(app)
      .post(`/api/org-memberships/${orgId}/members`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ userId: follower._id });

    expect(addOrgMemRes.statusCode).toBe(201);

    const joinRes = await request(app)
      .post("/api/space-memberships/join")
      .set("Authorization", `Bearer ${followerToken}`)
      .send({ inviteCode });

    expect(joinRes.statusCode).toBe(200);

    const groupRes = await request(app)
      .post(`/api/groups/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General" });

    expect(groupRes.statusCode).toBe(201);
    const groupId = groupRes.body.data._id;

    await request(app)
      .post(`/api/follows/${spaceId}/${author._id}`)
      .set("Authorization", `Bearer ${followerToken}`);

    const postRes = await request(app)
      .post(`/api/posts/space/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        content: "Hello world, fan-out test!",
        groupId,
      });

    expect(postRes.statusCode).toBe(201);
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
    expect(foundPost.content).toBe("Hello world, fan-out test!");
  });

  it("should allow like and unlike on a post", async () => {
    const author = await signup("liker1", "liker1@test.com");
    const authorToken = await login("liker1@test.com");

    const orgRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Like Org", slug: "like-org" });

    const orgId = orgRes.body.data._id;

    const spaceRes = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Like Space", description: "Test" });

    const spaceId = spaceRes.body.data._id;

    const groupRes = await request(app)
      .post(`/api/groups/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General" });

    const groupId = groupRes.body.data._id;

    const postRes = await request(app)
      .post(`/api/posts/space/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Likeable post", groupId });

    const postId = postRes.body.data._id;

    const likeRes = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(likeRes.statusCode).toBe(200);

    const dupLikeRes = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(dupLikeRes.statusCode).toBe(400);

    const unlikeRes = await request(app)
      .delete(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(unlikeRes.statusCode).toBe(200);

    const dupUnlikeRes = await request(app)
      .delete(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(dupUnlikeRes.statusCode).toBe(404);
  });

  it("should allow comment and delete comment on a post", async () => {
    const author = await signup("commenter1", "commenter1@test.com");
    const authorToken = await login("commenter1@test.com");

    const orgRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Comment Org", slug: "comment-org" });

    const orgId = orgRes.body.data._id;

    const spaceRes = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Comment Space", description: "Test" });

    const spaceId = spaceRes.body.data._id;

    const groupRes = await request(app)
      .post(`/api/groups/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General" });

    const groupId = groupRes.body.data._id;

    const postRes = await request(app)
      .post(`/api/posts/space/${spaceId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Commentable post", groupId });

    const postId = postRes.body.data._id;

    const commentRes = await request(app)
      .post(`/api/comments/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Great post!" });

    expect(commentRes.statusCode).toBe(201);
    const commentId = commentRes.body.data._id;

    const listRes = await request(app)
      .get(`/api/comments/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data.length).toBe(1);

    const deleteRes = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(deleteRes.statusCode).toBe(200);
  });

  it("should block post creation with a group from a different space (cross-space validation)", async () => {
    const author = await signup("xspace1", "xspace1@test.com");
    const authorToken = await login("xspace1@test.com");

    const orgRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "XSpace Org", slug: "xspace-org" });

    const orgId = orgRes.body.data._id;

    const space1Res = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Space 1", description: "Test" });

    const space2Res = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "Space 2", description: "Test" });

    const spaceId1 = space1Res.body.data._id;
    const spaceId2 = space2Res.body.data._id;

    const groupRes = await request(app)
      .post(`/api/groups/${spaceId1}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General" });

    const groupIdFromSpace1 = groupRes.body.data._id;

    await request(app)
      .post(`/api/groups/${spaceId2}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ name: "General2" });

    const postRes = await request(app)
      .post(`/api/posts/space/${spaceId2}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        content: "Cross-space exploit attempt",
        groupId: groupIdFromSpace1,
      });

    expect(postRes.statusCode).toBe(400);
  });

  it("should properly handle follow/unfollow self prevention", async () => {
    const user = await signup("selffollow", "selffollow@test.com");
    const token = await login("selffollow@test.com");

    const orgRes = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Self Org", slug: "self-org" });

    const orgId = orgRes.body.data._id;

    const spaceRes = await request(app)
      .post(`/api/spaces/org/${orgId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Self Space", description: "Test" });

    const spaceId = spaceRes.body.data._id;

    const followRes = await request(app)
      .post(`/api/follows/${spaceId}/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(followRes.statusCode).toBe(400);
  });
});
