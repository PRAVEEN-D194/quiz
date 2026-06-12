const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    service: 'gmail', // Specifying 'gmail' allows Nodemailer to optimize the configurations
  host: 'smtp.gmail.com',
  port: 465,        // Try switching to port 465...
  secure: true,     // ...and set secure to true. (Render sometimes prefers 465 over 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be the 16-digit App Password
  },
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
})

module.exports = transporter