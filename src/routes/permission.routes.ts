import { Router } from "express";

import { PermissionController } from "../controllers/permission.controller";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();
const permissionController = new PermissionController();

// Get all permissions
router.get("/", permissionController.read);

// Get a permission by id
router.get("/:id", permissionController.readOne);

// Create a new permission
router.post(
  "/",
  validationMiddleware(CreatePermissionDto),
  permissionController.create
);

// Update a permission
router.patch(
  "/:id",
  validationMiddleware(UpdatePermissionDto),
  permissionController.update
);

// Delete a permission
router.delete("/:id", permissionController.delete);

export default router;
