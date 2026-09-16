import mongoose from "mongoose";

const SpaceMembershipSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["space_admin", "moderator", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "removed"],
      default: "active",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

SpaceMembershipSchema.index({ space: 1, user: 1 }, { unique: true });
SpaceMembershipSchema.index({ user: 1, status: 1 });
SpaceMembershipSchema.index({ space: 1, status: 1 });
SpaceMembershipSchema.index({ space: 1, role: 1 });

export default mongoose.model("SpaceMembership", SpaceMembershipSchema);
