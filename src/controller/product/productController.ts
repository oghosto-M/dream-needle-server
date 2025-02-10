import { Request, Response } from "express";
import productValidator from "./../../validation/product/productValidator";
import mongoose from "mongoose";
import productModel from "./../../models/products/productModel";
import categoryModle from "./../../models/categories/categoryModle";

export const create_product = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const validate = await productValidator(req.body);
      if (validate === true) {
        const vategory_validate = await mongoose.Types.ObjectId.isValid(
          req.body.category,
        );
        const category = await categoryModle.findById(req.body.category).lean()
        if (category) {
          if (category.type.some((i) => i === "product") === true) {
            if (vategory_validate === true) {
              const {
                active_status,
                title,
                category,
                low_description,
                full_description,
                price,
                gallery,
                properties,
                count_available,
                count_purchased,
                comment,
              } = req.body;
              await productModel
              .create({
                title,
                category,
                low_description,
                full_description,
                price,
                gallery,
                properties,
                count_available,
                count_purchased,
                comment,
                active_status,
              })
              .then(() => {
                res.json({
                  message: "محصول با موفقیت ساخته شد",
                });
              })
              .catch((err) => {
                res.status(500).send(err);
              });
            } else {
              res.status(422).json({
                message: "لطفا یک شناسه دسته بندی معتبر وارد کنید",
              });
            }
          }else{
            res.status(401).json({
              message: "این دسته بندی مال محصولات نیست",
            });            
          }
        } else {
          res.status(404).json({
            message: "این دسته بندی یافت نشد",
          });
        }
      } else {
        res.status(422).json({
          message: validate[0].message,
        });
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل مقادیر مورد نیاز باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const get_all_product = async (req: Request, res: Response) => {
  try {
  const page = parseInt(String(req.query.page)) || 1;
  const limit = 10;
  const search_category = req.query.category || "";
  const [minPrice, maxPrice] = String(req.query.price)?.split("_").map(Number);

    const query: Partial<Record<string, any>> = {};

    if (search_category) {
      query.category = new mongoose.Types.ObjectId(String(search_category));
    }
    if (minPrice) {
      query.price = { $lte: maxPrice };
    }
    if (maxPrice) {
      query.price = { $gte: minPrice };
    }
    const products = await productModel
      .find(query, "-full_description -comment")
      .limit(limit)
      .skip((page - 1) * limit)
      .populate([
        {path : "category"},
        {path : "discount"}
      ])
      .lean();
    console.log(products);
    const count = await productModel.countDocuments(query);
    res.json({
      count: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
export const get_one_product = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id).lean();
    if (product) {
      res.json({
        message: "محصول با موفقیت دریافت شد",
        data: product,
      });
    } else {
      res.status(404).json({
        message: "محصول مورد نظر شما وجود ندارد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
