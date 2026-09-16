import { z } from "zod";

const createOrganizationSchema = {
  body: z.object({
    name: z.string().trim().min(1).max(100),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().max(500).optional(),
    type: z
      .enum([
        "university",
        "company",
        "club",
        "school",
        "hostel",
        "association",
        "community",
        "other",
      ])
      .optional(),
    joinPolicy: z.enum(["invite", "domain", "admin_approval"]).optional(),
  }),
};

const updateOrganizationSchema = {
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    type: z
      .enum([
        "university",
        "company",
        "club",
        "school",
        "hostel",
        "association",
        "community",
        "other",
      ])
      .optional(),
    joinPolicy: z.enum(["invite", "domain", "admin_approval"]).optional(),
    logoUrl: z.string().optional().nullable(),
  }),
};

export { createOrganizationSchema, updateOrganizationSchema };
