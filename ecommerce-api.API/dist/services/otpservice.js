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
exports.generateOTP = void 0;
exports.sendOTP = sendOTP;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL = process.env.EMAIL;
// Create a Nodemailer transporter
function createTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        return nodemailer_1.default.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
    });
}
// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
exports.generateOTP = generateOTP;
// Send OTP via email
function sendOTP(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = yield createTransporter();
            yield transporter.sendMail({
                from: `"OTP Verification" <${EMAIL}>`,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
            });
            return { success: true, message: "OTP sent successfully" };
        }
        catch (error) {
            console.error("Error sending email:", error);
            return { success: false, message: "Failed to send OTP", error };
        }
    });
}
