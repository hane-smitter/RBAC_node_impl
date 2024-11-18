import type { Request, Response } from "express";
import type { Repository } from "typeorm";

import { Permission } from "../entities/Permission";
import { AppDataSource } from "../database";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";
import { PermissionProvider } from "../providers/permission.provider";

const getRepo = AppDataSource.getRepository.bind(AppDataSource);

export class PermissionController {
  #permissionsRepo: Repository<Permission>;

  constructor() {
    this.#permissionsRepo = getRepo(Permission);
  }

  /** Get all permissions */
  read = async (req: Request, res: Response) => {
    try {
      const permissions = await this.#permissionsRepo.find();

      res.respond(permissions);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Listing permissions failed!");
      return;
    }
  };

  /** Get permission identified by `id` */
  readOne = async (req: Request<{ id: string }>, res: Response) => {
    const permissionID = parseInt(req.params.id);

    const permission = await this.#permissionsRepo.findOneBy({
      id: permissionID,
    });

    if (!permission) {
      res.status(404).respond("Permission not found");
      return;
    }

    res.respond(permission);
  };

  /** Create new permission */
  create = async (req: Request, res: Response) => {
    try {
      const permissionData: CreatePermissionDto = req.body;

      // Check if a role with `name` already exists
      const dupPermission = await this.#permissionsRepo.findOne({
        where: { name: permissionData.name },
      });
      if (dupPermission) {
        res
          .status(400)
          .respond(
            `The permission name - \`${permissionData.name}\` already exists!`
          );
        return;
      }

      permissionData.name = permissionData.name.toUpperCase();
      const permission = this.#permissionsRepo.create(permissionData);
      await this.#permissionsRepo.save(permission);

      res.status(201).respond(permission);
      // Clear cache that stores fetched permissions from DB
      PermissionProvider.clearCache();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error creating Permission");
      return;
    }
  };

  /** Update permission identified by `id` */
  update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const permissionID = parseInt(req.params.id);

      const canUpdate = ["name", "description"];
      const incomingUpdate = req.body;
      const validUpdateData: UpdatePermissionDto = Object.fromEntries(
        Object.entries(incomingUpdate).filter(([key]) =>
          canUpdate.includes(key)
        )
      );
      if (Object.keys(validUpdateData).length < 1) {
        res.status(400).respond("Fields to update not known!");
        return;
      }

      // Check if `validUpdateData.name` is taken
      if (validUpdateData.name) {
        const permission = await this.#permissionsRepo.findOne({
          where: { name: validUpdateData.name },
        });

        if (permission) {
          res
            .status(400)
            .respond(`name \`${validUpdateData.name}\` already taken!`);
          return;
        }

        validUpdateData.name = validUpdateData.name.toUpperCase();
      }

      const { affected } = await this.#permissionsRepo.update(
        permissionID,
        validUpdateData
      );

      res.status(200).respond(`${affected} Permission updated`);
      // Clear cache that caches permissions fetched from DB
      PermissionProvider.clearCache();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error updating permission");
      return;
    }
  };

  /** Delete permission identified by `id` */
  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const permissionID = parseInt(req.params.id);

      // Related records in the junction table will be deleted bcoz `{ onDelete: "CASCADE" }` is set in entities definition
      const { affected } = await this.#permissionsRepo.delete(permissionID);
      res.respond(`${affected} Permission deleted`);
      // Clear cache that stores fetched permissions from DB
      PermissionProvider.clearCache();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).respond("Error deleting permission");
      return;
    }
  };
}
