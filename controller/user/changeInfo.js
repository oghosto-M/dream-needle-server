require("dotenv").config();
const userModel = require("./../../models/users/userModel");
const jwt = require("jsonwebtoken");
const transporter = require("../../configs/mail/nodemailer");
const templateLogin = require("../../configs/mail/template/template");
const random_code = require("./../../utils/randomCode");
const bcrypt = require("bcrypt");
const limiter_configuration = require("./../../configs/limiter/checkLimit");
const checkRateLimit = require("./../../configs/limiter/checkLimit");
const smsConfigs = require("./../../configs/sms/sendSms");
const axios = require("axios");

exports.change_password_with_email = async (req, res) => {
  try {
    const { action } = req.params;
    const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    if (action === "get") {
      const limiter = checkRateLimit(req.ip);
      if (limiter) {
        const user = await userModel.findById(token.id).lean();
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
          const hashed_password = await bcrypt.hash(req.body.password, 11);
          await userModel
            .updateOne({ _id: token.id }, { password: hashed_password })
            .then(() => {
              res.json({
                message: "گذرواژه با موفقیت تغییر کرد",
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
};
exports.change_password_with_password = async (req, res) => {
  const token = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);

  if (req.body.password && req.body.prev_password) {
    const user = await userModel.findById(token.id).lean();
    const validate = await bcrypt.compare(
      String(req.body.prev_password),
      String(user.password)
    );
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
          .catch((err) => {
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
    res.status(422).json({
      message: "درخواست شما باید شامل گذرواژه قدیمی و جدید باشد",
    });
  }
};
exports.change_email = async (req, res) => {
  const { action } = req.params;
  const token = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);
  const user_by_email = await userModel
    .findOne({ email: req.body.email })
    .lean();

  if (action === "get") {
    const limit = limiter_configuration(req.ip);
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
            const hashed_email = await bcrypt.hash(String(req.body.email), 11);
            await transporter
              .sendMail(
                templateLogin.templateChangePasswordCode({
                  code: random_code,
                  email: user.email,
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
              .catch((err) => {
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
  } else if (action === "varify") {
    if (req.body.email) {
      const validate_email = await bcrypt.hash(
        String(req.body.email),
        String(req.cookies.code_Email_Change_Email.email)
      );
      if (validate_email) {
        const validate_code = await bcrypt.hash(
          String(req.body.code_Email),
          String(req.cookies.code_Email_Change_Email.email)
        );
        if (validate_code) {
          userModel
            .findOneAndUpdate(
              { _id: token.id },
              { email: req.body.email },
              { new: true, fields: { password: 0 } }
            )
            .lean()
            .then((response) => {
              res.json({
                message: "آدرس ایمیل با موفقیت تغیر کرد",
                data: response,
              });
            })
            .catch((err) => {
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
  }
};
exports.change_phone = async (req, res) => {
  const { action } = req.params;
  const token = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);

  if (action === "get") {
    const limit = checkRateLimit(req.ip);
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
            smsConfigs.configs({ phone: req.body.phone, code: random_code })
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
              .then((response) => {
                res.json({
                  message: "شماره تلفن تغیر کرد",
                  data: response,
                });
              })
              .catch((err) => {
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
