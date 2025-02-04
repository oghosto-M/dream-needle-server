import express from "express";
const categoryRouter = express.Router();
import {get_all_category , create_category , get_one_category , update_category} from "../../controller/category/category";
import authorizationManagement from "../../middleware/authorizationManagement";
import idMoongoseValidator from "../../middleware/idMoongoseValidator";
import limiter from "../../configs/limiter/user/limiterUser";


categoryRouter.get("/", get_all_category);
categoryRouter.get("/:id", idMoongoseValidator ,  get_one_category);

categoryRouter.post(
  "/",
  limiter,
  authorizationManagement,
  create_category
);
categoryRouter.put(
  "/:id",
  idMoongoseValidator ,
  authorizationManagement,
  update_category
);
categoryRouter.delete("/:id");

export default categoryRouter;
