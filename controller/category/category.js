const moongose = require("mongoose");
const validator = require("./../../validation/category/categoryValidator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const categoryModel = require("./../../models/categories/categoryModle");

exports.create_category = async (req, res) => {
  try {
    const validation_category = await validator(req.body);
    if (validation_category === true) {
      if (req.body.category_parent) {
        const id_valid = moongose.Types.ObjectId.isValid(
          req.body.category_parent
        );
        if (id_valid === true) {
          const { type, category_parent, title, description } = req.body;
          await categoryModel
            .create({ type, category_parent, title, description })
            .then(() => {
              res.json({
                message: "دسته بندی شما با موفقیت ثبت شد",
              });
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        } else {
          res.status(422).json({
            message: "لطفا شناسه معتبر وارد کنید",
          });
        }
      } else {
        const { type, title, description } = req.body;
        await categoryModel
          .create({ type, category_parent: null, title, description })
          .then(() => {
            res.json({
              message: "دسته بندی شما با موفقیت ثبت شد",
            });
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    } else {
      res.json({
        message: validation_category[0],
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.update_category = async (req, res) => {
  try {
    if (req.body.title && req.body.title.length >= 2) {
      const id = req.params.id;
      categoryModel
        .updateOne({ _id: id }, { title: req.body.title })
        .then(() => {
          res.json({
            message: "نام دسته بندی با موفقیت تغیر کرد",
          });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } else {
      res.status(422).json({
        message: "نام دسته بندی اجباری است",
      });
    }
  } catch (err) {
    res.status(500).send(500);
  }
};
