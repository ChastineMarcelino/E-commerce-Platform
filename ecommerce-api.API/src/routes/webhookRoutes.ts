import express from "express";
import { handleSignWellWebhook } from "../controllers/webhookController";
import { auditTrailMiddleware } from "../Middleware/auditTrailMiddleware";

const router = express.Router();

/**
 * Middleware to verify SignWell API Key before processing webhook requests.
 */
const verifySignWellApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const receivedApiKey = req.headers["x-api-key"];
  const SIGNWELL_API_KEY = process.env.SIGNWELL_API_KEY || "your_signwell_api_key";

  if (!receivedApiKey || receivedApiKey !== SIGNWELL_API_KEY) {
    console.error("❌ Unauthorized: Invalid API Key");
    return res.status(403).json({ error: "Unauthorized: Invalid API Key" });
  }
  next();
};

/**
 * Webhook route for handling SignWell events.
 */
router.post("/signwell", verifySignWellApiKey, auditTrailMiddleware, handleSignWellWebhook);

export default router;