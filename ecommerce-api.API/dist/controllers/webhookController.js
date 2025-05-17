"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignWellWebhook = void 0;
const webhook_1 = require("../models/webhook");
const dotenv_1 = __importDefault(require("dotenv"));
const emailService_1 = require("../services/emailService"); // Import email sender
dotenv_1.default.config();
const SIGNWELL_API_KEY = process.env.SIGNWELL_API_KEY || "your_signwell_api_key";
/**
 * Handle SignWell Webhooks
 */
const handleSignWellWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receivedApiKey = req.headers["x-api-key"];
        // Validate API key
        if (!receivedApiKey || receivedApiKey !== SIGNWELL_API_KEY) {
            console.error("❌ Unauthorized: Invalid API Key");
            return res.status(403).json({ error: "Unauthorized: Invalid API Key" });
        }
        const { event_type, data } = req.body;
        // Validate required fields
        if (!event_type || !(data === null || data === void 0 ? void 0 : data.document_url) || !(data === null || data === void 0 ? void 0 : data.signer_email)) {
            console.error("❌ Invalid webhook data:", req.body);
            return res.status(400).json({ error: "Invalid webhook data" });
        }
        // Save webhook event to MongoDB
        const webhookEvent = new webhook_1.WebhookEvent({
            event_type,
            document_url: data.document_url,
            signer_email: data.signer_email,
            completed_at: data.completed_at || null,
            reason: data.reason || null,
            received_at: new Date(),
        });
        yield webhookEvent.save();
        console.log("✅ Webhook saved:", webhookEvent);
        // Send Email Notification for document completion
        if (event_type === "document.completed") {
            const emailSubject = "📄 Document Signed Successfully!";
            const emailBody = `Hello,\n\nYour document has been successfully signed.\n\nView it here: ${data.document_url}\n\nThank you!`;
            try {
                yield (0, emailService_1.sendEmailNotification)(data.signer_email, emailSubject, emailBody);
                console.log("📩 Email sent successfully to:", data.signer_email);
            }
            catch (emailError) {
                console.error("❌ Failed to send email:", emailError);
            }
        }
        res.status(200).json({ message: "Webhook received, saved, and email sent successfully" });
    }
    catch (error) {
        console.error("❌ Webhook processing error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.handleSignWellWebhook = handleSignWellWebhook;
