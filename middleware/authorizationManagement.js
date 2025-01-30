const jwt = require("jsonwebtoken");
const userModle = require("./../models/users/userModel");
require("dotenv").config();

async function authorization(req, res, next) {
  if (req.cookies.token) {
    const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    if (token) {
      const user = await userModle.findById(token.id).lean();
      if (user) {
        if (user.role === 0 || user.role === 1) {
          next();
        } else {
          res.status(403).json({
            message: "اجازه دست رسی به این بخش را ندارید",
          });
        }
      } else {
        res.status(403).json({
          message: "اجازه دست رسی به این بخش را ندارید",
        });
      }
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید",
      });
    }
  } else {
    res.status(403).json({
      message: "اجازه دست رسی به این بخش را ندارید",
    });
  }
}

module.exports = authorization;
