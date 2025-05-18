"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
/**
 * Send email notification
 * @param to - Recipient email
 * @param subject - Email subject
 * @param text - Email body
 */
const sendEmailNotification = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: `"API Notification" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
        };
        await transporter.sendMail(mailOptions);
        console.log("📩 Email sent to:", to);
    }
    catch (error) {
        console.error("❌ Email sending error:", error);
        throw error;
    }
};
exports.sendEmailNotification = sendEmailNotification;
