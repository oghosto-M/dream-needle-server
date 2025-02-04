import { Request, Response } from "express";
require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./../../models/users/userModel";
import transporter from "../../configs/mail/nodemailer";
import { templateLogin } from "./../../configs/mail/template/template";

const secretKey = process.env.SECRET_KEY || ""

export const loginWithPassword = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    if (phone && password) {
      const user = await userModel.findOne({ phone: phone });
      if (user) {
        const validate = await bcrypt.compare(
          String(password),
          String(user.password)
        );
        if (validate) {
          const token = await jwt.sign(
            { id: user.id, role: user.role },
            secretKey,
            {
              expiresIn: "3h",
            }
          );
          res.clearCookie("captcha");
          res.cookie("token", token, {
            maxAge: 3 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.json({
            message: "ورود با موفقیت انجام شد",
          });
        } else {
          res.status(401).json({
            message: "رمز عبور صحیح نیست",
          });
        }
      } else {
        res.status(404).json({
          message: "کاربری با این شماره تلفن موجود نیست",
        });
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل شماره تلفن و رمز باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const loginWithEmail_getCode = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findOne({ phone: req.cookies.captcha })
      .lean();
    if (user) {
      const { email } = user;
      const random_code = Math.floor(10000 + Math.random() * 90000);
      const hashed_random_code = await bcrypt.hash(String(random_code), 11);

      await transporter
        .sendMail(
          templateLogin({
            code: String(random_code),
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
        .catch((err: any) => {
          res.status(500).send(err);
        });
    } else {
      res.status(404).json({
        message: "کاربری با این شماره تلفن موجود نیست",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}
export const loginWithEmail_validation = async (req: Request, res: Response) => {
  try {
    if (req.cookies.code_Email) {
      if (req.body.code_Email) {
        const validate = await bcrypt.compare(
          String(req.body.code_Email),
          String(req.cookies.code_Email)
        );
        if (validate === true) {
          const user = await userModel.findOne({ phone: req.cookies.captcha }).lean();

          if (user) {
            const token = await jwt.sign(
              { id: user._id, role: user.role },
              secretKey,
              {
                expiresIn: "3h",
              }
            );
            res.clearCookie("captcha");
            res.clearCookie("code_Email");
            res.cookie("token", token, {
              maxAge: 3 * 60 * 60 * 1000,
              httpOnly: true,
            });
            res.json({
              message: "ورود با موفقیت انجام شد",
            });
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
          message: "درخواست شما باید شامل کد ایمیل باشد",
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
}

