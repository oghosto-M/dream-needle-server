const express = require("express");
require("dotenv").config();
const captcha = require("./../../controller/auth/captcha");
const authRouter = express.Router();
const login = require("./../../controller/auth/login");
const captchaValidation = require("./../../middleware/captchaValidation");
const register = require("../../controller/auth/register");
const transporter = require("../../configs/mail/nodemailer");
const templateLogin = require("./../../configs/mail/template/template");
const userModel = require("./../../models/users/userModel");
const bcrypt = require("bcrypt");
const limiter = require("./../../configs/limiter/auth/limiterAuth");

// code captcha
authRouter.get("/captcha", captcha.get);
authRouter.post("/captcha", captcha.validate);

// login
authRouter.post(
  "/loginWithPassword",
  captchaValidation,
  login.loginWithPassword
);
authRouter.get(
  "/loginWithEmail",
  limiter,
  captchaValidation,
  login.loginWithEmail_getCode
);
authRouter.post(
  "/loginWithEmail",
  captchaValidation,
  login.loginWithEmail_validation
);
// authRouter.post("/loginWithPhone", captcha.validate);

// register
authRouter.post(
  "/register_sendCode_email",
  limiter,
  captchaValidation,
  register.register_sendCode_email
);
authRouter.post("/register", captchaValidation, register.register);

// forgot password
authRouter.get("/forgotPassword", captchaValidation, async (req, res) => {
  try {
    const user = await userModel.findOne({ phone: req.cookies.captcha }).lean();
    if (user) {
      const { email } = user;
      const random_code = Math.floor(10000 + Math.random() * 90000);
      const hashed_random_code = await bcrypt.hash(String(random_code), 11);

      await transporter
        .sendMail(
          templateLogin.templateLogin({
            code: random_code,
            email: email,
          })
        )
        .then(() => {
          res.cookie("code_Email", hashed_random_code, {
            maxAge: 2 * 60 * 1000,
            httpOnly: true,
          });
          res.json({
            message: "کد برای ایمیل شما ارسال شد",
          });
        })
        .catch((response) => {
          res.status(500).send("none login", response);
        });
    } else {
      res.status(404).json({
        message: "کاربری با این شماره تلفن موجود نیست",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
authRouter.post("/forgotPassword", captchaValidation, async (req, res) => {
  try {
    if (req.cookies.code_Email) {
      if (req.body.code_Email) {
        const validate = await bcrypt.compare(
          String(req.body.code_Email),
          String(req.cookies.code_Email)
        );

        if (validate === true) {
          const user = await userModel
            .findOne({ phone: req.cookies.captcha })
            .lean();
          if (user) {
            if (req.body.new_passwoed || req.body.new_passwoed.length <= 7) {
              const hashed_password = await bcrypt.hash(
                String(req.body.new_passwoed),
                11
              );
              await userModel
                .updateOne(
                  { phone: req.cookies.captcha },
                  { password: hashed_password }
                )
                .then(() => {
                  res.json({
                    message: "گذرواژه شما با موفقیت تغیر کرد",
                  });
                })
                .catch((err) => {
                  res.status(500).send(err);
                });
            } else {
              res.status(422).json({
                message: "درخواست شما باید شامل گذرواژه جدید و معتبر باشد",
              });
            }
          } else {
            res.status(404).json({
              message: "کاربری با این شماره تلفن وجود ندارد",
            });
          }
        } else {
          res.status(401).json({
            message: "کد نا معتبر است",
          });
        }
      } else {
        res.status(422).json({
          message: "درخواست شما باید شامل ایمیل باشد",
        });
      }
    } else {
      res.status(401).json({
        message: "مدت کد ایمیل شما منقضی شده است",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = authRouter;
