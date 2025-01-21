import { type DataSource } from "typeorm";

import { User } from "../../entities/User";
import { Role } from "../../entities/Role";
import { ROLES as R } from "../../constants";

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  const users = [
    // Super Admin
    {
      firstName: "Hakuna",
      lastName: "Matata",
      age: 25,
    },
    // Manager
    {
      firstName: "Cinderella",
      lastName: "Mitchell",
      age: 45,
    },
    // User
    {
      firstName: "John",
      lastName: "Doe",
      age: 28,
    },
    // Admin
    {
      firstName: "Malik",
      lastName: "Tembo",
      age: 32,
    },
    // Guest
    {
      firstName: "Linda",
      lastName: "Okello",
      age: 22,
    },
    // Guest
    {
      firstName: "Eva",
      lastName: "Stephanie",
      age: 36,
    },
  ];

  const roles = await roleRepository.find(); // Fetch all roles
  // Save users with assigned roles
  await Promise.all(
    users.map(async (user) => {
      const newUser = userRepository.create(user);
      const savedUser = await userRepository.save(newUser);

      const userToAsssignRole = await userRepository.findOne({
        where: { id: savedUser.id },
        relations: ["roles"],
      });

      if (userToAsssignRole) {
        const person = userToAsssignRole.firstName;

        switch (person) {
          case "Hakuna":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.SuperAdmin;
            });
            break;

          case "Malik":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Admin;
            });
            break;

          case "Cinderella":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Manager;
            });
            break;

          case "John":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.User;
            });
            break;

          default: /* Guest */
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Guest;
            });
            break;
        }

        await userRepository.save(userToAsssignRole);
      }
    })
  );
  console.log("Users seeded successfully.");
};
