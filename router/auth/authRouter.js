const express = require("express");
require("dotenv").config();
const userModel = require("./../../models/users/userModel");
const captcha = require("./../../controller/auth/captcha");
const bcrypt = require("bcrypt");
const transporter = require("./../../configs/mail/nodemailer");
const templateLogin = require("./../../configs/mail/template/template");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

// code captcha
authRouter.get("/captcha", captcha.get);
authRouter.post("/captcha", captcha.validate);

// register
authRouter.post("/register", captcha.validate);

// login
authRouter.post("/loginWithPassword", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (req.cookies.captcha) {
      if (phone && password) {
        const user = await userModel.findOne({ phone: phone });
        console.log(user);

        const validate = await bcrypt.compare(
          String(password),
          String(user.password)
        );
        if (validate) {
          const token = await jwt.sign(user, process.env.SECRET_KEY, {
            expiresIn: "3h",
          });
          res.cookie("token", token, { maxAge: 3 * 60 * 60 * 1000 , httpOnly : true});
          res.json({
            message: "ورود با موفقیت انجام شد",
          });
        } else {
          res.status(401).json({
            message: "رمز عبور صحیح نیست",
          });
        }
      } else {
        res.status(422).json({
          message: "درخواست شما باید شامل شماره تلفن و رمز باشد",
        });
      }
    } else {
      res.status(422).json({
        message: "تایید احراز هویت شما منقضی شده است",
        captcha: false,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// authRouter.post("/loginWithPhone", captcha.validate);
authRouter.get("/loginWithEmail", async (req, res) => {
  try {
    const info = await transporter.sendMail(
      templateLogin.templateLogin({
        code: "12345",
        email: "mirzaiemohammad594@gmail.com",
      })
    );
    console.log("Message sent: %s", info.messageId);
    res.send(info);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

// register

// authRouter.post("/register", );

module.exports = authRouter;
