"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookController_1 = require("../controllers/webhookController");
const auditTrailMiddleware_1 = require("../Middleware/auditTrailMiddleware");
const router = express_1.default.Router();
/**
 * Middleware to verify SignWell API Key before processing webhook requests.
 */
const verifySignWellApiKey = (req, res, next) => {
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
router.post("/signwell", verifySignWellApiKey, auditTrailMiddleware_1.auditTrailMiddleware, webhookController_1.handleSignWellWebhook);
exports.default = router;
