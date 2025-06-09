import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_COMPLETE_EMAIL,
  SEND_ACCOUNT_DETAILS_TEMPLATE,
  SUBSCRIBE_NEWSLETTER_TEMPLATE,
  PAYMENT_SUCCESS_TEMPLATE,
} from "../mailtrap/emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
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

export const sendCourseCredentialsToUser = async (
  userEmail,
  userName,
  courseName,
  courseImage,
  loginEmail,
  loginPassword,
  loginURL
) => {
  try {
    const emailContent = SEND_ACCOUNT_DETAILS_TEMPLATE.replace(
      "{userName}",
      userName
    )
      .replace("{courseName}", courseName)
      .replace("{courseImage}", courseImage)
      .replace("{loginEmail}", loginEmail)
      .replace("{loginPassword}", loginPassword)
      .replace("{loginURL}", loginURL);

    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: userEmail,
      subject: "Your Course Access Details",
      html: emailContent,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Error sending email", { cause: error });
  }
};

export const sendSubscriptionMailToUser = async (email, userName) => {
  try {
    const htmlContent = SUBSCRIBE_NEWSLETTER_TEMPLATE.replace(
      "{userName}",
      userName
    ).replace("{unsubscribeURL}", "https://yourapp.com/unsubscribe");

    await transporter.sendMail({
      from: "Event Notifier <eventnotifieri2it@gmail.com>",
      to: email,
      subject: "Welcome to Our Platform",
      html: htmlContent,
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error("Error sending welcome email", { cause: error });
  }
};

// Add this function to your nodemailer file
export const sendPaymentSuccessEmail = async (emailData) => {
  try {
    console.log("📧 sendPaymentSuccessEmail called with data:", {
      userEmail: emailData.userEmail,
      userName: emailData.userName,
      courseName: emailData.courseName,
      transactionId: emailData.transactionId,
      orderId: emailData.orderId,
      hasCredentials: !!(emailData.credentials && emailData.credentials.email),
    });

    // Validate required data
    if (!emailData.userEmail) {
      console.error("❌ Missing user email");
      return {
        success: false,
        error: "User email is required",
        message: "Failed to send payment success email - missing email",
      };
    }

    if (!emailData.courseName) {
      console.error("❌ Missing course name");
      return {
        success: false,
        error: "Course name is required",
        message: "Failed to send payment success email - missing course name",
      };
    }

    // Check if PAYMENT_SUCCESS_TEMPLATE exists
    if (!PAYMENT_SUCCESS_TEMPLATE) {
      console.error("❌ PAYMENT_SUCCESS_TEMPLATE is not defined");
      return {
        success: false,
        error: "Email template not found",
        message: "Failed to send payment success email - template missing",
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Test connection (optional - you can remove this in production)
    const connectionOk = await testConnection(transporter);
    if (!connectionOk) {
      console.warn("⚠️ SMTP connection test failed, but continuing...");
    }

    // Prepare credentials section if available
    let credentialsSection = "";
    if (emailData.credentials && emailData.credentials.email) {
      console.log("🔑 Including credentials in email");
      credentialsSection = `
        <div style="background-color: #fff; padding: 10px; margin: 15px 0; border-radius: 3px; border: 1px solid #ddd;">
          <h4 style="margin-top: 0; color: #333;">Course Access Credentials:</h4>
          <p><strong>Email:</strong> ${emailData.credentials.email}</p>
          ${
            emailData.credentials.password
              ? `<p><strong>Password:</strong> ${emailData.credentials.password}</p>`
              : ""
          }
          <p style="font-size: 0.9em; color: #666;"><em>Please keep these credentials safe for course access.</em></p>
        </div>
      `;
    } else {
      console.log("ℹ️ No credentials to include in email");
    }

    // Replace template placeholders
    console.log("🔄 Processing email template...");
    const emailContent = PAYMENT_SUCCESS_TEMPLATE.replace(
      "{userName}",
      emailData.userName || "Student"
    )
      .replace("{courseName}", emailData.courseName || "Course")
      .replace("{originalPrice}", emailData.originalPrice || "0")
      .replace("{coinsUsed}", emailData.coinsUsed || "0")
      .replace("{coinDiscount}", emailData.coinDiscount || "0")
      .replace("{amountPaid}", emailData.amountPaid || "0")
      .replace("{transactionId}", emailData.transactionId || "N/A")
      .replace("{orderId}", emailData.orderId || "N/A")
      .replace(
        "{paymentDate}",
        emailData.paymentDate || new Date().toLocaleDateString()
      )
      .replace("{courseLink}", emailData.courseLink || "#")
      .replace("{credentialsSection}", credentialsSection)
      .replace("{accountURL}", process.env.FRONTEND_URL + "/account" || "#")
      .replace(
        "{supportEmail}",
        process.env.SUPPORT_EMAIL || "support@yourapp.com"
      );

    console.log("✅ Email template processed successfully");

    // Email options
    const mailOptions = {
      from: `"${process.env.APP_NAME || "Learning Platform"}" <${
        process.env.EMAIL
      }>`,
      to: emailData.userEmail,
      subject: `Payment Successful - Course Access Granted: ${emailData.courseName}`,
      html: emailContent,
    };

    console.log("📤 Mail options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: emailContent.length,
    });

    // Send email
    console.log("🚀 Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("🎉 Payment success email sent successfully!");
    console.log("📬 Email info:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Payment success email sent successfully",
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error) {
    console.error("💥 Error sending payment success email:", error);
    console.error("Stack trace:", error.stack);

    // More specific error handling
    if (error.code === "EAUTH") {
      console.error(
        "❌ Authentication failed - check EMAIL and EMAIL_PASS environment variables"
      );
    } else if (error.code === "ENOTFOUND") {
      console.error("❌ SMTP server not found - check internet connection");
    } else if (error.code === "ECONNECTION") {
      console.error("❌ Connection failed - check SMTP settings");
    }

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      message: "Failed to send payment success email",
    };
  }
};
