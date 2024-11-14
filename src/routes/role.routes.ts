import { Router } from "express";

import { RoleController } from "../controllers/role.controller";
import {
  CreateRoleDto,
  RolePermissionsDto,
  UpdateRoleDto,
} from "../dtos/role.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();
const roleController = new RoleController();

// Get all roles
router.get("/", roleController.read);

// Get a role by id
router.get("/:id", roleController.readOne);

// Create a new role
router.post("/", validationMiddleware(CreateRoleDto), roleController.create);

// Update a role
router.patch(
  "/:id",
  validationMiddleware(UpdateRoleDto),
  roleController.update
);

// Delete a role
router.delete("/:id", roleController.delete);

// PERMISSIONS
router.get("/:id/permissions", roleController.listPermission);
router.patch(
  "/:id/permissions/add",
  validationMiddleware(RolePermissionsDto),
  roleController.addPermission
);
router.patch(
  "/:id/permissions/remove",
  validationMiddleware(RolePermissionsDto),
  roleController.dropPermission
);

export default router;
