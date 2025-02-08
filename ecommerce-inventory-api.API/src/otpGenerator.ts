import crypto from 'crypto';

// Function to generate a random OTP (6 digits)
export function generateOTP(): string {
  const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP
  return otp.toString();
}
