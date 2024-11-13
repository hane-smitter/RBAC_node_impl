import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Repository } from "typeorm";

import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { PermissionProvider } from "../providers/permission.provider";

/**
 * @param resourcePermissionNames Array of permission names(_case-sensitive_).
 */
export const requirePermission = (
  resourcePermissionNames: string[]
): RequestHandler => {
  const userRepo = AppDataSource.getRepository(User);
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Typically in systems with auth, userID would be in a decoded JWT token
    const incomingUserID = req.headers["x-user-id"] as string;

    if (!incomingUserID) {
      res.status(401).json({
        status: "failed",
        msg: "Account required to access resource",
      });
      return;
    }

    const appPermissions = await PermissionProvider.retrievePermissions();
    if (!appPermissions.length) {
      res.status(403).json({ status: "failed", msg: "No permissions" });
      return;
    }
    const resourcePermissionInstances = appPermissions.filter((appPermission) =>
      resourcePermissionNames.includes(appPermission.name)
    );
    // Required permissions to access the `next()` resource as an aggregate number
    const resourcePermissions = resourcePermissionInstances.reduce(
      (previousValue, currentValue) => {
        return previousValue | currentValue.serial_id; // Doing a bitwise OR using permission's `serial_id`
      },
      0
    );

    const userID = parseInt(incomingUserID);
    // DB operation to get user permission as an aggregate number.
    // In secure systems(with auth), this permission number could be stored on JWT token to eliminate DB call
    const userPermissions = await getUserPermissions(userRepo, userID);
    const hasRequiredPermissions =
      (resourcePermissions & userPermissions) === resourcePermissions;

    // console.log("Permission BIT_AND -> ", {
    //   userPermissions,
    //   resourcePermissions,
    //   resourcePermissionNames,
    //   hasRequiredPermissions,
    // });

    if (!hasRequiredPermissions) {
      res.status(403).json({
        status: "failed",
        msg: "Access Denied! Insufficient permissions.",
      });
      return;
    }

    next();
  };
};

/**
 * This function gets user's permissions as an aggregate value(using bitwise `OR`) from the `serial_id`(s)  of the permissions they have.
 * @example <caption>This TypeORM code seeks to generate SQL query similar to:</caption>
 * ```sql
 * SELECT BIT_OR(p.serial_id) as permission FROM users u
 * INNER JOIN users_roles ur ON u.id = ur.usersId
 * INNER JOIN roles_permissions rp ON ur.rolesId = rp.rolesId
 * INNER JOIN permissions p ON rp.permissionsId = p.id
 * WHERE u.id = 3;
 * ```
 */
async function getUserPermissions(
  userRepo: Repository<User>,
  userID: number
): Promise<number> {
  const result = await userRepo
    .createQueryBuilder("u")
    .select("BIT_OR(p.serial_id)", "permission")
    // NOTE: We are 'joining' using relationship properties rather than explicit names of the join tables
    .innerJoin("u.roles", "r") // `roles` is a relation in `User` entity
    .innerJoin("r.permissions", "p") // `permissions` is a relation in `Role` entity
    .where("u.id = :userID", { userID })
    .getRawOne<{ permission: string }>();

  return parseInt(result?.permission || "0");
}
