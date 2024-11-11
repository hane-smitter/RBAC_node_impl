import "dotenv/config";

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

      console.log("Database connection established.");
    })
    .catch((error) => {
      console.log(error);
    });

  console.log("Database seeding STARTED...");

  // Order is important
  await seedPermissions(AppDataSource);
  await seedRoles(AppDataSource);
  await seedUsers(AppDataSource);

  console.log("Database seeding COMPLETE.");

  await AppDataSource.destroy();
};

runSeeders().catch((error) => {
  console.error("Error seeding database:", error);
});
