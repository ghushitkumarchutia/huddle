import OrgMembership from "../../modules/organizationMemberships/orgMembership.model.js";
import SpaceMembership from "../../modules/spaceMemberships/spaceMembership.model.js";
import Space from "../../modules/spaces/space.model.js";
import {
  hasOrgPermission,
  hasSpacePermission,
} from "../config/permissions.config.js";
import ApiError from "../utils/apiError.js";

const requireOrgMembership = (orgIdParam = "organizationId") => {
  return async (req, res, next) => {
    try {
      const organizationId = req.params[orgIdParam];
      if (!organizationId) {
        return next(new ApiError(400, "Organization ID is required"));
      }

      const membership = await OrgMembership.findOne({
        organization: organizationId,
        user: req.user.id,
        status: "active",
      });

      if (!membership) {
        return next(
          new ApiError(403, "Active organization membership required"),
        );
      }

      req.orgMembership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireOrgRole = (...roles) => {
  return (req, res, next) => {
    if (!req.orgMembership) {
      return next(new ApiError(403, "Organization membership not resolved"));
    }

    if (!roles.includes(req.orgMembership.role)) {
      return next(new ApiError(403, "Insufficient organization permissions"));
    }

    next();
  };
};

const requireOrgPermission = (permission) => {
  return (req, res, next) => {
    if (!req.orgMembership) {
      return next(new ApiError(403, "Organization membership not resolved"));
    }

    if (!hasOrgPermission(req.orgMembership.role, permission)) {
      return next(new ApiError(403, "Insufficient organization permissions"));
    }

    next();
  };
};

const requireSpaceMembership = (spaceIdParam = "spaceId") => {
  return async (req, res, next) => {
    try {
      const spaceId = req.params[spaceIdParam];
      if (!spaceId) {
        return next(new ApiError(400, "Space ID is required"));
      }

      const space = await Space.findById(spaceId);
      if (!space) {
        return next(new ApiError(404, "Space not found"));
      }

      const orgMembership = await OrgMembership.findOne({
        organization: space.organization,
        user: req.user.id,
        status: "active",
      });

      if (!orgMembership) {
        return next(
          new ApiError(403, "Active organization membership required"),
        );
      }

      req.orgMembership = orgMembership;

      const spaceMembership = await SpaceMembership.findOne({
        space: spaceId,
        user: req.user.id,
        status: "active",
      });

      if (!spaceMembership) {
        return next(new ApiError(403, "Active space membership required"));
      }

      req.spaceMembership = spaceMembership;
      req.space = space;
      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireSpaceRole = (...roles) => {
  return (req, res, next) => {
    if (!req.spaceMembership) {
      return next(new ApiError(403, "Space membership not resolved"));
    }

    if (!roles.includes(req.spaceMembership.role)) {
      return next(new ApiError(403, "Insufficient space permissions"));
    }

    next();
  };
};

const requireSpacePermission = (permission) => {
  return (req, res, next) => {
    if (!req.spaceMembership) {
      return next(new ApiError(403, "Space membership not resolved"));
    }

    if (!hasSpacePermission(req.spaceMembership.role, permission)) {
      return next(new ApiError(403, "Insufficient space permissions"));
    }

    next();
  };
};

export {
  requireOrgMembership,
  requireOrgRole,
  requireOrgPermission,
  requireSpaceMembership,
  requireSpaceRole,
  requireSpacePermission,
};
