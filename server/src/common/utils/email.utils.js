import nodemailer from "nodemailer";
import {
  emailHost,
  emailPort,
  emailUser,
  emailPass,
  clientOrigin,
} from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendPasswordResetEmail = async (toAddress, rawToken) => {
  const resetLink = `${clientOrigin}/reset-password?token=${rawToken}`;

  const mailOptions = {
    from: '"Huddle Support" <support@huddle.com>',
    to: toAddress,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

export { sendPasswordResetEmail };
