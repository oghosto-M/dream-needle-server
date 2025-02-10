import express from "express";
const cartRouter = express.Router();
import { get_all_cart , create_cart , delete_cart  , update_cart_one, delete_all_cart } from "./../../controller/cart/cartController";
import idMoongoseValidator from "../../middleware/idMoongoseValidator";
import authorizationUser from "../../middleware/authorizationUser";
import limiter from "../../configs/limiter/user/limiterUser";

cartRouter.get("/",authorizationUser , get_all_cart);
cartRouter.post("/",authorizationUser , create_cart);
cartRouter.put("/:id",authorizationUser , idMoongoseValidator ,update_cart_one);
cartRouter.delete("/:id",authorizationUser , idMoongoseValidator ,delete_cart);
cartRouter.delete("/",authorizationUser ,delete_all_cart);


export default cartRouter;
