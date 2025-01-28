const express = require("express");
const userRouter = express.Router();
const authorizationUser = require("./../../middleware/authorizationUser");
const userInformation = require("./../../controller/user/getInformation");
const userChangeInformation = require("./../../controller/user/changeInfo");

userRouter.get("/is_login", userInformation.getInfo);
userRouter.get("/logout", userInformation.logOut);

userRouter.post(
  "/change_user_information",
  authorizationUser,
  userChangeInformation.change_user_information
);

userRouter.post(
  "/change_password_with_email/:action",
  authorizationUser,
  userChangeInformation.change_password_with_email
);
userRouter.post(
  "/change_password_with_password",
  authorizationUser,
  userChangeInformation.change_password_with_password
);

userRouter.post(
  "/change_email/:action",
  authorizationUser,
  userChangeInformation.change_email
);

userRouter.post(
  "/change_phone/:action",
  authorizationUser,
  userChangeInformation.change_phone
);

module.exports = userRouter;
