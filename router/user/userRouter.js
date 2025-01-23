const express = require("express");
const userRouter = express.Router();
const authorizationUser = require("./../../middleware/authorizationUser");
const userInformation = require("./../../controller/user/getInformation");
const userChangeInformation = require("./../../controller/user/changeInfo");
const limiter = require("../../configs/limiter/auth/limiterAuth");

userRouter.get("/is_login", userInformation.getInfo);

userRouter.post(
  "/change_password_with_email/:action",
  limiter,
  authorizationUser,
  userChangeInformation.change_password_with_email
);
userRouter.post(
  "/change_password_with_password",
  limiter,
  authorizationUser,
  userChangeInformation.change_password_with_password
);

userRouter.post(
  "/change_email/:action",
  limiter,
  authorizationUser,
  userChangeInformation.change_email
);

userRouter.post(
  "/change_phone/:action",
  authorizationUser,
  userChangeInformation.change_phone
);

module.exports = userRouter;
