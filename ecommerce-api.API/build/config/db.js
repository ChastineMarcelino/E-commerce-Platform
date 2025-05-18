"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.connectDB = exports.mongo = exports.SERVER_PORT = exports.SERVER_HOSTNAME = exports.MONGO_OPTIONS = exports.MONGO_COLLECTION = exports.MONGO_URL = exports.MONGO_PASSWORD = exports.MONGO_USER = exports.JWT_SECRET = exports.PRODUCTION = exports.QA = exports.DEVELOPMENT = void 0;
// src/config/db.ts
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables from a .env file into process.env
dotenv_1.default.config();
// Environment flags
exports.DEVELOPMENT = process.env.NODE_ENV === "development";
exports.QA = process.env.NODE_ENV === "qa";
exports.PRODUCTION = process.env.NODE_ENV === "production";
exports.JWT_SECRET = process.env.JWT_SECRET || "";
// MongoDB connection configuration
exports.MONGO_USER = process.env.MONGO_USER || "";
exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
exports.MONGO_URL = process.env.MONGO_URL || "";
exports.MONGO_COLLECTION = process.env.MONGO_COLLECTION || "";
exports.MONGO_OPTIONS = {
    retryWrites: true,
    w: "majority",
};
// Server configuration
exports.SERVER_HOSTNAME = process.env.SERVER_HOST || "localhost";
exports.SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 3000;
// Grouped MongoDB configuration
exports.mongo = {
    MONGO_USER: exports.MONGO_USER,
    MONGO_PASSWORD: exports.MONGO_PASSWORD,
    MONGO_URL: exports.MONGO_URL,
    MONGO_COLLECTION: exports.MONGO_COLLECTION,
    MONGO_OPTIONS: exports.MONGO_OPTIONS,
    MONGO_CONNECTION: `mongodb+srv://${exports.MONGO_USER}:${exports.MONGO_PASSWORD}@${exports.MONGO_URL}/${exports.MONGO_COLLECTION}?retryWrites=true&w=majority`,
};
// Function to connect to MongoDB
const connectDB = async () => {
    try {
        console.log(exports.mongo.MONGO_CONNECTION);
        await mongoose_1.default.connect(exports.mongo.MONGO_CONNECTION, exports.mongo.MONGO_OPTIONS);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Grouped server configuration
exports.server = {
    SERVER_HOSTNAME: exports.SERVER_HOSTNAME,
    SERVER_PORT: exports.SERVER_PORT,
};
