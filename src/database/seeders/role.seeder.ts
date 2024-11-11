import { type DataSource } from "typeorm";

import { ROLES as R, PERMISSIONS as P } from "../../constants";
import { Roles } from "../../entities/Roles";
import { Permissions } from "../../entities/Permissions";

export const seedRoles = async (dataSource: DataSource) => {
  const rolesRepository = dataSource.getRepository(Roles);
  const permissionsRepository = dataSource.getRepository(Permissions);

  const roles = [
    {
      name: R.SuperAdmin,
      description:
        "Manage users(create, update, delete accounts, assign roles), Manage roles(create, update, delete roles, assign permissions), Manage permission(create, update, delete roles)",
    },
    {
      name: R.Admin,
      description:
        "Manage users(create, update, delete accounts, assign roles), Manage roles(create, update, delete roles, assign permissions)",
    },
    {
      name: R.Manager,
      description: "Manage users(create, update accounts)",
    },
    {
      name: R.Viewer,
      description: "Can view users, roles",
    },
    {
      name: R.Guest,
      description: "Can view users",
    },
  ];

  /* 
  NOTES:
  - All can view users
  - All can view users and roles except GUEST
  - All can view users, roles and permissions except GUEST and VIEWER
 
  Excluding GUEST and VIEWER:
  - All can manage users, including assigning roles -   but MANAGER cannot: 1. delete a user, 2. manage roles(but can view), 3. manage permissions
  - Other than managing users, SUPER_ADMIN can manage roles and permissions while, ADMIN can manage roles only and is additonally able to only read permissions
  */

  //   for (const user of permissions) {
  //     const newUser = rolesRepository.create(user);
  //     await rolesRepository.save(newUser);
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
            const isPermissionPermission = /^PERMISSION(\w+)?:/;
            const adminPermissions = permissions.filter((permission) => {
              return (
                !isPermissionPermission.test(permission.name) ||
                permission.name === P.Permission_READ
              );
            });

            roleToGrantPermissions.permissions = adminPermissions;
            break;

          case R.Manager:
            // Assign permissions to 'manage users' except 'delete user'. Also grant 'view roles' permissions
            const managerPermissions = permissions.filter((permission) => {
              const isUserPermission = /^USER(\w+)?:/;
              return (
                (isUserPermission.test(permission.name) &&
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
