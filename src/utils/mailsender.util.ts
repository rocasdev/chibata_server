import nodemailer from "nodemailer";
import { NODEMAILER_USER, NODEMAILER_PASS } from "../config/constants";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: `"Chibatá" <${NODEMAILER_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err: any) {
    console.error("Error sending email:", err);
    throw new Error(err.message);
  }
}
