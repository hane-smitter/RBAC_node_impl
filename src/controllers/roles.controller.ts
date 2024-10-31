import { Request, Response } from "express";

import { Roles } from "../entities/Roles";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import { AppDataSource } from "../database";
import { Permissions } from "../entities/Permissions";
import { In } from "typeorm";
import { plainToClass, plainToInstance } from "class-transformer";

const getRepository = AppDataSource.getRepository.bind(AppDataSource);

export class RoleController {
  async read(req: Request, res: Response) {
    const roles = await getRepository(Roles).find();

    res.json(roles);
  }

  async readOne(req: Request<{ id: string }>, res: Response) {
    const roleID = parseInt(req.params.id);

    const role = await getRepository(Roles).findOneBy({
      id: roleID,
    });

    res.json(role);
  }

  async create(req: Request, res: Response) {
    try {
      const roleRepository = getRepository(Roles);
      const roleData: CreateRoleDto = req.body;

      // ----------START: Specifying role Permissions----------
      let rolePermissionIds = roleData.permissions;
      if (!rolePermissionIds || rolePermissionIds.length < 1) {
        rolePermissionIds = [1]; // Assign a default permission
      }

      const entityPermissions = await Promise.all(
        rolePermissionIds.map(async function (permissionId) {
          const permission = await getRepository(Permissions).findOne({
            where: { id: permissionId },
          });

          return permission;
        })
      ).then((permissions) =>
        permissions.filter((permissions) => permissions !== null)
      );
      // ----------END: Specifying role Permissions----------

      const roleDataInstance = plainToInstance(Roles, roleData);
      roleDataInstance.permissions = entityPermissions;

      const role = roleRepository.create(roleDataInstance);
      await roleRepository.save(role);

      res.status(201).json({
        status: "success",
        msg: "Role created!",
        data: role,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error creating role",
      });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const roleRepository = getRepository(Roles);
      const roleId = parseInt(req.params.id);

      const validUpdateKeys = ["name", "description", "permissions"];
      const updateData = req.body;
      const validUpdateData: UpdateRoleDto = Object.fromEntries(
        Object.entries(updateData).filter(([key]) =>
          validUpdateKeys.includes(key)
        )
      );
      if (Object.keys(validUpdateData).length < 1) {
        res.status(400).json({ msg: "Empty update op" });
        return;
      }

      const roleUpdateInstance = plainToInstance(Roles, validUpdateData);

      // ----------START: Updating role Permissions----------
      let rolePermissionIds = validUpdateData.permissions;
      if (rolePermissionIds) {
        const entityPermissions = await Promise.all(
          rolePermissionIds.map(async function (permissionId) {
            const permission = await getRepository(Permissions).findOne({
              where: { id: permissionId },
            });

            return permission;
          })
        ).then((permissions) =>
          permissions.filter((permissions) => permissions !== null)
        );
        roleUpdateInstance.permissions = entityPermissions;
      }
      // ----------END: Updating role Permissions----------

      await roleRepository.update(roleId, roleUpdateInstance);
      const updatedRole = await roleRepository.findOneBy({ id: roleId });

      res.status(200).json({
        status: "success",
        msg: "Role updated!",
        data: updatedRole,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error updating role",
      });
      return;
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const roleID = parseInt(req.params.id);
      const roleRepository = getRepository(Roles);

      // This role permission in junction tbl is cascaded so expected to also be deleted
      await roleRepository.delete(roleID);

      res.json({
        status: "success",
        msg: "Role deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error Deleting role",
      });
    }
  }
}
