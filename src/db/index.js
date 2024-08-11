import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const dbUrl = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;
    console.log(`Connecting to MongoDB:`);
    const connectionInstance = await mongoose.connect(dbUrl);
    console.log(`MongoDb Connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    // Consider implementing a retry mechanism or a more robust error handling strategy
    process.exit(1);
  }
};

export default connectDB;