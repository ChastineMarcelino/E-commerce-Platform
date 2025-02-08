import nodemailer from 'nodemailer';

// Set up the email transporter (using Gmail for simplicity)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your Gmail
    pass: 'your-email-password',   // Replace with your Gmail password or app-specific password
  },
});
