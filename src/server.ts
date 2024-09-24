import { Server } from "http";
import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";

require("dotenv").config();

let server: Server;

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string); // remote mongodb
    // await mongoose.connect("mongodb://localhost:27017/car"); // local mongodb
    console.log("Database Connected!");
    server = app.listen(config.app_port, () => {
      console.log(`Server listening on port ${config.app_port}`);
    });
  } catch (error) {
    console.log("Error while connecting server and database");
  }
}

// unhandled rejection
process.on("unhandledRejection", () => {
  console.log("unhandledRejection is detected, shutting down the server");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// uncaught exception
process.on("uncaughtException", () => {
  console.log("uncaught exception is detected");
  process.exit(1);
});
