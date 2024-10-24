import express from "express";

// Create an Express application
const app = express();

// Set the port number for the server
const PORT = 3000;

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
