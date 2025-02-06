const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADDRESS_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
});

export default transporter