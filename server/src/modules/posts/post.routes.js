const express = require("express");
const multer = require("multer");
const postController = require("./post.controller");
const requireAuth = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate.middleware");
const { createPostSchema, updatePostSchema } = require("./post.validation");

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

module.exports = router;
