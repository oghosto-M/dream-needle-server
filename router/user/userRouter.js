const express = require("express");
const userRouter = express.Router();
const userModel = require("./../../models/users/userModel");

userRouter.get("/", (req, res) => {});
userRouter.post("/", (req, res) => {
  const { name, lastname, email, phone, role, password } = req.body;
  userModel
    .create({ name, lastname, email, phone, role, password })
    .then(() => {
      res.send("wadawdawdawd");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = userRouter;
