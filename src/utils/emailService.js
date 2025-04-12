// src/utils/emailService.js
const nodemailer = require('nodemailer');

async function createTestTransporter() {
  // Create a test account using Ethereal Email
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal test account created:', testAccount);

  // Create a transporter using the test account SMTP settings
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

async function sendEmail(to, subject, text) {
  const transporter = await createTestTransporter();

  const mailOptions = {
    from: '"Inventory System" <no-reply@example.com>',
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
  // Preview URL for Ethereal
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return info;
}

module.exports = sendEmail;
