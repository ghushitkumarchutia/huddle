import mongoose from "mongoose";

const SpaceSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

SpaceSchema.index({ organization: 1, createdAt: -1 });

export default mongoose.model("Space", SpaceSchema);
