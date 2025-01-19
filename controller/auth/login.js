require("dotenv").config();
const userModel = require("./../../models/users/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginWithPassword = async (req, res) => {
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
