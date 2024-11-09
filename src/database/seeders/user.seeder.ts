import { type DataSource } from "typeorm";
import { Users } from "../../entities/Users";

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(Users);

  const users = [
    {
      firstName: "Juma",
      lastName: "Khatibi",
      age: 25,
    },
    {
      firstName: "Andrew",
      lastName: "Amadou",
      age: 52,
    },
    {
      firstName: "Stella",
      lastName: "Winslet",
      age: 28,
    },
    {
      firstName: "Jane",
      lastName: "Marara",
      age: 32,
    },
    {
      firstName: "Larsson",
      lastName: "Nduta",
      age: 22,
    },
  ];

  //   for (const user of users) {
  //     const newUser = userRepository.create(user);
  //     await userRepository.save(newUser);
  //   }
  await Promise.all(
    users.map(async (user) => {
      const newUser = userRepository.create(user);
      await userRepository.save(newUser);
    })
  );
  console.log("Users seeded successfully.");
};
