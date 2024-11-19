import { Router } from "express";

import { PermissionController } from "../controllers/permission.controller";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PERMISSIONS as P } from "../constants";

const router = Router();
const permissionController = new PermissionController();

// Get all permissions
router.get(
  "/",
  requirePermission([P.Permission_READ]),
  permissionController.read
);

// Get a permission by id
router.get(
  "/:id",
  requirePermission([P.Permission_READ]),
  permissionController.readOne
);

// Create a new permission
router.post(
  "/",
  requirePermission([P.Permission_ADD]),
  validationMiddleware(CreatePermissionDto),
  permissionController.create
);

// Update a permission
router.patch(
  "/:id",
  requirePermission([P.Permission_EDIT]),
  validationMiddleware(UpdatePermissionDto),
  permissionController.update
);

// Delete a permission
router.delete(
  "/:id",
  requirePermission([P.Permission_REMOVE]),
  permissionController.delete
);

export default router;
