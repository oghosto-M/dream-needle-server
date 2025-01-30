const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("./../../controller/category/category");
const moongose = require("mongoose");
const authorizationUser = require("./../../middleware/authorizationUser");
const authorizationManagement = require("./../../middleware/authorizationManagement");
const authorizationAdmin = require("./../../middleware/authorizationAdmin");
const authorizationCode_0 = require("./../../middleware/authorizationCode_0");
const limiter = require("./../../configs/limiter/user/limiterUser");
const validator = require("./../../validation/category/categoryValidator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const categoryModel = require("./../../models/categories/categoryModle");

categoryRouter.get("/",  async (req, res) => {});

categoryRouter.get("/:id", async (req, res) => {});

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
categoryRouter.delete("/:id", async (req, res) => {});

module.exports = categoryRouter;
