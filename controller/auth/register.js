const userModel = require("./../../models/users/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validate_register = require("./../../validation/auth/registerValidate");



exports.register = async (req, res) => {
    try {
      const validate_req_data = await validate_register(req.body);
  
      if (validate_req_data === true) {
        const user_email = await userModel
          .findOne({ email: req.body.email })
          .lean();
        const user_phone = await userModel
          .findOne({ phone: req.body.phone })
          .lean();
        console.log("by email", user_email);
        console.log("by phone", user_phone);
  
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
                phone_verify: false,
                email_verify: false,
              })
              .then(async (response) => {
                const token = await jwt.sign(
                  { id: response.id, role: response.role },
                  process.env.SECRET_KEY,
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
                  message: "با موفقیت ثبت نام شدید",
                });
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
    } catch (err) {
      res.status(500).send(err);
    }
}