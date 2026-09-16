import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "university",
        "company",
        "club",
        "school",
        "hostel",
        "association",
        "community",
        "other",
      ],
      default: "community",
    },
    logoUrl: {
      type: String,
      default: null,
    },
    joinPolicy: {
      type: String,
      enum: ["invite", "domain", "admin_approval"],
      default: "invite",
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

OrganizationSchema.index({ slug: 1 }, { unique: true });
OrganizationSchema.index({ createdBy: 1 });

export default mongoose.model("Organization", OrganizationSchema);
