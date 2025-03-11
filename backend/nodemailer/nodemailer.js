import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_COMPLETE_EMAIL,
} from "../mailtrap/emailTemplate.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "eventnotifieri2it@gmail.com",
    pass: "mfznlnyoilkjopgu",
  },
});

export const sendVerificationEmail = async (userEmail, verificationToken) => {
  try {
    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: userEmail,
      subject: "Verification code sent verify account",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Error sending email", { cause: error });
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: email,
      subject: "Welcome to Our Platform",
      html: VERIFICATION_COMPLETE_EMAIL.replace(
        "{go back to site url}",
        "http://localhost:5173/"
      ),
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error("Error sending welcome email", { cause: error });
  }
};

export const sendPasswordResetEmail = async (email, url) => {
  try {
    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: email,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
    });

    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error("Error sending password reset email", { cause: error });
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset success email sent successfully");
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error("Error sending password reset success email", {
      cause: error,
    });
  }
};
