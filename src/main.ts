import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database";

// Create an Express application
const app = express();

// Set the port number for the server
const PORT = 3000;

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

// Connect to DB
AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    app.emit("dbConnected");
  })
  .catch((error) => {
    console.log(error);
  });

// Listen for the 'dbConnected' event and start the server
app.on("dbConnected", () => {
  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
