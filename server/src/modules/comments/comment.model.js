const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorSnapshot: {
      type: Object,
      required: true,
      validate: {
        validator: function (v) {
          return (
            v &&
            typeof v.displayName === "string" &&
            typeof v.username === "string"
          );
        },
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

CommentSchema.index({ post: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", CommentSchema);
