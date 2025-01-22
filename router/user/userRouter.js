const express = require("express");
const userRouter = express.Router();
const userModel = require("./../../models/users/userModel");
const jwt = require("jsonwebtoken");
const authorizationUser = require("./../../middleware/authorizationUser");
const userInformation = require("./../../controller/user/getInformation");
const transporter = require("../../configs/mail/nodemailer");
const templateLogin = require("../../configs/mail/template/template");
const random_code = require("./../../utils/randomCode");
const bcrypt = require("bcrypt");
require("dotenv").config();

userRouter.get("/is_login", userInformation.getInfo);

userRouter.post(
  "/change_password_with_email/:action",
  authorizationUser,
  async (req, res) => {
    try {
      const { action } = req.params;
      const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
      if (action === "get") {
        const user = await userModel.findById(token.id).lean();
        console.log(user);

        if (user) {
          const hashed_random_code = await bcrypt.hash(String(random_code), 11);
          await transporter
            .sendMail(
              templateLogin.templateChangePasswordCode({
                code: random_code,
                email: user.email,
              })
            )
            .then(() => {
              res.cookie("code_Email_Change_password", hashed_random_code, {
                maxAge: 2 * 60 * 1000,
                httpOnly: true,
              });
              res.json({
                message: "کد برای ایمیل شما ارسال شد",
              });
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        } else {
          res.status(404).json({
            message: "کاربر پیدا نشد",
          });
        }
      } else if (action === "verify") {
        if (req.cookies.code_Email_Change_password) {
          const validate = await bcrypt.compare(
            String(req.body.email_code),
            String(req.cookies.code_Email_Change_password)
          );
          console.log(validate);

          if (validate === true) {
            const hashed_password = await bcrypt.hash(req.body.password, 11);
            await userModel
              .findOneAndUpdate(
                { _id: token.id },
                { password: hashed_password },
                { new: true, fields: { password: 0 } }
              )
              .then((response) => {
                res.json({
                  message: "گذرواژه با موفقیت تغییر کرد",
                  data: response,
                });
              })
              .catch((err) => {
                res.status(500).send("this is error");
              });
          } else {
            res.status(401).json({
              message: "کد وارد شده صحیح نیست",
            });
          }
        } else {
          res.status(401).json({
            message: "مدت درخواست کد تمام شده مجددا درخواست بدید",
          });
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
userRouter.post(
  "/change_password_with_password/:action",
  authorizationUser,
  (req, res) => {}
);
userRouter.post("/change_email/:action", authorizationUser, (req, res) => {});
userRouter.post("/change_phone/:action", authorizationUser, (req, res) => {});

module.exports = userRouter;
