import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { CreateUserDto, UpdateUserDto, UserRolesDto } from "../dtos/user.dto";
import { validationMiddleware } from "../middleware/validation.middleware";
import { requirePermission } from "../middleware/requirePermission.middleware";
import { PERMISSIONS as P } from "../constants";

const router = Router();
const userController = new UserController();

// Get all users
router.get("/", requirePermission([P.User_READ, P.User_ADD]), userController.read);

// Get a user by id
router.get("/:id", userController.readOne);

// Create a new user
router.post("/", validationMiddleware(CreateUserDto), userController.create);

// Update a user
router.patch(
  "/:id",
  validationMiddleware(UpdateUserDto),
  userController.update
);

// Delete a user
router.delete("/:id", userController.delete);

// ROLES
router.get("/:id/roles", userController.listRoles);
router.patch(
  "/:id/roles/add",
  validationMiddleware(UserRolesDto),
  userController.addRoles
);
router.patch(
  "/:id/roles/remove",
  validationMiddleware(UserRolesDto),
  userController.dropRoles
);

export default router;
