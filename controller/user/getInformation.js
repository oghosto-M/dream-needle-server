const userModel = require("./../../models/users/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getInfo = async (req, res) => {  
    try {
      const token = jwt.decode(req.cookies.token, process.env.SECRET_KEY);
      if (token) {
        const user = await userModel.findById(token.id , "-password").lean()
        if (user) {
          res.json({
            message: "شما لاگین هستید",
            is_login: true,
            data: user,
          });
        } else {
          res.status(404).json({
            message: "کاربر با این مشخصات پیدا نشد",
          });
        }
      } else {
        res.status(403).json({
          message: "اجازه دست رسی به این بخش را ندارید",
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
}