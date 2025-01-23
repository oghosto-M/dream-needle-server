const jwt = require("jsonwebtoken");
const userModle = require("./../models/users/userModel");
require("dotenv").config();

async function authorization(req, res, next) {
  if (req.cookies.token) {
    const token = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);    
    if (token) {
      const user = await userModle.findById(token.id).lean();      
      if (user) {
        next();
      } else {
        res.status(403).json({
          message: "اجازه دست رسی به این بخش را ندارید 1",
        });
      }
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید2",
      });
    }
  } else {
    res.status(403).json({
      message: "شما وارد نیستید",
      is_login : false
    });
  }
}

module.exports = authorization;
