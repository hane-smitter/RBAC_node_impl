import { type DataSource } from "typeorm";

import { PERMISSIONS as P } from "../../constants";
import { Permissions } from "../../entities/Permissions";

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepository = dataSource.getRepository(Permissions);

  const permissions = [
    // users
    {
      name: P.User_READ,
      description: "Can read user(s)",
    },
    {
      name: P.User_ADD,
      description: "Can add a new user",
    },
    {
      name: P.User_EDIT,
      description: "Can edit user information",
    },
    {
      name: P.UserRole_EDIT,
      description: "Can edit user information and their roles",
    },
    {
      name: P.User_REMOVE,
      description: "Can remove user",
    },
    // roles
    {
      name: P.Role_READ,
      description: "Can read role(s)",
    },
    {
      name: P.Role_ADD,
      description: "Can add a new role",
    },
    {
      name: P.Role_EDIT,
      description: "Can edit role information",
    },
    {
      name: P.RolePermission_EDIT,
      description: "Can edit role information and its permissions",
    },
    {
      name: P.Role_REMOVE,
      description: "Can remove role",
    },
    // permissions
    {
      name: P.Permission_READ,
      description: "Can read permission(s)",
    },
    {
      name: P.Permission_ADD,
      description: "Can add a new permission",
    },
    {
      name: P.Permission_EDIT,
      description: "Can edit permission information",
    },
    {
      name: P.Permission_REMOVE,
      description: "Can remove permission",
    },
  ];

  // We ensure we save to the DB sequentially to avoid conflict with how trigger on this table works
  for (const permission of permissions) {
    const newPermission = permissionRepository.create(permission);
    await permissionRepository.save(newPermission);
  }
  console.log("Permissions seeded successfully.");
};
