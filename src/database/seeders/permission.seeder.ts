// src/database/seeders/UserSeeder.ts
import { type DataSource } from "typeorm";
import { Permissions } from "../../entities/Permissions";

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepository = dataSource.getRepository(Permissions);

  const permissions = [
    // users
    {
      name: "USER:READ",
      description: "Can read user(s)",
    },
    {
      name: "USER:ADD",
      description: "Can add a new user",
    },
    {
      name: "USER:EDIT",
      description: "Can edit user information",
    },
    {
      name: "USER_ROLE:EDIT",
      description: "Can edit user information and their roles",
    },
    {
      name: "USER:REMOVE",
      description: "Can remove user",
    },
    // roles
    {
      name: "ROLE:READ",
      description: "Can read role(s)",
    },
    {
      name: "ROLE:ADD",
      description: "Can add a new role",
    },
    {
      name: "ROLE:EDIT",
      description: "Can edit role information",
    },
    {
      name: "ROLE_PERMISSION:EDIT",
      description: "Can edit role information and its permissions",
    },
    {
      name: "ROLE:REMOVE",
      description: "Can remove role",
    },
    // permissions
    {
      name: "PERMISSION:READ",
      description: "Can read permission(s)",
    },
    {
      name: "PERMISSION:ADD",
      description: "Can add a new permission",
    },
    {
      name: "PERMISSION:EDIT",
      description: "Can edit permission information",
    },
    {
      name: "PERMISSION:REMOVE",
      description: "Can remove permission",
    },
  ];

  //   for (const user of permissions) {
  //     const newUser = permissionRepository.create(user);
  //     await permissionRepository.save(newUser);
  //   }
  await Promise.all(
    permissions.map(async (permission) => {
      const newPermission = permissionRepository.create(permission);
      await permissionRepository.save(newPermission);
    })
  );
  console.log("Permissions seeded successfully.");
};
