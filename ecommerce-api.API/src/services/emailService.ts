import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
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
export const sendEmailNotification = async (to: string, subject: string, text: string) => {
  try {
    const mailOptions = {
      from: `"API Notification" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};
