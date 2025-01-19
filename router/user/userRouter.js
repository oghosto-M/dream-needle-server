const express = require("express");
const userRouter = express.Router();
const userModel = require("./../../models/users/userModel");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const authorizationUser = require("./../../middleware/authorizationUser");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 40,
  handler: (req, res) => {
    res.status(429).json({
      message: "در هر دو دقیقه فقط یک بار میتونید درخواست بدید",
    });
  },
});

userRouter.get("/is_login", limiter, authorizationUser, (req, res) => {
  try {
    const token = jwt.decode(req.cookies.token, process.env.SECRET_KEY);
    if (token) {
      res.json({
        message: "شما لاگین هستید",
        is_login: true,
      });
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.post("/changerPassword", authorizationUser, (req, res) => {
  
});

module.exports = userRouter;
