import "dotenv/config";
import "reflect-metadata";
import express from "express";

import { AppDataSource } from "./database";
import { CreatePermissionsTrigger1729947215244 } from "./migrations/apprun/1729947215244-CreatePermissionsTrigger";
import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
import permissionRoutes from "./routes/permission.routes";
import apiResponseFormat from "./middlewares/apiResponseFormat.middleware";

const app = express();
const apiRouter = express.Router();

/* 1. Main middlewares */
app.use(express.json());
app.use(apiResponseFormat);

// Server port number
const PORT = parseInt(String(process.env.SERVER_PORT)) || 3000;

/* 2. Application Routes */
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

apiRouter.use("/users", userRoutes);
apiRouter.use("/roles", roleRoutes);
apiRouter.use("/permissions", permissionRoutes);
app.use("/api/v1", apiRouter);

/* 3. Catch-all route(404 route) */
app.use((req, res) => {
  res.status(404).respond("Resource Not Found");
});

/* 4. Database connection */
AppDataSource.initialize()
  .then(async () => {
    // Run migration file - To add MySQL trigger
    const tblPermissionsAutoSerialId =
      new CreatePermissionsTrigger1729947215244();
    await tblPermissionsAutoSerialId.down(AppDataSource.createQueryRunner());
    await tblPermissionsAutoSerialId.up(AppDataSource.createQueryRunner());

    console.log("DB connected");
    app.emit("startServer");
  })
  .catch((error) => {
    console.log(error);
  });

/* 5. Start server, when 'startServer' event fires */
app.on("startServer", () => {
  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
