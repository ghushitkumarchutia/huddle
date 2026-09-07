import express from "express";
import multer from "multer";
import postController from "./post.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  validate(createPostSchema),
  postController.createPost,
);

router.patch(
  "/:postId",
  requireAuth,
  validate(updatePostSchema),
  postController.updatePost,
);

router.delete("/:postId", requireAuth, postController.deletePost);

export default router;
