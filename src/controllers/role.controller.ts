import type { Request, Response } from "express";
import type { Repository } from "typeorm";

import { Role } from "../entities/Role";
import {
  CreateRoleDto,
  RolePermissionsDto,
  UpdateRoleDto,
} from "../dtos/role.dto";
import { AppDataSource } from "../database";
import { Permission } from "../entities/Permission";

const getRepo = AppDataSource.getRepository.bind(AppDataSource);

export class RoleController {
  #rolesRepo: Repository<Role>;
  #permissionsRepo: Repository<Permission>;

  constructor() {
    this.#rolesRepo = getRepo(Role);
    this.#permissionsRepo = getRepo(Permission);
  }

  /** Gets all roles */
  read = async (req: Request, res: Response) => {
    try {
      const roles = await this.#rolesRepo.find();

      res.json(roles);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed", msg: "Listing roles failed!" });
      return;
    }
  };

  /** Gets role identified by `id` */
  readOne = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID = parseInt(req.params.id);

      const role = await this.#rolesRepo.findOneBy({
        id: roleID,
      });

      res.json(role);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed", msg: "Fetching role failed!" });
      return;
    }
  };

  /** Creates new role */
  create = async (req: Request, res: Response) => {
    try {
      const roleData: CreateRoleDto = req.body;

      // Check if a role with `name` already exists
      const dupRole = await this.#rolesRepo.findOne({
        where: { name: roleData.name },
      });
      if (dupRole) {
        res.status(400).json({
          status: "failed",
          msg: `The role - ${roleData.name} already exists!`,
        });
        return;
      }

      roleData.name = roleData.name.toUpperCase();
      const role = this.#rolesRepo.create(roleData);
      await this.#rolesRepo.save(role);

      res.status(201).json({
        status: "success",
        msg: "Role created!",
        data: role,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error creating role",
      });
    }
  };

  /** Updates role identified by `id` */
  update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID = parseInt(req.params.id);

      const validUpdateKeys = ["name", "description"];
      const incomingUpdate = req.body;
      const validUpdateData: UpdateRoleDto = Object.fromEntries(
        Object.entries(incomingUpdate).filter(([key]) =>
          validUpdateKeys.includes(key)
        )
      );
      if (Object.keys(validUpdateData).length < 1) {
        res.status(400).json({
          status: "failed",
          msg: `Empty update. Expected to find the keys: ${validUpdateKeys.join(
            " | "
          )}`,
        });
        return;
      }

      if (validUpdateData.name) {
        validUpdateData.name = validUpdateData.name.toUpperCase();
      }

      await this.#rolesRepo.update(roleID, validUpdateData);

      res.status(200).json({
        status: "success",
        msg: "Role updated!",
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error updating role",
      });
      return;
    }
  };

  /** Deletes role identified by `id` */
  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID = parseInt(req.params.id);

      // Related records in the junction table will be deleted bcoz `{ onDelete: "CASCADE" }` is set in entities definition
      await this.#rolesRepo.delete(roleID);

      res.json({
        status: "success",
        msg: "Role deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error deleting role",
      });
    }
  };

  /* PERMISSIONS */
  /** Gets permissions assigned to a role identified by `id` */
  listPermission = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID: number = parseInt(req.params.id);

      const roleWithPermissions = await this.#rolesRepo.findOne({
        where: { id: roleID },
        relations: ["permissions"],
      });

      res.json(roleWithPermissions);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error trying to list role permissions",
      });
    }
  };

  /** Sets permission(s) on a role identified by `id` */
  addPermission = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID: number = parseInt(req.params.id);
      const incomingUpdate: RolePermissionsDto = req.body;
      const permissionIDs = incomingUpdate.permissions;

      const roleWithPermissions = await this.#rolesRepo.findOne({
        where: { id: roleID },
        relations: ["permissions"],
      });
      if (!roleWithPermissions) {
        res.status(404).json({
          status: "failed",
          msg: "Role not found",
        });
        return;
      }

      const existingPermissions = roleWithPermissions.permissions;
      const newPermissions = await Promise.all(
        permissionIDs.map(async (permissionID) => {
          const permission = await this.#permissionsRepo.findOne({
            where: { id: permissionID },
          });

          return permission;
        })
      ).then(function (permissions) {
        return permissions.filter((permission) => permission !== null);
      });

      // Update permissions
      roleWithPermissions.permissions = [
        ...existingPermissions,
        ...newPermissions,
      ];

      await this.#rolesRepo.save(roleWithPermissions);

      res.status(200).json({
        status: "success",
        msg: "Valid permissions added to role",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "failed", msg: "Updating role permissions failed" });
    }
  };

  /** Drops permission(s) on a role identified by `id` */
  dropPermission = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID: number = parseInt(req.params.id);
      const incomingPermissionRemoval: RolePermissionsDto = req.body;

      const roleWthPermissions = await this.#rolesRepo.findOne({
        where: { id: roleID },
        relations: ["permissions"],
      });

      if (!roleWthPermissions) {
        res.status(404).json({ status: "failed", msg: "Role not found" });
        return;
      }

      const filteredPermissions = [];
      const existingPermissions = roleWthPermissions.permissions;
      const removalPermissionIds = incomingPermissionRemoval.permissions;
      for (let idx = 0; idx < existingPermissions.length; idx++) {
        const id = existingPermissions[idx].id;

        if (!removalPermissionIds.includes(id)) {
          filteredPermissions.push(existingPermissions[idx]);
        }
      }

      roleWthPermissions.permissions = filteredPermissions;
      await this.#rolesRepo.save(roleWthPermissions);

      res.status(200).json({
        status: "success",
        msg: "Valid permissions removed from role",
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ status: "failed", msg: "Removing permissions failed!" });
      return;
    }
  };
}
