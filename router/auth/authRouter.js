const express = require("express");
const rateLimit = require("express-rate-limit")
require("dotenv").config();
const userModel = require("./../../models/users/userModel");
const captcha = require("./../../controller/auth/captcha");
const bcrypt = require("bcrypt");
const transporter = require("./../../configs/mail/nodemailer");
const templateLogin = require("./../../configs/mail/template/template");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const login = require("./../../controller/auth/login");
const captchaValidation = require("./../../middleware/captchaValidation");


const limiter = rateLimit({
  windowMs:  2 * 60 * 1000, 
  max: 1, 
  handler: (req, res) => {
    res.status(429).json({
      message: 'در هر دو دقیقه فقط یک بار میتونید درخواست بدید'
    });
  }
});



// code captcha
authRouter.get("/captcha", captcha.get);
authRouter.post("/captcha", captcha.validate);

// register
authRouter.post("/register", captchaValidation, captcha.validate);

// login
authRouter.post(
  "/loginWithPassword",
  captchaValidation,
  login.loginWithPassword
);
authRouter.get("/loginWithEmail", limiter , captchaValidation, async (req, res) => {
  try {
    const user = await userModel.findOne({ phone: req.cookies.captcha }).lean();
    if (user) {
     const {email} = user
     const random_code = Math.floor(Math.random() * 100000)
     const info = await transporter.sendMail(
      templateLogin.templateLogin({
        code: random_code,
        email: email,
      })
    );
    res.send(info);
    } else {
      res.status(404).json({
        message: "کاربری با این شماره تلفن موجود نیست",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// authRouter.post("/loginWithPhone", captcha.validate);

// register

// authRouter.post("/register", );

module.exports = authRouter;
