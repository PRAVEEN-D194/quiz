const nodemailer = require("nodemailer");
require("dotenv").config();

// Standardize email environment variables with fallbacks
const emailUser = process.env.EMAIL_USER || process.env.email;
const emailPassword = process.env.EMAIL_PASSWORD || process.env.password;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

// Determine secure setting: SMTP_SECURE can be "true", "false", or inferred
let smtpSecure = true;
if (process.env.SMTP_SECURE !== undefined) {
  smtpSecure = process.env.SMTP_SECURE === 'true';
} else {
  smtpSecure = smtpPort === 465;
}

// Log status on initialization (masking credentials for security)
console.log("[Email Config] Initializing transporter...");
console.log(`[Email Config] Host: ${smtpHost}`);
console.log(`[Email Config] Port: ${smtpPort}`);
console.log(`[Email Config] Secure: ${smtpSecure}`);
console.log(`[Email Config] User: ${emailUser ? emailUser : "MISSING!"}`);
console.log(`[Email Config] Password: ${emailPassword ? "Configured (masked)" : "MISSING!"}`);

if (!emailUser || !emailPassword) {
  console.error("[Email Config] WARNING: EMAIL_USER or EMAIL_PASSWORD is not set in environment variables!");
}

const transportOptions = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 15000,
};

// TLS settings for production hosting environment
if (!smtpSecure) {
  transportOptions.tls = {
    // STARTTLS configuration
    rejectUnauthorized: true
  };
} else {
  transportOptions.tls = {
    // SSL/TLS configuration
    rejectUnauthorized: true
  };
}

const transporter = nodemailer.createTransport(transportOptions);

// Wrap sendMail method to perform validation, add safe error handling, and mask credentials
const originalSendMail = transporter.sendMail.bind(transporter);
transporter.sendMail = async function (mailOptions, callback) {
  if (!emailUser || !emailPassword) {
    const errMsg = "Email sending failed: EMAIL_USER or EMAIL_PASSWORD environment variables are missing.";
    console.error(`[Email Error] ${errMsg}`);
    const error = new Error(errMsg);
    if (callback) return callback(error);
    throw error;
  }

  // Ensure 'from' uses the configured email user
  if (!mailOptions.from) {
    mailOptions.from = emailUser;
  } else if (mailOptions.from === process.env.email && emailUser) {
    mailOptions.from = emailUser;
  }

  console.log(`[Email] Attempting to send email to: ${mailOptions.to}`);

  const handleSendError = (err) => {
    // Log only the message to avoid exposing credentials or socket objects
    console.error(`[Email Error] Failed to send email to ${mailOptions.to}:`, err.message);

    // Check for common connection errors/timeouts on hosting platforms
    if (err.code === 'ECONNLOOKUP' || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED' || err.message.includes('timeout')) {
      console.warn(
        `[Email Warning] Connection failed or timed out. Production hosting services (like Render, AWS, Heroku) ` +
        `frequently block standard SMTP ports (25, 465, 587). ` +
        `If this error persists, we highly recommend switching to a Web API-based email service such as Resend, SendGrid, Mailgun, Brevo, or Amazon SES.`
      );
    }

    return new Error("Email delivery failed. Please try again later.");
  };

  if (callback) {
    return originalSendMail(mailOptions, (err, info) => {
      if (err) {
        return callback(handleSendError(err));
      }
      console.log(`[Email Success] Email sent successfully to ${mailOptions.to}: ${info.messageId}`);
      return callback(null, info);
    });
  }

  try {
    const info = await originalSendMail(mailOptions);
    console.log(`[Email Success] Email sent successfully to ${mailOptions.to}: ${info.messageId}`);
    return info;
  } catch (err) {
    throw handleSendError(err);
  }
};

// Validate the transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("[Email Config] Nodemailer transporter verification failed:", error.message);
    if (error.code === 'ECONNLOOKUP' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.warn(
        `[Email Warning] Transporter verification failed due to network connectivity/timeout. ` +
        `If you are on a production host, SMTP ports (25, 465, 587) might be blocked. ` +
        `We recommend using a Web API-based provider like Resend, SendGrid, Mailgun, Brevo, or Amazon SES instead.`
      );
    }
  } else {
    console.log("[Email Config] Nodemailer transporter is verified and ready to send emails.");
  }
});

module.exports = transporter;