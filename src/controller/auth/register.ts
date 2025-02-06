import { Request, Response } from "express";
import { user } from "../../type";

import userModel from "./../../models/users/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate_register from "./../../validation/auth/registerValidate";
import { templateLogin } from "../../configs/mail/template/template";
import transporter from "../../configs/mail/nodemailer";

require("dotenv").config();
const secretKey = process.env.SECRET_KEY || "";
export const register = async (req: Request, res: Response) => {
  try {
    if (req.cookies.code_Email_register) {
      if (req.body.email_code && req.body.email_code.length === 5) {
        const compateCodeEmail = await bcrypt.compare(
          String(req.body.email_code),
          String(req.cookies.code_Email_register),
        );
        if (compateCodeEmail) {
          const validate_req_data = await validate_register(req.body);

          if (validate_req_data === true) {
            const user_email = await userModel
              .findOne({ email: req.body.email })
              .lean();
            const user_phone = await userModel
              .findOne({ phone: req.body.phone })
              .lean();

            if (!user_phone) {
              if (!user_email) {
                const { name, lastname, email, phone, password } = req.body;
                const hashed_password = await bcrypt.hash(String(password), 11);

                await userModel
                  .create({
                    name,
                    lastname,
                    email,
                    phone,
                    password: hashed_password,
                    role: 3,
                    address: "بدون آدرس سکونت",
                    phone_verify: false,
                    email_verify: true,
                  })
                  .then(async (response: user) => {
                    if (response) {
                      const token = await jwt.sign(
                        { id: response._id, role: response },
                        secretKey,
                        {
                          expiresIn: "3h",
                        },
                      );
                      res.clearCookie("captcha");
                      res.clearCookie("code_Email_register");
                      res.cookie("token", token, {
                        maxAge: 3 * 60 * 60 * 1000,
                        httpOnly: true,
                      });
                      res.json({
                        message: "با موفقیت ثبت نام شدید",
                      });
                    } else {
                      res.status(500).json({});
                    }
                  });
              } else {
                res.status(401).json({
                  message: "کاربر با این آدرس ایمیل ثبت شده",
                });
              }
            } else {
              res.status(401).json({
                message: "کاربر با این شماره تماس ثبت شده",
              });
            }
          } else {
            res.status(422).json({
              message: validate_req_data[0].message,
            });
          }
        } else {
          res.status(422).json({
            message: "کد نامعتبر است",
          });
        }
      } else {
        res.status(422).json({
          message: "لطفا کد 5 رقمی ارسال شده را وارد کنید",
        });
      }
    } else {
      res.status(401).json({
        message: "مدت کد ایمیل شما تمام شده",
        refresh: true,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const register_sendCode_email = async (req: Request, res: Response) => {
  try {
    if (
      req.body.email &&
      /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g.test(req.body.email) === true
    ) {
      const random_code = Math.floor(10000 + Math.random() * 90000);
      const hashed_random_code = await bcrypt.hash(String(random_code), 11);
      const user = await userModel.findOne({ email: req.body.email }).lean();

      if (!user) {
        await transporter
          .sendMail(
            templateLogin({
              code: String(random_code),
              email: req.body.email,
            }),
          )
          .then(() => {
            res.cookie("code_Email_register", hashed_random_code, {
              maxAge: 2 * 60 * 1000,
              httpOnly: true,
            });
            res.json({
              message: "کد برای ایمیل شما ارسال شد",
            });
          });
      } else {
        res.status(401).json({
          message: "کاربری با این ایمیل قبلا ثبت شده",
        });
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل ایمیل معتبر باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
