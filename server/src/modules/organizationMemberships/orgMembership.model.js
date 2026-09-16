import mongoose from "mongoose";

const OrgMembershipSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "member"],
      default: "member",
    },
    type: {
      type: String,
      enum: [
        "student",
        "faculty",
        "staff",
        "employee",
        "manager",
        "authority",
        "alumni",
        "member",
      ],
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

OrgMembershipSchema.index({ organization: 1, user: 1 }, { unique: true });
OrgMembershipSchema.index({ user: 1, status: 1 });
OrgMembershipSchema.index({ organization: 1, status: 1 });
OrgMembershipSchema.index({ organization: 1, role: 1 });

export default mongoose.model("OrgMembership", OrgMembershipSchema);
