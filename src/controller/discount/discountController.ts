//dependensies : product 

import { Request, Response } from "express";
import mongoose from "mongoose";
import discountValidator from "./../../validation/discount/discountValidator";
import discountModel from "./../../models/discounts/discountModel";
import productModel from "./../../models/products/productModel";

export const get_all_discount = async (req: Request, res: Response) => {
    try {
        const discounts = await discountModel.find({}).lean()
        res.json({
            message : "تخفیفات با موفقیت دریافت شدند",
            data : discounts
        })
    } catch (err) {
        res.status(500).send(err)
    }
}
export const create_discount = async (req: Request, res: Response) => {
    try {
        const create_db = async () => {
            const { end_date, product, title, active_status, discount_type,
                discount_value } = req.body
            await discountModel.create({
                end_date, product, title, active_status, discount_type,
                discount_value
            }).then(() => {
                res.json({
                    message: "تخفیف شما با موفقیت ثبت شد"
                })
            }).catch((err) => {
                res.status(500).send(err)
            })
        }
        const id_product = mongoose.Types.ObjectId.isValid(req.body.product)
        if (id_product === true) {
            const validate = await discountValidator(req.body)
            if (validate === true) {
                const date_now = new Date()
                const date_new = new Date(req.body.end_date)
                const product = await productModel.findById(req.body.product).lean()
                if (date_now < date_new) {
                    if (product?.price) {
                        if (req.body.discount_type === "percentage" && req.body.discount_value <= 100 && req.body.discount_value >= 0) {
                            create_db()
                        }
                        else if (req.body.discount_type === "toman" && req.body.discount_value <= product?.price && req.body.discount_value >= 10000) {
                            create_db()
                        }
                        else {
                            res.status(422).json(req.body.discount_type === "toman" ? {
                                messgae: "مقدار تخفیف نمیتواند از قیمت محصول بیشتر یا کمتر از 0 باشد"
                            } : {
                                messgae: "درصد تخفیف نمیتواند از 100 بیشتر یا کمتر از 0 باشد"
                            })
                        }
                    } else {
                        res.status(422).json({
                            messgae: "مقدار تخفیف نمیتواند از قیمت محصول بیشتر یا کمتر از 0 باشد"
                        })
                    }

                } else {
                    res.status(422).json({
                        message: "لطفا زمان انقضا تخفیف را بعد از زمان حال وارد کنید"
                    })
                }
            } else {
                res.status(422).json({
                    message: validate[0].message
                })
            }
        } else {
            res.status(422).json({
                message: "لطفا شناسه معتبر وارد کنید"
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
export const update_discount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { active_status, discount_value } = req.body

        const update_db = async () => {
            if (typeof active_status === "boolean" === true) {

                await discountModel.findOneAndUpdate({ _id: id }, {
                    active_status,
                    discount_value,
                }, { new: true }).then((response) => {
                    res.json({
                        message: "تخفیف با موفقیت به روز شد",
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
        if (discount_value) {
            const discount = await discountModel.findById(id).lean()
            if (discount) {
                const product = await productModel.findById(discount.product).lean()
                if (product?.price) {
                    if (discount.discount_type === "percentage" && req.body.discount_value <= 100 && req.body.discount_value >= 0) {
                        update_db()
                    }
                    else if (discount.discount_type === "toman" && req.body.discount_value <= product?.price && req.body.discount_value >= 10000) {
                        update_db()
                    }
                    else {
                        res.status(422).json(req.body.discount_type === "toman" ? {
                            messgae: "مقدار تخفیف نمیتواند از قیمت محصول بیشتر یا کمتر از 0 باشد"
                        } : {
                            messgae: "درصد تخفیف نمیتواند از 100 بیشتر یا کمتر از 0 باشد"
                        })
                    }
                } else {
                    res.status(422).json({
                        messgae: "محصول مورد نظر شما یافت نشد"
                    })
                }
            } else {
                res.status(404).json({
                    message: "کوپن یافت نشد"
                })
            }
        } else {
            res.status(422).json({
                message: "درخواست شما باید مقدار تخفیف معتبر باشد "
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
export const delete_discount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        discountModel.deleteOne({ _id: id }).lean().then(() => {
            res.json({
                message: "تخفیف کاربر با موفقیت حذف شد"
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
    } catch (err) {
        res.status(500).send(err)
    }
}


















