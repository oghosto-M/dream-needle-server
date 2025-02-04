import express from "express";
const productRouter = express.Router();
import authorizationManagement from "../../middleware/authorizationManagement";
import idMoongoseValidator from "../../middleware/idMoongoseValidator";
import { create_product , get_all_product , get_one_product} from "./../../controller/product/productController";

productRouter.get("/", get_all_product);
productRouter.get("/:id", idMoongoseValidator , get_one_product);
productRouter.post("/", authorizationManagement, create_product);



export default productRouter;
