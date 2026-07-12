const nodemailer = require("nodemailer");
const https = require("https");
require("dotenv").config();

// Load email credentials and API keys
const emailApiKey = process.env.EMAIL_API_KEY;
const emailFrom = process.env.EMAIL_FROM || process.env.email;

const emailUser = process.env.EMAIL_USER || process.env.email;
const emailPassword = process.env.EMAIL_PASSWORD || process.env.password;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

// Determine secure setting
let smtpSecure = true;
if (process.env.SMTP_SECURE !== undefined) {
  smtpSecure = process.env.SMTP_SECURE === 'true';
} else {
  smtpSecure = smtpPort === 465;
}

// Resend HTTP REST API Call
const sendViaResend = (apiKey, from, to, subject, text, html) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      text: text,
      html: html || `<p>${text.replace(/\n/g, '<br>')}</p>`
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000 // 10-second timeout
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        let responseJson;
        try {
          responseJson = JSON.parse(responseBody);
        } catch (e) {
          responseJson = { message: responseBody };
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseJson);
        } else {
          const err = new Error(responseJson.message || `Resend API returned status code ${res.statusCode}`);
          err.statusCode = res.statusCode;
          err.response = responseJson;
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Resend API request timed out'));
    });

    req.write(postData);
    req.end();
  });
};

// Initialize SMTP Transporter if API key is not present
let smtpTransporter = null;
if (!emailApiKey) {
  console.log("[Email Config] EMAIL_API_KEY is not defined. Using SMTP fallback configuration...");
  console.log(`[Email Config] Host: ${smtpHost}`);
  console.log(`[Email Config] Port: ${smtpPort}`);
  console.log(`[Email Config] Secure: ${smtpSecure}`);
  
  if (emailUser && emailPassword) {
    const transportOptions = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };

    if (!smtpSecure) {
      transportOptions.tls = { rejectUnauthorized: true };
    } else {
      transportOptions.tls = { rejectUnauthorized: true };
    }

    smtpTransporter = nodemailer.createTransport(transportOptions);

    // Verify SMTP connection config on start
    smtpTransporter.verify((error, success) => {
      if (error) {
        console.error("[Email Config] SMTP transporter verification failed:", error.message);
      } else {
        console.log("[Email Config] SMTP transporter is verified and ready.");
      }
    });
  } else {
    console.error("[Email Config] WARNING: Neither EMAIL_API_KEY nor SMTP credentials (EMAIL_USER / EMAIL_PASSWORD) are set!");
  }
} else {
  console.log("[Email Config] EMAIL_API_KEY detected. Using Resend API for email delivery.");
  console.log(`[Email Config] From Address: ${emailFrom}`);
}

// Unified transporter interface (matching Nodemailer)
const transporter = {
  sendMail: async function (mailOptions, callback) {
    const to = mailOptions.to;
    const subject = mailOptions.subject;
    const text = mailOptions.text;
    const html = mailOptions.html;

    console.log(`[Email Service] Initiating email delivery to: ${to}`);

    if (emailApiKey) {
      // Use Resend API
      try {
        if (!emailFrom) {
          throw new Error("EMAIL_FROM is required when using Resend API.");
        }
        const result = await sendViaResend(emailApiKey, emailFrom, to, subject, text, html);
        console.log(`[Email Service] Resend API successfully queued email. Message ID: ${result.id}`);
        
        const info = { messageId: result.id };
        if (callback) return callback(null, info);
        return info;
      } catch (err) {
        console.error(`[Email Service Error] Resend API failed: ${err.message}`);
        if (err.response) {
          console.error(`[Email Service Error] Resend API response: ${JSON.stringify(err.response)}`);
        }
        // Clean error message to not expose secrets/keys
        const cleanErr = new Error("Email sending failed. Please check the backend email configuration.");
        if (callback) return callback(cleanErr);
        throw cleanErr;
      }
    } else {
      // Fallback to SMTP
      if (!smtpTransporter) {
        const errMsg = "Email service not configured. Please define EMAIL_API_KEY or SMTP credentials.";
        console.error(`[Email Service Error] ${errMsg}`);
        const error = new Error(errMsg);
        if (callback) return callback(error);
        throw error;
      }

      const options = { ...mailOptions };
      if (!options.from) {
        options.from = emailUser;
      } else if (options.from === process.env.email && emailUser) {
        options.from = emailUser;
      }

      try {
        const info = await smtpTransporter.sendMail(options);
        console.log(`[Email Service] SMTP sent successfully: ${info.messageId}`);
        if (callback) return callback(null, info);
        return info;
      } catch (err) {
        console.error(`[Email Service Error] SMTP failed: ${err.message}`);
        const cleanErr = new Error("Email delivery failed. Please check backend SMTP credentials.");
        if (callback) return callback(cleanErr);
        throw cleanErr;
      }
    }
  }
};

module.exports = transporter;