import { Router } from "express";

import { PermissionController } from "../controllers/permissions.controller";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";
import { validationMiddleware } from "../middleware/validation.middleware";

const router = Router();
const permissionsController = new PermissionController();

// Get all permissions
router.get("/", permissionsController.read);

// Get a permission by id
router.get("/:id", permissionsController.readOne);

// Create a new permission
router.post(
  "/",
  validationMiddleware(CreatePermissionDto),
  permissionsController.create
);

// Update a permission
router.patch(
  "/:id",
  validationMiddleware(UpdatePermissionDto),
  permissionsController.update
);

// Delete a permission
router.delete("/:id", permissionsController.delete);

export default router;
