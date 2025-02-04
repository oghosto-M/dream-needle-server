import { Request, Response } from "express";
require("dotenv").config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import axios from "axios";
import userModel from "./../../models/users/userModel";
import transporter from "../../configs/mail/nodemailer";
import { templateChangePasswordCode } from "../../configs/mail/template/template";
import random_code from "./../../utils/randomCode";
import limiter_configuration from "./../../configs/limiter/checkLimit";
import checkRateLimit from "./../../configs/limiter/checkLimit";
import { configs } from "./../../configs/sms/sendSms";
import validate_user from "./../../validation/user_information_change/user_information_1_changer";
import { CustomJwtPayload, user } from "../../type";

const secretKey = process.env.SECRET_KEY || ""

export const change_password_with_email = async (req: Request, res: Response) => {
  try {
    const { action } = req.params;
    const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload
    if (action === "get") {
      const limiter = checkRateLimit(String(req.ip));
      if (limiter) {
        const user = await userModel.findById(token.id).lean();
        if (user) {
          const hashed_random_code = await bcrypt.hash(String(random_code), 11)
          await transporter
            .sendMail(
              templateChangePasswordCode({
                code: String(random_code),
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
            .catch((err: any) => {
              res.status(500).send(err);
            });
        } else {
          res.status(404).json({
            message: "کاربر پیدا نشد",
          });
        }
      } else {
        res.status(409).json({
          message: "لطفا دو دقیقه دیگر امتحان کنید",
        });
      }
    } else if (action === "verify") {
      if (req.cookies.code_Email_Change_password) {
        const validate = await bcrypt.compare(
          String(req.body.email_code),
          String(req.cookies.code_Email_Change_password)
        );
        if (validate === true) {
          if (req.body.password && req.body.password.length >= 8) {
            const hashed_password = await bcrypt.hash(req.body.password, 11);
            await userModel
              .updateOne({ _id: token.id }, { password: hashed_password })
              .then(() => {
                res.json({
                  message: "گذرواژه با موفقیت تغییر کرد",
                });
              })
              .catch((err: any) => {
                res.status(500).send("this is error");
              });
          } else {
            res.status(422).json({
              message: "درخواست شما باید شامل گذرواژه با 8 رقم باشد",
            });
          }
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
};
export const change_password_with_password = async (req: Request, res: Response) => {
  const token = await jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload

  if (req.body.password && req.body.prev_password) {
    const user = await userModel.findById(token.id).lean();

    if (user) {
      const validate = await bcrypt.compare(
        String(req.body.prev_password),
        String(user.password)
      );
      console.log("prev validate", validate);
      if (validate) {
        if (req.body.password.length >= 8) {
          const hashed_password = await bcrypt.hash(
            String(req.body.password),
            11
          );
          await userModel
            .updateOne({ _id: token.id }, { password: hashed_password })
            .then(() => {
              res.json({
                message: "گذرواژه با موفقیت تغییر کرد",
              });
            })
            .catch((err: any) => {
              res.status(500).send(err);
            });
        } else {
          res.status(422).json({
            message: "گذرواژه عبور جدید شما باید حداقل 8 حرف داشته باشد",
          });
        }
      } else {
        res.status(401).json({
          message: "گذرواژه قدیمی شما صحیح نیست",
        });
      }
    } else {
      res.status(404).json({
        message: "کاربر با این مشخصات پیدا نشد",
      });
    }
  } else {
    res.status(422).json({
      message: "درخواست شما باید شامل گذرواژه قدیمی و جدید باشد",
    });
  }
};
export const change_email = async (req: Request, res: Response) => {
  try {
    const { action } = req.params;
    const token = await jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload
    const user_by_email = await userModel
      .findOne({ email: req.body.email })
      .lean();

    if (action === "get") {
      const limit = limiter_configuration(String(req.ip));
      if (limit) {
        if (!user_by_email) {
          if (
            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g.test(req.body.email) ===
            true
          ) {
            const user = await userModel.findById(token.id).lean();
            if (user) {
              const hashed_random_code = await bcrypt.hash(
                String(random_code),
                11
              );
              const hashed_email = await bcrypt.hash(
                String(req.body.email),
                11
              );
              await transporter
                .sendMail(
                  templateChangePasswordCode({
                    code: String(random_code),
                    email: req.body.email,
                  })
                )
                .then(() => {
                  res.cookie(
                    "code_Email_Change_Email",
                    { code: hashed_random_code, email: hashed_email },
                    {
                      maxAge: 2 * 60 * 1000,
                      httpOnly: true,
                    }
                  );
                  res.json({
                    message: "کد برای ایمیل شما ارسال شد",
                  });
                })
                .catch((err: any) => {
                  res.status(500).send(err);
                });
            } else {
              res.status(404).json({
                message: "کاربری پیدا نشد",
              });
            }
          } else {
            res.status(422).json({
              message: "درخواست شما باید شامل یک ایمیل معتبر باشد",
            });
          }
        } else {
          res.status(409).json({
            message: "آدرس ایمیل قبلا ثبت شده",
          });
        }
      } else {
        res.status(409).json({
          message: "دو دقیقه دیگر امتحان کنید",
        });
      }
    } else if (action === "verify") {
      if (req.cookies.code_Email_Change_Email) {
        if (req.body.email) {
          const validate_email = await bcrypt.compare(
            String(req.body.email),
            String(req.cookies.code_Email_Change_Email.email)
          );
          if (validate_email === true) {
            const validate_code = await bcrypt.compare(
              String(req.body.code_Email),
              String(req.cookies.code_Email_Change_Email.code)
            );
            if (validate_code === true) {
              await userModel
                .findOneAndUpdate(
                  { _id: token.id },
                  { email: req.body.email },
                  { new: true, fields: { password: 0 } }
                )
                .lean()
                .then((response: user) => {
                  res.json({
                    message: "آدرس ایمیل با موفقیت تغیر کرد",
                    data: response,
                  });
                })
                .catch((err: any) => {
                  res.status(500).send(err);
                });
            } else {
              res.status(401).json({
                message: "کد نا معتبر",
              });
            }
          } else {
            res.status(401).json({
              message: "آدرس ایمیل با آدرس تایید شده اولیه برابر نیست",
            });
          }
        } else {
          res.status(422).json({
            message: "درخواست شما باید شامل یک ایمیل معتبر باشد",
          });
        }
      } else {
        res.status(401).json({
          message: "مدت کد تایید تمام شده است",
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const change_phone = async (req: Request, res: Response) => {
  const { action } = req.params;
  const token = await jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload

  if (action === "get") {
    const limit = checkRateLimit(String(req.ip));
    if (limit) {
      if (
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(
          req.body.phone
        ) === true
      ) {
        const user_by_phone = await userModel
          .findOne({
            phone: req.body.phone,
          })
          .lean();
        if (!user_by_phone) {
          await axios(
            configs({ phone: req.body.phone, code: String(random_code) })
          )
            .then(async () => {
              const hashed_phone = await bcrypt.hash(
                String(req.body.phone),
                11
              );
              const hashed_random_code = await bcrypt.hash(
                String(random_code),
                11
              );
              res.cookie(
                "code_sms_Change_phone",
                { code: hashed_random_code, phone: hashed_phone },
                {
                  maxAge: 2 * 60 * 1000,
                  httpOnly: true,
                }
              );
              res.json({
                message: "کد برای شماره تلفن شما ارسال شد",
              });
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        } else {
          res.status(409).json({
            message: "شماره تلفن قبلا ثبت شده",
          });
        }
      } else {
        res.status(422).json({
          message: "درخواست شما باید شامل شماره تلفن معتبر باشد",
        });
      }
    } else {
      res.status(403).json({
        message: "دو دقیقه دیگر امتحان کنید",
      });
    }
  } else if (action === "verify") {
    if (req.cookies.code_sms_Change_phone) {
      if ((req.body.phone, req.body.code)) {
        const validate_phone = await bcrypt.compare(
          String(req.body.phone),
          String(req.cookies.code_sms_Change_phone.phone)
        );
        const validate_code = await bcrypt.compare(
          String(req.body.code),
          String(req.cookies.code_sms_Change_phone.code)
        );
        if (validate_phone) {
          if (validate_code) {
            await userModel
              .findOneAndUpdate(
                { _id: token.id },
                { phone: req.body.phone },
                { new: true, fields: { password: 0 } }
              )
              .lean()
              .then((response: user) => {
                res.json({
                  message: "شماره تلفن تغیر کرد",
                  data: response,
                });
              })
              .catch((err: any) => {
                res.status(500).send(err);
              });
          } else {
            res.status(401).json({
              message: "کد نامعتبر است",
            });
          }
        } else {
          res.status(401).json({
            message: "شماره تلفن شما با شماره تلفن تایید شده یکی نیست",
          });
        }
      } else {
        res.status(422).json({
          message: "درخواست شما باید شامل شماره و کد تایید باشد",
        });
      }
    }
  } else {
    res.status(401).json({
      message: "مدت تغیر کد شماره شما تمام شده مجددا تلاش کنید",
    });
  }
};
export const change_user_information = async (req: Request, res: Response) => {
  try {
    const token = await jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload
    const validate_req_data = await validate_user(req.body);

    if (validate_req_data === true) {
      await userModel
        .findOneAndUpdate(
          { _id: token.id },
          {
            name: req.body.name,
            lastname: req.body.lastname,
            address: req.body.address,
          },
          { new: true, fields: { password: 0 } }
        )
        .lean()
        .then((response: user) => {
          res.json({
            message: "اطلاعات هویتی شما با موفقیت تغییر کرد",
            data: response,
          });
        })
        .catch((err: any) => {
          res.status(500).send(err);
        });
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل گذرواژه با 8 رقم باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
