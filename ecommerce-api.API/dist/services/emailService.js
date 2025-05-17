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
const sendEmailNotification = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"API Notification" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
        };
        yield transporter.sendMail(mailOptions);
        console.log("📩 Email sent to:", to);
    }
    catch (error) {
        console.error("❌ Email sending error:", error);
        throw error;
    }
});
exports.sendEmailNotification = sendEmailNotification;
