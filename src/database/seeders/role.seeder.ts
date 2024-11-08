import { type DataSource } from "typeorm";
import { Roles } from "../../entities/Roles";

export const seedRoles = async (dataSource: DataSource) => {
  const rolesRepository = dataSource.getRepository(Roles);

  const roles = [
    {
      name: "SUPER_ADMIN",
      description:
        "Manage users(create, update, delete accounts, assign roles), Manage roles(create, update, delete roles, assign permissions), Manage permission(create, update, delete roles)",
    },
    {
      name: "ADMIN",
      description:
        "Manage users(create, update, delete accounts, assign roles), Manage roles(create, update, delete roles, assign permissions)",
    },
    {
      name: "MANAGER",
      description: "Manage users(create, update accounts)",
    },
    {
      name: "VIEWER",
      description: "Can view users, roles",
    },
    {
      name: "GUEST",
      description: "Can view users",
    },
  ];

  /* 
  NOTES:
  - All can view users
  - All can view users and roles except GUEST
  - All can view users, roles and permissions except GUEST and VIEWER
 
  Excluding GUEST and VIEWER:
  - All can manage users  but MANAGER cannot assign roles to a user
  - Other than managing users, SUPER_ADMIN can manage roles and permissions while, ADMIN can manage roles only
  */

  //   for (const user of permissions) {
  //     const newUser = rolesRepository.create(user);
  //     await rolesRepository.save(newUser);
  //   }
  await Promise.all(
    roles.map(async (role) => {
      const newRole = rolesRepository.create(role);
      await rolesRepository.save(newRole);
    })
  );
  console.log("Roles seeded successfully.");
};
