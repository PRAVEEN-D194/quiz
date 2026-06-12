const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
})

module.exports = transporter