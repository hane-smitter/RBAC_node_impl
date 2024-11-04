import { Request, Response } from "express";

import { Permissions } from "../entities/Permissions";
import { AppDataSource } from "../database";
import { type Repository } from "typeorm";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";

const getRepo = AppDataSource.getRepository.bind(AppDataSource);

export class PermissionController {
  #permissionsRepo: Repository<Permissions>;

  constructor() {
    this.#permissionsRepo = getRepo(Permissions);
  }

  read = async (req: Request, res: Response) => {
    try {
      const permissions = await this.#permissionsRepo.find();

      res.json(permissions);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "failed", msg: "Listing permissions failed!" });
    }
  };

  readOne = async (req: Request<{ id: string }>, res: Response) => {
    const permissionID = parseInt(req.params.id);

    const permission = await this.#permissionsRepo.findOneBy({
      id: permissionID,
    });

    res.json(permission);
  };

  create = async (req: Request, res: Response) => {
    try {
      const permissionData: CreatePermissionDto = req.body;

      // Check if a role with `name` already exists
      const dupPermission = await this.#permissionsRepo.findOne({
        where: { name: permissionData.name },
      });
      if (dupPermission) {
        res.status(400).json({
          status: "failed",
          msg: `The permission name - \`${permissionData.name}\` already exists!`,
        });
        return;
      }

      const role = this.#permissionsRepo.create(permissionData);
      await this.#permissionsRepo.save(role);

      res.status(201).json({
        status: "success",
        msg: "Permission created!",
        data: role,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error creating Permission",
      });
    }
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const permissionID = parseInt(req.params.id);

      const validUpdateKeys = ["name", "description"];
      const incomingUpdate = req.body;
      const validUpdateData: UpdatePermissionDto = Object.fromEntries(
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

      // Check if `validUpdateData.name` is taken
      if (validUpdateData.name) {
        const permission = await this.#permissionsRepo.findOne({
          where: { name: validUpdateData.name },
        });

        if (permission) {
          res.status(400).json({
            status: "failed",
            msg: `\`name\` ${validUpdateData.name} already taken!`,
          });
          return;
        }
      }

      const { affected } = await this.#permissionsRepo.update(
        permissionID,
        validUpdateData
      );

      res.status(200).json({
        status: "success",
        msg: `${affected} Permission updated`,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error updating permission",
      });
      return;
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const permissionID = parseInt(req.params.id);

      // Related records in the junction table will be deleted bcoz `{ onDelete: "CASCADE" }` is set in entities definition
      const { affected } = await this.#permissionsRepo.delete(permissionID);
      res.json({
        status: "success",
        msg: `${affected} Permission deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        msg: "Error deleting permission",
      });
    }
  };
}
