import http from "http";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import "./config/logging";
import { DEVELOPMENT, mongo, server } from "./config/db";
import inventory from "./routes/inventory";
import shipmentRoutes from "./routes/shipmentRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import rolesRoutes from "./routes/rolesRoutes";
import permissionRoutes from "./routes/permissionRoutes";
import usermanagementRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import orderDetailRoutes from "./routes/orderDetailRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import authRoutes from "./routes/authRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import cors from "cors";
import { loggingHandler } from "./Middleware/loggingHandler";
import { routeNotFound } from "./Middleware/routeNotFound";
import { specs } from "./config/swagger";
import { auditTrailMiddleware } from "./Middleware/auditTrailMiddleware"; // Import the middleware
import userRoutes from "./routes/userRoutes";
import path from "path";
import defaultMaterialRoutes from "./routes/defaultMaterialRoutes";


dotenv.config();

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

const Main = async () => {
  logging.log("----------------------------------------");
  logging.log("Initializing API");
  logging.log("----------------------------------------");
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());
  application.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


  logging.log("----------------------------------------");
  logging.log("Swagger UI");
  logging.log("----------------------------------------");
  application.use("/api", userRoutes);
  application.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Your API Documentation",
    })
  );

  logging.log("----------------------------------------");
  logging.log("Connect to Mongo");
  logging.log("----------------------------------------");
  try {
    const connection = await mongoose.connect(
      mongo.MONGO_CONNECTION,
      mongo.MONGO_OPTIONS
    );
    logging.log("Connected to Mongo:", connection.version);
  } catch (error) {
    logging.error("Unable to connect to Mongo", error);
  }

  logging.log("----------------------------------------");
  logging.log("Logging & Configuration");
  logging.log("----------------------------------------");
  application.use(loggingHandler);
  application.use(cors({
    origin: "http://localhost:4200", // ✅ Allow Angular frontend
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  }));
  application.use(auditTrailMiddleware);
  logging.log("----------------------------------------");
  logging.log("Define Controller Routing");
  logging.log("----------------------------------------");

  // Existing routes
  application.use(inventory);
  application.use(transactionRoutes);
  application.use(shipmentRoutes);
  application.use(categoryRoutes);
  application.use(productRoutes);
  application.use(orderDetailRoutes);
  application.use(orderRoutes);
  application.use(paymentRoutes);
  application.use(rolesRoutes);
  application.use(permissionRoutes);
  application.use(usermanagementRoutes);
  application.use(supplierRoutes);
  application.use(authRoutes);
  application.use(webhookRoutes);
  application.use("/api/v1", defaultMaterialRoutes);
  

  // Error Handling

  logging.log("----------------------------------------");
  logging.log("Define Routing Error");
  logging.log("----------------------------------------");
  application.use(routeNotFound);

  logging.log("----------------------------------------");
  logging.log("Starting Server");
  logging.log("----------------------------------------");
  httpServer = http.createServer(application);
  httpServer.listen(server.SERVER_PORT, () => {
    logging.log(`Server started on ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`);
  });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
