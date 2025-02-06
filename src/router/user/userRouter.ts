import express from "express";
const userRouter = express.Router();

import authorizationManagement from "./../../middleware/authorizationManagement";
import authorizationAdmin from "./../../middleware/authorizationAdmin";
import authorizationCode_0 from "./../../middleware/authorizationCode_0";
import idMoongoseValidator from "./../../middleware/idMoongoseValidator";
import {
  editUser,
  getAll,
  getInfo,
  getOne,
  logOut,
  set_admin,
} from "./../../controller/user/getInformation";
import {
  change_user_information,
  change_password_with_email,
  change_password_with_password,
  change_email,
  change_phone,
} from "./../../controller/user/changeInfo";
import limiter_code_0 from "./../../configs/limiter/user/code_0Limiter";
import authorizationUser from "./../../middleware/authorizationUser";

userRouter.post("/set_admin", limiter_code_0, authorizationCode_0, set_admin);

userRouter.get("/is_login", getInfo);
userRouter.get("/logout", logOut);

// management
userRouter.put("/:id", authorizationManagement, idMoongoseValidator, editUser);
// admin
userRouter.get("/", authorizationAdmin, getAll);
userRouter.get("/:id", authorizationAdmin, idMoongoseValidator, getOne);

userRouter.post(
  "/change_user_information",
  authorizationUser,
  change_user_information,
);
userRouter.post(
  "/change_password_with_email/:action",
  authorizationUser,
  change_password_with_email,
);
userRouter.post(
  "/change_password_with_password",
  authorizationUser,
  change_password_with_password,
);
userRouter.post("/change_email/:action", authorizationUser, change_email);
userRouter.post("/change_phone/:action", authorizationUser, change_phone);

export default userRouter;
