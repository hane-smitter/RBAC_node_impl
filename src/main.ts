import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database";
import { CreatePermissionsTrigger1729947215244 } from "./migrations/1729947215244-CreatePermissionsTrigger";

const app = express();

// Server port number
const PORT = parseInt(String(process.env.sever_port)) || 3000;

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

// Connect to DB
AppDataSource.initialize()
  .then(async () => {
    // Run a migration file - Responsible to auto generate serial id for a new permission ADDED.
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
