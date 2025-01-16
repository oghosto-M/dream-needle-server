const express = require("express");
const userModel = require("./../../models/users/userModel");
const captcha = require("./../../controller/auth/captcha");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// code captcha
authRouter.get("/captcha", captcha.get);
authRouter.post("/captcha", captcha.validate);

// register

// authRouter.post("/register", );

module.exports = authRouter;
