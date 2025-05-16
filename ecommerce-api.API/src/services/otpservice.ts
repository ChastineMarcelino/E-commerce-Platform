import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";

dotenv.config();

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST as string;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASS = process.env.SMTP_PASS as string;
const EMAIL = process.env.EMAIL as string;

// Create a Nodemailer transporter
async function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP via email
export async function sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string; error?: unknown }> {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"OTP Verification" <${EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send OTP", error };
  }
}
