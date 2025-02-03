import express from "express";
const categoryRouter = express.Router();
import categoryController from "../../controller/category/category";
import authorizationManagement from "../../middleware/authorizationManagement";
import limiter from "../../configs/limiter/user/limiterUser";


categoryRouter.get("/",categoryController.get_all_category);
categoryRouter.get("/:id",categoryController.get_one_category);

categoryRouter.post(
  "/",
  limiter,
  authorizationManagement,
  categoryController.create_category
);
categoryRouter.put(
  "/:id",
  authorizationManagement,
  categoryController.update_category
);
categoryRouter.delete("/:id");

export default categoryRouter;
