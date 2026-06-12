const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  localAddress: '0.0.0.0', // Forces Node to use IPv4 instead of IPv6 (:::0)
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
})

module.exports = transporter