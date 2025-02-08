// src/config/db.ts
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from a .env file into process.env
dotenv.config();

// Environment flags
export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const QA = process.env.NODE_ENV === "qa";
export const PRODUCTION = process.env.NODE_ENV === "production";

export const JWT_SECRET = process.env.JWT_SECRET || "";

// MongoDB connection configuration
export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const MONGO_URL = process.env.MONGO_URL || "";
export const MONGO_COLLECTION = process.env.MONGO_COLLECTION || "";
export const MONGO_OPTIONS: mongoose.ConnectOptions = {
  retryWrites: true,
  w: "majority",
};

// Server configuration
export const SERVER_HOSTNAME = process.env.SERVER_HOST || "localhost";
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

// Grouped MongoDB configuration
export const mongo = {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_URL,
  MONGO_COLLECTION,
  MONGO_OPTIONS,
  MONGO_CONNECTION: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_COLLECTION}?retryWrites=true&w=majority`,
};


// Function to connect to MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    console.log(mongo.MONGO_CONNECTION)
    await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Grouped server configuration
export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};
