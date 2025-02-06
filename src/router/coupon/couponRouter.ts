import express from "express";
const couponRouter = express.Router();
import authorizationManagement from "../../middleware/authorizationManagement";
import authorizationUser from "../../middleware/authorizationUser";
import idMoongoseValidator from "../../middleware/idMoongoseValidator";
import {
  create_coupon,
  get_all_coupon,
  get_one_coupon,
  delete_one_coupen,
  update_one_coupen,
} from "./../../controller/coupon/couponController";

couponRouter.get("/",authorizationUser ,get_all_coupon);
couponRouter.get("/:id", authorizationUser , idMoongoseValidator, get_one_coupon);
couponRouter.post("/", authorizationManagement, create_coupon);
couponRouter.put("/:id", authorizationManagement, idMoongoseValidator, update_one_coupen);
couponRouter.delete("/:id", authorizationManagement, idMoongoseValidator, delete_one_coupen);

export default couponRouter;
