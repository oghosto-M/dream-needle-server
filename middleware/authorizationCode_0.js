const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModle = require("./../models/users/userModel");
require("dotenv").config();

async function authorization(req, res, next) {
  if (req.cookies.token) {
    const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    if (token) {
      const user = await userModle.findById(token.id).lean();      
      if (token.role == 0) {
        if (user) {
          if (user.role == 0) {
            if (req.body.phone === user.phone) {
              if (user.phone === process.env.CODE_0) {                
                const validate_phone = await bcrypt.compare(
                  String(req.body.password),
                  String(user.password)
                );
                
                if (validate_phone === true) {
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
