const nodemailer = require("nodemailer")
require("dotenv").config()

console.log(process.env.ADDRESS_EMAIL);

console.log(process.env.PASS_EMAIL);


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADDRESS_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
});

module.exports = transporter