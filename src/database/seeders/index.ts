// import dotenv from "dotenv";
import "dotenv/config";

import { AppDataSource } from "../database";
import { seedPermissions } from "./permission.seeder";
import { seedRoles } from "./role.seeder";
import { seedUsers } from "./user.seeder";
import { CreatePermissionsTrigger1729947215244 } from "../../migrations/apprun/1729947215244-CreatePermissionsTrigger";

const runSeeders = async () => {
  console.log("Database seeding STARTED...");
  await AppDataSource.initialize()
    .then(async () => {
      // Run migration file - To add MySQL trigger
      const tblPermissionsAutoSerialId =
        new CreatePermissionsTrigger1729947215244();
      await tblPermissionsAutoSerialId.down(AppDataSource.createQueryRunner());
      await tblPermissionsAutoSerialId.up(AppDataSource.createQueryRunner());

      console.log("Database connected and Initialized.");
    })
    .catch((error) => {
      console.log(error);
    });

  console.log("Running seeders...");

  await seedPermissions(AppDataSource);
  await seedRoles(AppDataSource);
  await seedUsers(AppDataSource);

  console.log("Database seeding COMPLETE.");

  await AppDataSource.destroy();
};

runSeeders().catch((error) => {
  console.error("Error seeding database:", error);
});
