import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
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
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["group", "space-wide"],
      default: "group",
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ space: 1, group: 1, createdAt: -1 });
PostSchema.index({ author: 1 });

export default mongoose.model("Post", PostSchema);
