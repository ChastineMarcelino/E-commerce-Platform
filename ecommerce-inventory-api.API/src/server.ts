import http from "http";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import "./config/logging";
import { DEVELOPMENT, mongo, server } from "./config/db";
import inventory from "./routes/inventory";
import shipmentRoutes from "./routes/shipmentRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import rolesRoutes from "./routes/rolesRoutes";
import permissionRoutes from "./routes/permissionRoutes";
import usermanagementRoutes from "./routes/usermanagementRoutes";
import orderRoutes from "./routes/orderRoutes";
import orderDetailRoutes from "./routes/orderDetailRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/authRoutes";
import "reflect-metadata";
import { corsHandler } from "./Middleware/corsHandler";
import { loggingHandler } from "./Middleware/loggingHandler";
import { routeNotFound } from "./Middleware/routeNotFound";
import { specs } from "./config/swagger";

// Nodemailer and OTP-related setup
import { transporter } from './nodemailerSetup';
import { generateOTP } from './otpGenerator';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

interface OTPRecord {
  otp: string;
  expiresAt: number;
}

// In-memory OTP store (use Redis or a database in production)
let pendingOTP: Record<string, OTPRecord> = {};
const emailVerificationTimeout = 5 * 60 * 1000; // OTP expires in 5 minutes

const Main = async () => {
  logging.log("----------------------------------------");
  logging.log("Initializing API");
  logging.log("----------------------------------------");
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  logging.log("----------------------------------------");
  logging.log("Swagger UI");
  logging.log("----------------------------------------");
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
    logging.log("----------------------------------------");
    logging.log("Connected to Mongo: ", connection.version);
    logging.log("----------------------------------------");
  } catch (error) {
    logging.log("----------------------------------------");
    logging.error(error);
    logging.error("Unable to connect to Mongo");
    logging.log("----------------------------------------");
  }

  logging.log("----------------------------------------");
  logging.log("Logging & Configuration");
  logging.log("----------------------------------------");
  application.use(loggingHandler);
  application.use(corsHandler);

  logging.log("----------------------------------------");
  logging.log("Define Controller Routing");
  logging.log("----------------------------------------");

  // Your existing routes
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
  application.use(authRoutes);

  // OTP Routes
  application.post('/login', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a new OTP
    const otp = generateOTP();

    // Store OTP temporarily (use in-memory store here; use Redis or DB in production)
    pendingOTP[email] = { otp, expiresAt: Date.now() + emailVerificationTimeout };

    // Send OTP to the user's email
    try {
      await transporter.sendMail({
        from: 'your-email@gmail.com',  // Use a valid email address
        to: email,
        subject: 'Your One-Time Password (OTP)',
        text: `Your OTP is: ${otp}`,
      });
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      // Log the error and return a detailed error message
      console.error('Error sending OTP:', error);

      // Check if it's an error with nodemailer or other issues
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Error during login', error: error.message });
      }

      // Generic fallback for unexpected errors
      return res.status(500).json({ message: 'An unknown error occurred during login' });
    }
  });

  application.post('/verify-otp', (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const otpRecord = pendingOTP[email];

    // Check if OTP exists and is still valid (not expired)
    if (!otpRecord || Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    // Verify OTP
    if (otp === otpRecord.otp) {
      // OTP is correct, delete it from the pending OTP store
      delete pendingOTP[email];
      return res.status(200).json({ message: 'OTP verified successfully, access granted' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  });

  logging.log("----------------------------------------");
  logging.log("Define Routing Error");
  logging.log("----------------------------------------");
  application.use(routeNotFound);

  logging.log("----------------------------------------");
  logging.log("Starting Server");
  logging.log("----------------------------------------");
  httpServer = http.createServer(application);
  httpServer.listen(server.SERVER_PORT, () => {
    logging.log("----------------------------------------");
    logging.log(
      `Server started on ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`
    );
    logging.log("----------------------------------------");
  });
};

export const Shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);

Main();
