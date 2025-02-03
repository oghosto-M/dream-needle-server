import express from "express";
const userRouter = express.Router();
const authorizationManagement = require("./../../middleware/authorizationManagement");
const authorizationAdmin = require("./../../middleware/authorizationAdmin");
const authorizationCode_0 = require("./../../middleware/authorizationCode_0");
const idMoongoseValidator = require("./../../middleware/idMoongoseValidator");
const userInformation = require("./../../controller/user/getInformation");
const userChangeInformation = require("./../../controller/user/changeInfo");
const limiter_code_0 = require("./../../configs/limiter/user/code_0Limiter");

userRouter.post(
  "/set_admin",
  limiter_code_0,
  authorizationCode_0,
  userInformation.set_admin
);

userRouter.get("/is_login", userInformation.getInfo);
userRouter.get("/logout" , userInformation.logOut);

// management
userRouter.put(
  "/:id",
  authorizationManagement,
  idMoongoseValidator,
  userInformation.editUser
);
// admin
userRouter.get("/", authorizationAdmin, userInformation.getAll);
userRouter.get(
  "/:id",
  authorizationAdmin,
  idMoongoseValidator,
  userInformation.getOne
);

userRouter.post(
  "/change_user_information",
  userChangeInformation.change_user_information
);
userRouter.post(
  "/change_password_with_email/:action",
  userChangeInformation.change_password_with_email
);
userRouter.post(
  "/change_password_with_password",
  userChangeInformation.change_password_with_password
);
userRouter.post(
  "/change_email/:action",
  userChangeInformation.change_email
);
userRouter.post(
  "/change_phone/:action",
  userChangeInformation.change_phone
);

export default userRouter;
