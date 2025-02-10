// dependensies : user , copen , discount , product

import { Request, Response } from "express"
import mongoose from "mongoose"
import { CustomJwtPayload } from "../../type"
import jwt from "jsonwebtoken"
import "../../models/products/productModel";  
import "../../models/coupons/couponModel";
import "../../models/users/userModel";     
import "../../models/carts/cartModel";    
import productModel from "../../models/products/productModel";
import couponModel from "../../models/coupons/couponModel";
import userModel from "../../models/users/userModel";
import cartModel from "../../models/carts/cartModel";
require("dotenv").config();




const secretKey = process.env.SECRET_KEY || "";

export const get_all_cart = async (req: Request, res: Response) => {
    const token = jwt.verify(
        req.cookies.token,
        secretKey,
    ) as CustomJwtPayload;

    const page = parseInt(String(req.query.page)) || 1;
    const limit = 10;
    const query: Partial<Record<string, any>> = { user: token.id };
    const carts = await cartModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate([
            { path: "user"},
            { path: "product"},
            { path: "cart_coupon"}
          ]).lean();
    try {

        const count = await cartModel.countDocuments(query);
        res.json({
            count_carts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            carts,
        });
    } catch (err) {
        res.status(500).send(err);
    }
}
export const create_cart = async (req: Request, res: Response) => {
    try {
        const token = jwt.verify(
            req.cookies.token,
            secretKey,
        ) as CustomJwtPayload;
        const is_valid_product = mongoose.Types.ObjectId.isValid(req.body.product)
        if (is_valid_product === true) {
            const product = await productModel.findById(req.body.product)
            const user = await userModel.findById(token.id)
            if (product && user) {
                if (product.count_available > 0) {
                    const is_cart_product = await cartModel.findOne({ product: req.body.product }).lean()
                    if (!is_cart_product) {
                        const { product } = req.body
                        await cartModel.create({ product, user: token.id }).then(() => {
                            res.json({
                                message: "با موفقیت به سبد خرید اضافه شد"
                            })
                        }).catch((err) => {
                            res.status(500).send(err)
                        })
                    } else {
                        res.status(401).json({
                            message: "شما قبلا این محصول را به سبد خرید اضافه کردید"
                        })
                    }
                } else {
                    res.status(401).json({
                        message: "موجودی این محصول در انبار تمام شده"
                    })
                }
            } else {
                res.status(404).json({
                    message: "محصول یا کاربر مورد نظر یافت نشد",
                })
            }
        } else {
            res.status(422).json({
                message: "لطفا شناسه محصول معتبر وارد کنید"
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
export const update_cart_one = async (req: Request, res: Response) => {
    try {
        const token = jwt.verify(
            req.cookies.token,
            secretKey,
        ) as CustomJwtPayload;
        const cart = await cartModel.findById(req.params.id)
        if (cart?.user.toString() === token.id.toString()) {
            const product = await productModel.findById(cart?.product)
            if (product) {
                if (req.body.count) {
                    if (product?.count_available >= req.body.count) {
                        if (req.body.coupon) {
                            const coupon = await couponModel.findOne({ _id: req.body.coupon })
                            if (coupon) {
                                if (coupon.user.toString() === token.id.toString()) {
                                    if (coupon.end_date && coupon.used_count != null && coupon.usage_limit != null) {
                                        const now_date = new Date()
                                        const end_date = new Date(coupon.end_date)
                                        if (now_date < end_date) {
                                            if (coupon.used_count >= coupon.usage_limit) {
                                                await cartModel.updateOne({ _id: req.params.id }, { count_order: req.body.count, cart_coupon: req.body.coupon }).then(() => {
                                                    res.json({
                                                        message: "به روز رسانی تعداد محصول انجام شد",
                                                    })
                                                }).catch((err) => {
                                                    res.status(500).send(err)
                                                })
                                            } else {
                                                res.status(401).json({
                                                    message: "شما حداکثر این کوگن رو استفاده کردید"
                                                })
                                            }
                                        } else {
                                            res.status(401).json({
                                                message: "زمان استفاده از این کوپن منقضی شده است"
                                            })
                                        }
                                    } else {
                                        res.status(500).json({
                                            message: "خطای سرور شناسایی شد لطفا با پشتیبانی تماس بگیرید"
                                        })
                                    }
                                } else {
                                    res.status(403).json({
                                        message: "شما اجازه دست رسی به توکن رو ندارید"
                                    })
                                }
                            } else {
                                res.status(404).json({
                                    message: "کوپن مورد نظر شما یافت نشد"
                                })
                            }
                        } else {
                            await cartModel.updateOne({ _id: req.params.id }, { count_order: req.body.count }).then(() => {
                                res.json({
                                    message: "به روز رسانی تعداد محصول انجام شد",
                                })
                            }).catch((err) => {
                                res.status(500).send(err)
                            })
                        }
                    } else {
                        res.status(401).json({
                            message: "مقدار موجودی کالا مورد نظر شما وجود ندارد"
                        })
                    }
                } else {
                    res.status(422).json({
                        message: "درخواست شما باید شامل تعداد مشخصی از محصول باشد"
                    })
                }
            } else {
                res.status(404).json({
                    message: "محصول شما یافت نشد"
                })
            }
        } else {
            res.status(403).json({
                message: "شما اجازه دست رسی به این  قسمت را ندارید"
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
export const delete_cart = async (req: Request, res: Response) => {
    try {
        const token = jwt.verify(
            req.cookies.token,
            secretKey,
        ) as CustomJwtPayload;
        const cart = await cartModel.findById(req.params.id)
        if (cart) {
            if (cart?.user.toString() === token.id.toString()) {
                await cartModel.deleteOne({ _id: req.params.id }).then(() => {
                    res.json({
                        message: "سبد خرید شما با موفقیت به روزرسانی شد"
                    })
                }).catch((err) => {
                    res.status(500).send(err)
                })
            } else {
                res.status(403).json({
                    message: "اجازه دست رسی به این بخش را ندارید",
                });
            }
        } else {
            res.status(404).json({
                message: "محصول شما یافت نشد",
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
}
export const delete_all_cart = async (req: Request, res: Response) => {
    try {
        const token = jwt.verify(
            req.cookies.token,
            secretKey,
        ) as CustomJwtPayload;
        await cartModel.deleteMany({ user: token.id }).then(() => {
            res.json({
                message: "سبد خرید شما با موفقیت به روزرسانی شد"
            })
        }).catch((err) => {
            res.status(500).send(err)
        })
    } catch (err) {
        res.status(500).send(err)
    }
} 