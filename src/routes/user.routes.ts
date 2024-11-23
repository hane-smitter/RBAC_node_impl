import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { CreateUserDto, UpdateUserDto, UserRolesDto } from "../dtos/user.dto";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PERMISSIONS as P } from "../constants";

const router = Router();
const userController = new UserController();

// Get all users
router.get("/", requirePermission([P.User_READ]), userController.read);

// Get a user by id
router.get("/:id", requirePermission([P.User_READ]), userController.readOne);

// Create a new user
router.post(
  "/",
  requirePermission([P.User_ADD]),
  validationMiddleware(CreateUserDto),
  userController.create
);

// Update a user
router.patch(
  "/:id",
  requirePermission([P.User_EDIT]),
  validationMiddleware(UpdateUserDto),
  userController.update
);

// Delete a user
router.delete(
  "/:id",
  requirePermission([P.User_REMOVE]),
  userController.delete
);

/* ROLES */
// Get user's roles
router.get(
  "/:id/roles",
  requirePermission([P.User_READ, P.Role_READ]),
  userController.listRoles
);

// Assign role to a user
router.patch(
  "/:id/roles/add",
  requirePermission([P.User_EDIT, P.Role_READ]),
  validationMiddleware(UserRolesDto),
  userController.addRoles
);


// Unassign role from user
router.patch(
  "/:id/roles/remove",
  requirePermission([P.User_EDIT, P.Role_READ]),
  validationMiddleware(UserRolesDto),
  userController.dropRoles
);

export default router;
