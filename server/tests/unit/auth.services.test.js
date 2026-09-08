import { jest } from "@jest/globals";

const mockUserFindOne = jest.fn();
const mockUserFindById = jest.fn();
const mockUserCreate = jest.fn();
const mockUserSave = jest.fn();

const mockRefreshTokenCreate = jest.fn();
const mockRefreshTokenFindOneAndDelete = jest.fn();
const mockRefreshTokenDeleteMany = jest.fn();

const mockPasswordResetTokenCreate = jest.fn();
const mockPasswordResetTokenFindOne = jest.fn();
const mockPasswordResetTokenDeleteMany = jest.fn();

const mockSendPasswordResetEmail = jest.fn();

jest.unstable_mockModule("../../src/modules/auth/auth.model.js", () => ({
  default: {
    findOne: mockUserFindOne,
    findById: mockUserFindById,
    create: mockUserCreate,
  },
}));

jest.unstable_mockModule("../../src/models/refreshToken.model.js", () => ({
  default: {
    create: mockRefreshTokenCreate,
    findOneAndDelete: mockRefreshTokenFindOneAndDelete,
    deleteMany: mockRefreshTokenDeleteMany,
  },
}));

jest.unstable_mockModule(
  "../../src/modules/auth/passwordResetToken.model.js",
  () => ({
    default: {
      create: mockPasswordResetTokenCreate,
      findOne: mockPasswordResetTokenFindOne,
      deleteMany: mockPasswordResetTokenDeleteMany,
    },
  }),
);

jest.unstable_mockModule("../../src/common/utils/email.utils.js", () => ({
  sendPasswordResetEmail: mockSendPasswordResetEmail,
}));

const { hashPassword, comparePassword } =
  await import("../../src/common/utils/hash.utils.js");
const { signRefreshToken } =
  await import("../../src/common/utils/jwt.utils.js");
const { hashToken } = await import("../../src/common/utils/hash.utils.js");

const authServices = (await import("../../src/modules/auth/auth.services.js"))
  .default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("auth.services — security properties", () => {
  describe("password hashing round-trips correctly", () => {
    it("should hash a password and verify it matches the original", async () => {
      const plain = "SecurePass1";
      const hashed = await hashPassword(plain);

      expect(hashed).not.toBe(plain);

      const matches = await comparePassword(plain, hashed);
      expect(matches).toBe(true);
    });

    it("should reject a wrong password against a valid hash", async () => {
      const hashed = await hashPassword("SecurePass1");
      const matches = await comparePassword("WrongPass2", hashed);
      expect(matches).toBe(false);
    });
  });

  describe("login returns identical error for wrong password vs nonexistent email (Section 6.2)", () => {
    it("should throw 401 'Invalid credentials' when email does not exist", async () => {
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        authServices.login("nobody@test.com", "AnyPass1"),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid credentials",
      });
    });

    it("should throw 401 'Invalid credentials' when password is wrong", async () => {
      const hashedPw = await hashPassword("CorrectPass1");

      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "user123",
          email: "exists@test.com",
          passwordHash: hashedPw,
          toObject: function () {
            return { ...this };
          },
        }),
      });

      await expect(
        authServices.login("exists@test.com", "WrongPass2"),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid credentials",
      });
    });

    it("should return identical error messages for both cases", async () => {
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      let noEmailError;
      try {
        await authServices.login("nobody@test.com", "AnyPass1");
      } catch (e) {
        noEmailError = e;
      }

      const hashedPw = await hashPassword("CorrectPass1");
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "user123",
          passwordHash: hashedPw,
          toObject: function () {
            return { ...this };
          },
        }),
      });

      let wrongPwError;
      try {
        await authServices.login("exists@test.com", "WrongPass2");
      } catch (e) {
        wrongPwError = e;
      }

      expect(noEmailError.statusCode).toBe(wrongPwError.statusCode);
      expect(noEmailError.message).toBe(wrongPwError.message);
    });
  });

  describe("forgotPassword resolves identically regardless of email existence (Section 6.3)", () => {
    it("should resolve without error when email exists", async () => {
      mockUserFindOne.mockResolvedValue({ _id: "user123" });
      mockPasswordResetTokenCreate.mockResolvedValue({});
      mockSendPasswordResetEmail.mockResolvedValue();

      await expect(
        authServices.forgotPassword("exists@test.com"),
      ).resolves.toBeUndefined();
    });

    it("should resolve without error when email does NOT exist", async () => {
      mockUserFindOne.mockResolvedValue(null);

      await expect(
        authServices.forgotPassword("nobody@test.com"),
      ).resolves.toBeUndefined();
    });

    it("should not send email when user does not exist", async () => {
      mockUserFindOne.mockResolvedValue(null);

      await authServices.forgotPassword("nobody@test.com");

      expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe("refreshAccessToken deletes old token and issues new one (Section 6.4 rotation)", () => {
    it("should delete the old token record and create a new one", async () => {
      const fakeUserId = "user456";
      const oldRawToken = signRefreshToken({ id: fakeUserId });
      const oldHash = hashToken(oldRawToken);

      mockRefreshTokenFindOneAndDelete.mockResolvedValue({
        user: fakeUserId,
        tokenHash: oldHash,
      });

      mockRefreshTokenCreate.mockResolvedValue({});

      const result = await authServices.refreshAccessToken(oldRawToken);

      expect(mockRefreshTokenFindOneAndDelete).toHaveBeenCalledWith({
        user: fakeUserId,
        tokenHash: oldHash,
      });

      expect(mockRefreshTokenCreate).toHaveBeenCalledTimes(1);
      const createArg = mockRefreshTokenCreate.mock.calls[0][0];
      expect(createArg.user).toBe(fakeUserId);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw 401 when no refresh token is provided", async () => {
      await expect(authServices.refreshAccessToken(null)).rejects.toMatchObject(
        {
          statusCode: 401,
          message: "Refresh token required",
        },
      );
    });

    it("should throw 401 when token record does not exist in database", async () => {
      const fakeRawToken = signRefreshToken({ id: "user789" });
      mockRefreshTokenFindOneAndDelete.mockResolvedValue(null);

      await expect(
        authServices.refreshAccessToken(fakeRawToken),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid or expired refresh token",
      });
    });
  });
});
