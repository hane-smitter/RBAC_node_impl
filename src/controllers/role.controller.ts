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

  /** Get all roles */
  read = async (req: Request, res: Response) => {
    try {
      const roles = await this.#rolesRepo.find();

      res.respond(roles);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Listing roles failed!");
      return;
    }
  };

  /** Get role identified by `id` */
  readOne = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID = parseInt(req.params.id);

      const role = await this.#rolesRepo.findOneBy({
        id: roleID,
      });

      if (!role) {
        res.status(404).respond("Role not found");
        return;
      }

      res.respond(role);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Fetching role failed!");
      return;
    }
  };

  /** Create new role */
  create = async (req: Request, res: Response) => {
    try {
      const roleData: CreateRoleDto = req.body;

      // Check if a role with `name` already exists
      const dupRole = await this.#rolesRepo.findOne({
        where: { name: roleData.name },
      });
      if (dupRole) {
        res.status(400).respond(`The role - ${roleData.name} already exists!`);
        return;
      }

      roleData.name = roleData.name.toUpperCase();
      const role = this.#rolesRepo.create(roleData);
      await this.#rolesRepo.save(role);

      res.status(201).respond(role);
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error creating role");
    }
  };

  /** Update role identified by `id` */
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
        res.status(400).respond("Nothing to update");
        return;
      }

      if (validUpdateData.name) {
        validUpdateData.name = validUpdateData.name.toUpperCase();
      }

      const { affected } = await this.#rolesRepo.update(
        roleID,
        validUpdateData
      );

      res.status(200).respond(` ${affected} Role updated!`);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error updating role");
      return;
    }
  };

  /** Delete role identified by `id` */
  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID = parseInt(req.params.id);

      // Related records in the junction table will be deleted bcoz `{ onDelete: "CASCADE" }` is set in entities definition
      const { affected } = await this.#rolesRepo.delete(roleID);

      res.respond(`${affected} Role deleted!`);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error deleting role");
      return;
    }
  };

  /* PERMISSIONS */
  /** Get permissions assigned to a role identified by `id` */
  listPermission = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const roleID: number = parseInt(req.params.id);

      const roleWithPermissions = await this.#rolesRepo.findOne({
        where: { id: roleID },
        relations: ["permissions"],
      });

      res.respond(roleWithPermissions);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error trying to list role permissions");
      return;
    }
  };

  /** Set permission(s) on a role identified by `id` */
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
        res.status(404).respond("Role not found");
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

      res.status(200).respond("Valid permissions added to role");
      return;
    } catch (error) {
      res.status(500).respond("Updating role permissions failed");
      return;
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
        res.status(404).respond("Role not found");
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

      res.status(200).respond("Valid permissions removed from role");
      return;
    } catch (error) {
      res.status(500).respond("Removing permissions failed!");
      return;
    }
  };
}
