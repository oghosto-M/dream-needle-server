//dependensies : product 

import { Response, Request } from "express";
import couponValidate from "./../../validation/coupon/couponValidate";
import couponModel from "./../../models/coupons/couponModel";
import productModel from "./../../models/products/productModel";
import userModel from "./../../models/users/userModel";
import mongoose from "mongoose";

export const get_all_coupon = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};
export const get_one_coupon = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};
export const create_coupon = async (req: Request, res: Response) => {
  const create_db = async () => {

    const { active_status, user, product, coupon_type, coupon_value, used_count, usage_limit, end_date } = req.body
    await couponModel.create({
      active_status,
      user,
      product,
      coupon_type,
      coupon_value,
      used_count,
      usage_limit,
      end_date,
    }).then(() => {
      res.json({
        message: "تخفیف کاربر با موفقیت ساخته شد"
      })
    }).catch((err) => {
      res.status(500).send(err)
    })

  }
  try {
    if (req.body.user && req.body.product) {
      const validate = await couponValidate(req.body)
      if (validate === true) {
        const id_user = mongoose.Types.ObjectId.isValid(req.body.user)
        const id_produc = mongoose.Types.ObjectId.isValid(req.body.product)
        if (id_user === true && id_produc === true) {
          if (req.body.product) {
            const product = await productModel.findById(req.body.product).lean()
            const user = await userModel.findById(req.body.user).lean()
            if (product?.price && user) {
              if (req.body.coupon_type === "percentage" && req.body.coupon_value <= 100 && req.body.coupon_value >= 0) {
                create_db()
              }
              else if (req.body.coupon_type === "toman" && req.body.coupon_value <= product?.price && req.body.coupon_value >= 10000) {
                create_db()
              }
              else {
                res.status(422).json(req.body.coupon_type === "toman" ? {
                  messgae: "مقدار تخفیف نمیتواند از قیمت محصول بیشتر یا کمتر از 0 باشد"
                } : {
                  messgae: "درصد تخفیف نمیتواند از 100 بیشتر یا کمتر از 0 باشد"
                })
              }
            } else {
              res.status(422).json({
                messgae: "محصول یا کاربر مورد نظر شما یافت نشد"
              })
            }
          } else {
            res.status(422).json({
              messgae: "شناسه محصول یک فیلد اجباری است"
            })
          }
        } else {
          res.status(422).json({
            messgae: "شناسه محصول یا کاربر باید معتبر باشد"
          })
        }
      } else {
        res.status(422).json({
          messgae: validate[0].message,
          msg: req.body
        })
      }
    } else {
      res.status(422).json({
        messgae: "درخواست شما باید شامل شناسه کاربر و شناسه محصول باشد"
      })
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const update_one_coupen = async (req: Request, res: Response) => {
  const { id } = req.params
  const { active_status, coupon_value } = req.body

  const update_db = async () => {
    if (typeof active_status === "boolean" === true) {

      await couponModel.findOneAndUpdate({ _id: id }, {
        active_status,
        coupon_value,
      }, { new: true }).then((response) => {
        res.json({
          message: "تخفیف کاربر با موفقیت به روز شد",
          data: response
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
    } else {
      res.status(422).json({
        message: "وضعیت فعال بودن را درست وارد کنید"
      })
    }
  }
  try {
    if (active_status && coupon_value) {
      const coupon = await couponModel.findById(id).lean()
      if (coupon) {
        const product = await productModel.findById(coupon.product).lean()
        const user = await userModel.findById(coupon.user).lean()
        if (product?.price && user) {
          if (coupon.coupon_type === "percentage" && req.body.coupon_value <= 100 && req.body.coupon_value >= 0) {
            update_db()
          }
          else if (coupon.coupon_type === "toman" && req.body.coupon_value <= product?.price && req.body.coupon_value >= 10000) {
            update_db()
          }
          else {
            res.status(422).json(req.body.coupon_type === "toman" ? {
              messgae: "مقدار تخفیف نمیتواند از قیمت محصول بیشتر یا کمتر از 0 باشد"
            } : {
              messgae: "درصد تخفیف نمیتواند از 100 بیشتر یا کمتر از 0 باشد"
            })
          }
        } else {
          res.status(422).json({
            messgae: "محصول یا کاربر مورد نظر شما یافت نشد"
          })
        }
      } else {
        res.status(404).json({
          message: "کوپن یافت نشد"
        })
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید مقدار تخفیف و وضعیت تخفیف معتبر باشد "
      })
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const delete_one_coupen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    couponModel.deleteOne({ _id: id }).lean().then(() => {
      res.json({
        message: "تخفیف کاربر با موفقیت حذف شد"
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  } catch (err) {
    res.status(500).send(err);
  }
};
