import { type DataSource } from "typeorm";

import { ROLES as R, PERMISSIONS as P } from "../../constants";
import { Role } from "../../entities/Role";
import { Permission } from "../../entities/Permission";

export const seedRoles = async (dataSource: DataSource) => {
  const rolesRepository = dataSource.getRepository(Role);
  const permissionsRepository = dataSource.getRepository(Permission);

  const roles = [
    {
      name: R.SuperAdmin,
      description:
        "Manage Users(add, view, edit and remove Users. Also assign Roles). Manage Roles(add, view, edit and remove Roles. Also assign Permissions). Manage Permissions(add, view, edit, remove Permissions).",
    },
    {
      name: R.Admin,
      description:
        "Manage Users(add, view, edit and remove Users. Also assign Roles). Manage Roles(add, view, edit and remove Roles. Also assign Permissions). Can view Permissions.",
    },
    {
      name: R.Manager,
      description:
        "Manage users(add, view and edit Users. Also assign Roles). Can view Roles.",
    },
    {
      name: R.Viewer,
      description: "Can view Users, Roles",
    },
    {
      name: R.Guest,
      description: "Can view Users",
    },
  ];

  /* 
  NOTES:
  *Read Aspect*
  - All can view users
  - All can view users and roles except GUEST
  - All can view users, roles and permissions except GUEST and USER

  *Create Aspect*
  - SUPER_ADMIN, ADMIN, MANAGER: Can (view, add, edit, assign/unassign roles) users, (view) roles
  NOTE: MANAGER cannot remove user
  - SUPER_ADMIN, ADMIN: Can (view, add, edit, delete, assign/unassign roles) users, (view, add, edit, delete, assign/unassign permissions) roles (view) permissions
  - SUPER_ADMIN: Can (view, add, edit, delete, assign/unassign roles) users, (view, add, edit, delete, assign/unassign permissions) roles (view, add, edit, delete) permissions
 
  Excluding GUEST and USER:
  - All can manage users, including assigning roles -   but MANAGER cannot: 1. delete a user, 2. manage roles(but can view), 3. manage permissions
  - Other than managing users, SUPER_ADMIN can manage roles and permissions while, ADMIN can manage roles only and is additonally able to only read permissions
  */

  //   for (const role of roles) {
  //     const newRole = rolesRepository.create(user);
  //     await rolesRepository.save(newRole);
  //   }
  const permissions = await permissionsRepository.find();
  await Promise.all(
    roles.map(async (role) => {
      // Create role and save
      const newRole = rolesRepository.create(role);
      await rolesRepository.save(newRole);

      // Assign permissions to role
      const roleToGrantPermissions = await rolesRepository.findOne({
        where: { name: role.name },
        relations: ["permissions"],
      });

      if (roleToGrantPermissions) {
        const roleName = roleToGrantPermissions.name;

        switch (roleName) {
          case R.SuperAdmin:
            // Assign all permissions
            roleToGrantPermissions.permissions = [...permissions];
            break;

          case R.Admin:
            // Assign all permissions but restrict ability to manage permissions - only allowing `PERMISSION:READ`, i.e viewing permissions
            const modifyPermissionPermit = /^PERMISSION(\w+)?:/;
            const adminPermissions = permissions.filter((permission) => {
              return (
                !modifyPermissionPermit.test(permission.name) ||
                permission.name === P.Permission_READ
              );
            });

            roleToGrantPermissions.permissions = adminPermissions;
            break;

          case R.Manager:
            // Assign permissions to 'manage users' except 'delete user'. Also grant 'view roles' permissions
            const managerPermissions = permissions.filter((permission) => {
              const modifyUserPermit = /^USER(\w+)?:/;
              return (
                (modifyUserPermit.test(permission.name) &&
                  permission.name !== P.User_REMOVE) ||
                permission.name === P.Role_READ
              );
            });

            roleToGrantPermissions.permissions = managerPermissions;
            break;

          case R.Viewer:
            // Assign permission to 'view users' and 'view roles'
            const viewerPermissions = permissions.filter((permission) => {
              return (
                permission.name === P.User_READ ||
                permission.name === P.Role_READ
              );
            });

            roleToGrantPermissions.permissions = viewerPermissions;
            break;

          default: /* GUEST */
            // Assign permission to 'view users' only
            const guestPermissions = permissions.filter((permission) => {
              return permission.name === P.User_READ;
            });

            roleToGrantPermissions.permissions = guestPermissions;
            break;
        }

        // Save role with permission mods
        await rolesRepository.save(roleToGrantPermissions);
      }
    })
  );
  console.log("Roles seeded successfully.");
};
