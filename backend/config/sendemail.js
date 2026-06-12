const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4, // force IPv4
    auth: {
        user: process.env.email,
        pass: process.env.password,
    }
})

module.exports = transporter