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
      firstName: "Juma",
      lastName: "Khatibi",
      age: 25,
    },
    // Manager
    {
      firstName: "Andrew",
      lastName: "Amadou",
      age: 52,
    },
    // Viewer
    {
      firstName: "Cate",
      lastName: "Stella",
      age: 28,
    },
    // Admin
    {
      firstName: "Jane",
      lastName: "Marara",
      age: 32,
    },
    // Guest
    {
      firstName: "Larsson",
      lastName: "Nduta",
      age: 22,
    },
    // Guest
    {
      firstName: "Cosmus",
      lastName: "Daniella",
      age: 36,
    },
  ];

  //   for (const user of users) {
  //     const newUser = userRepository.create(user);
  //     await userRepository.save(newUser);
  //   }
  const roles = await roleRepository.find();
  await Promise.all(
    users.map(async (user) => {
      const newUser = userRepository.create(user);
      await userRepository.save(newUser);

      const userToAsssignRole = await userRepository.findOne({
        where: { firstName: user.firstName, lastName: user.lastName },
        relations: ["roles"],
      });

      if (userToAsssignRole) {
        const person = userToAsssignRole.firstName;

        switch (person) {
          case "Juma":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.SuperAdmin;
            });
            break;

          case "Jane":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Admin;
            });
            break;

          case "Andrew":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Manager;
            });
            break;

          case "Cate":
            userToAsssignRole.roles = roles.filter((role) => {
              return role.name === R.Viewer;
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
