import { Router } from "express";

import { RoleController } from "../controllers/roles.controller";
import {
  CreateRoleDto,
  RolePermissionsDto,
  UpdateRoleDto,
} from "../dtos/role.dto";
import { validationMiddleware } from "../middleware/validation.middleware";

const router = Router();
const rolesController = new RoleController();

// Get all roles
router.get("/", rolesController.read);

// Get a role by id
router.get("/:id", rolesController.readOne);

// Create a new role
router.post("/", validationMiddleware(CreateRoleDto), rolesController.create);

// Update a role
router.patch(
  "/:id",
  validationMiddleware(UpdateRoleDto),
  rolesController.update
);

// Delete a role
router.delete("/:id", rolesController.delete);

// PERMISSIONS
router.get("/:id/permissions", rolesController.listPermission);
router.patch(
  "/:id/permissions/add",
  validationMiddleware(RolePermissionsDto),
  rolesController.addPermission
);
router.patch(
  "/:id/permissions/remove",
  validationMiddleware(RolePermissionsDto),
  rolesController.dropPermission
);

export default router;
