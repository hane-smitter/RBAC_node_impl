import { Router } from "express";

import { RoleController } from "../controllers/role.controller";
import {
  CreateRoleDto,
  RolePermissionsDto,
  UpdateRoleDto,
} from "../dtos/role.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PERMISSIONS as P } from "../constants";

const router = Router();
const roleController = new RoleController();

// Get all roles
router.get("/", requirePermission([P.Role_READ]), roleController.read);

// Get a role by id
router.get("/:id", requirePermission([P.Role_READ]), roleController.readOne);

// Create a new role
router.post(
  "/",
  requirePermission([P.Role_ADD]),
  validationMiddleware(CreateRoleDto),
  roleController.create
);

// Update a role
router.patch(
  "/:id",
  requirePermission([P.Role_EDIT]),
  validationMiddleware(UpdateRoleDto),
  roleController.update
);

// Delete a role
router.delete(
  "/:id",
  requirePermission([P.Role_REMOVE]),
  roleController.delete
);

/* PERMISSIONS */
// Get role's permissions
router.get(
  "/:id/permissions",
  requirePermission([P.Role_READ, P.Permission_READ]),
  roleController.listPermission
);

// Assign permission to a role
router.patch(
  "/:id/permissions/add",
  requirePermission([P.Role_EDIT, P.Permission_READ]),
  validationMiddleware(RolePermissionsDto),
  roleController.addPermission
);

// Unassign permission from role
router.patch(
  "/:id/permissions/remove",
  requirePermission([P.Role_EDIT, P.Permission_READ]),
  validationMiddleware(RolePermissionsDto),
  roleController.dropPermission
);

export default router;
