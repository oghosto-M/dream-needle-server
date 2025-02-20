import { Request, Response } from "express";
import moongose from "mongoose";
import validator from "./../../validation/category/categoryValidator";
import categoryModel from "./../../models/categories/categoryModle";

export const create_category = async (req: Request, res: Response) => {
  try {
    const validation_category = await validator(req.body);
    if (validation_category === true) {
      if (req.body.category_parent) {
        const id_valid = moongose.Types.ObjectId.isValid(
          req.body.category_parent,
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
      res.status(422).json({
        message: validation_category[0].message,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const update_category = async (req: Request, res: Response) => {
  try {
    if (req.body.title && req.body.title.length >= 2 && req.body.description && req.body.description.length >= 2) {
      const id = req.params.id;
      categoryModel
        .updateOne({ _id: id }, { title: req.body.title, description: req.body.description })
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
        message: "نام و توضیحات دسته بندی اجباری است",
      });
    }
  } catch (err) {
    res.status(500).send(500);
  }
};
export const get_all_category = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.find({}).lean();
    res.json({
      message: "دسته بندی های شما با موفقیت دریافت شد",
      data: category,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
export const get_one_category = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.findById(req.params.id).lean();
    res.json({
      message: "دسته بندی با موفقیت دریافت شد",
      data: category,
    });
  } catch (err) {
    res.status(500).send(req.params);
  }
};
export const delete_category = async (req: Request, res: Response): Promise<void> => {
  try {
    async function deleteCategoryAndChildren(categoryId: any): Promise<void> {
      const children = await categoryModel.find({ category_parent: categoryId });

      for (let child of children) {
        await deleteCategoryAndChildren(child._id);
      }

      await categoryModel.findByIdAndDelete(categoryId);
    }

    const categoryExists = await categoryModel.findById(req.params.id);
    if (!categoryExists) {
       res.status(404).json({ message: "دسته‌بندی موردنظر یافت نشد" });
    }

    await deleteCategoryAndChildren(req.params.id);

     res.status(200).json({ message: "دسته‌بندی و تمام زیرمجموعه‌های آن حذف شدند" });
  } catch (err) {
     res.status(500).send(err);
  }
};

