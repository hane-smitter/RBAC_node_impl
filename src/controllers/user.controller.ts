import type { Request, Response } from "express";
import type { Repository } from "typeorm";

import { User } from "../entities/User";
import { CreateUserDto, UpdateUserDto, UserRolesDto } from "../dtos/user.dto";
import { AppDataSource } from "../database";
import { Role } from "../entities/Role";

const getRepo = AppDataSource.getRepository.bind(AppDataSource);

export class UserController {
  #usersRepo: Repository<User>;
  #rolesRepo: Repository<Role>;

  constructor() {
    this.#usersRepo = getRepo(User);
    this.#rolesRepo = getRepo(Role);
  }

  /** Get all users */
  read = async (req: Request, res: Response) => {
    try {
      const users = await this.#usersRepo.find();

      res.status(200).respond(users);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Listing users failed!");
      return;
    }
  };

  /** Get user identified by `id` */
  readOne = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID = parseInt(req.params.id);

      const user = await this.#usersRepo.findOneBy({
        id: userID,
      });

      if (!user) {
        res.status(404).respond("User not found");
        return;
      }

      res.respond(user);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Getting user failed due to error!");
      return;
    }
  };

  /** Create new user */
  create = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDto = req.body;

      const user = this.#usersRepo.create(userData);
      await this.#usersRepo.save(user);

      res.status(201).respond(user);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error creating user");
      return;
    }
  };

  /** Update user identified by `id` */
  update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID = parseInt(req.params.id);

      const validUpdateKeys = ["firstName", "lastName", "age"];
      const updateData = req.body;
      const validUpdateData: UpdateUserDto = Object.fromEntries(
        Object.entries(updateData).filter(([key]) =>
          validUpdateKeys.includes(key)
        )
      );
      if (Object.keys(validUpdateData).length < 1) {
        res.status(400).respond("Nothing to update");
        return;
      }

      await this.#usersRepo.update(userID, validUpdateData);
      const updatedUser = await this.#usersRepo.findOneBy({ id: userID });

      res.status(200).respond(updatedUser);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error updating user");
      return;
    }
  };

  /** Delete user identified by `id` */
  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID = parseInt(req.params.id);

      await this.#usersRepo.delete(userID);

      res.respond("User deleted successfully");
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error Deleting user");
      return;
    }
  };

  /* PERMISSIONS */
  /** Get roles assigned to a user identified by `id` */
  listRoles = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID: number = parseInt(req.params.id);

      const userWithRoles = await this.#usersRepo.findOne({
        where: { id: userID },
        relations: ["roles"],
      });

      if (!userWithRoles) {
        res.status(404).respond("User not found");
        return;
      }

      res.respond(userWithRoles);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error trying to list user roles");
      return;
    }
  };

  /** Add role(s) on a user identified by `id` */
  addRoles = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID: number = parseInt(req.params.id);
      const incomingUpdate: UserRolesDto = req.body;
      const roleIDs = incomingUpdate.roles;

      const userWithRoles = await this.#usersRepo.findOne({
        where: { id: userID },
        relations: ["roles"],
      });
      if (!userWithRoles) {
        res.status(404).respond("User not found");
        return;
      }

      const existingroles = userWithRoles.roles;
      const newRoles = await Promise.all(
        roleIDs.map(async (roleID) => {
          const role = await this.#rolesRepo.findOne({
            where: { id: roleID },
          });

          return role;
        })
      ).then(function (roles) {
        return roles.filter((role) => role !== null);
      });

      // Update roles
      userWithRoles.roles = [...existingroles, ...newRoles];

      await this.#usersRepo.save(userWithRoles);

      res.status(200).respond("Valid roles added to user");
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Updating user roles failed");
      return;
    }
  };

  /** Drop role(s) on a user identified by `id` */
  dropRoles = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userID: number = parseInt(req.params.id);
      const incomingRolesRemoval: UserRolesDto = req.body;

      const userWithRoles = await this.#usersRepo.findOne({
        where: { id: userID },
        relations: ["roles"],
      });

      if (!userWithRoles) {
        res.status(404).respond("User not found");
        return;
      }

      const filteredRoles = [];
      const existingRoles = userWithRoles.roles;
      const removalPermissionIDs = incomingRolesRemoval.roles;
      for (let idx = 0; idx < existingRoles.length; idx++) {
        const id = existingRoles[idx].id;

        if (!removalPermissionIDs.includes(id)) {
          filteredRoles.push(existingRoles[idx]);
        }
      }

      userWithRoles.roles = filteredRoles;
      await this.#usersRepo.save(userWithRoles);

      res.status(200).respond("Valid roles removed from user");
      return;
    } catch (error) {
      res.status(500).respond("Removing roles failed!");
      return;
    }
  };
}
