import { app } from './app.js';
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({ path: './env' });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 800, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    }).on("error", (error) => {
      console.log("Error starting server:", error);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed !!! ", error);
  });