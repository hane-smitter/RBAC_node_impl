import "dotenv/config";
import "reflect-metadata";
import express from "express";

import { AppDataSource } from "./database";
import { CreatePermissionsTrigger1729947215244 } from "./migrations/apprun/1729947215244-CreatePermissionsTrigger";
import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
import permissionRoutes from "./routes/permission.routes";

const app = express();
const apiRouter = express.Router();

// Main middlewares
app.use(express.json());

// Server port number
const PORT = parseInt(String(process.env.sever_port)) || 3000;

// Application Routes
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

apiRouter.use("/users", userRoutes);
apiRouter.use("/roles", roleRoutes);
apiRouter.use("/permissions", permissionRoutes);
app.use("/api/v1", apiRouter);

// Catch-all route for 404
app.use((req, res) => {
  res.status(404).json({ err: "404 Not Found" });
});

// Connect to DB
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

// Listen for the 'startServer' event and start the server
app.on("startServer", () => {
  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
