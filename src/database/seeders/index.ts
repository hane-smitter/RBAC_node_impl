import "dotenv/config";
import chalk from "chalk";

import { AppDataSource } from "../database";
import { seedPermissions } from "./permission.seeder";
import { seedRoles } from "./role.seeder";
import { seedUsers } from "./user.seeder";
import { CreatePermissionsTrigger1729947215244 } from "../../migrations/apprun/1729947215244-CreatePermissionsTrigger";

const runSeeders = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      // Run migration file - To add MySQL trigger
      const tblPermissionsAutoSerialId =
        new CreatePermissionsTrigger1729947215244();
      await tblPermissionsAutoSerialId.down(AppDataSource.createQueryRunner());
      await tblPermissionsAutoSerialId.up(AppDataSource.createQueryRunner());

      console.log(
        chalk.dim("(⊙ ‿ ⊙) ") + chalk.blue("DATABASE CONNECTION ESTABLISHED.")
      );
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(chalk.magenta("Database seeding STARTED..."));

  // Order is important
  await seedPermissions(AppDataSource);
  await seedRoles(AppDataSource);
  await seedUsers(AppDataSource);

  console.log(chalk.magenta("Database seeding COMPLETE."));

  await AppDataSource.destroy().then(() => {
    console.log(
      chalk.dim("(─ ‿ ─) ") + chalk.blue("DATABASE CONNECTION CLOSED.")
    );
  });
};

runSeeders().catch((error) => {
  console.error("Error seeding database:", error);
});
