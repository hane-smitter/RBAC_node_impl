import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { validationMiddleware } from "../middleware/validation.middleware";

const router = Router();
const userController = new UserController();

// Get all users
router.get("/", userController.read);

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

export default router;

