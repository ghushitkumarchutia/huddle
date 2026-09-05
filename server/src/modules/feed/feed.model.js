const mongoose = require("mongoose");

const FeedItemSchema = new mongoose.Schema(
  {
    feedOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

FeedItemSchema.index({ feedOwner: 1, createdAt: -1 });

module.exports = mongoose.model("FeedItem", FeedItemSchema);
