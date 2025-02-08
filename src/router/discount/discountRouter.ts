import express from "express";
const discountRouter = express.Router();
import authorizationManagement from "../../middleware/authorizationManagement";
import idMoongoseValidator from "../../middleware/idMoongoseValidator";
import {
    create_discount,
    get_all_discount,
    delete_discount,
    update_discount
} from "./../../controller/discount/discountController";

discountRouter.get("/", authorizationManagement, get_all_discount);
discountRouter.post("/", authorizationManagement ,create_discount);
discountRouter.put("/:id" ,authorizationManagement, idMoongoseValidator, update_discount);
discountRouter.delete("/:id", authorizationManagement, idMoongoseValidator , delete_discount);

export default discountRouter;
