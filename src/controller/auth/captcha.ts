import { Request, Response } from "express";
const Captcha = require("node-captcha-generator");
import bcrypt from "bcrypt"
import userModel from "./../../models/users/userModel";

// code captcha
export const get = async (req:Request, res:Response) => {
  try {
    const c = new Captcha({
      length: 4,
      size: {
        width: 100,
        height: 50,
      },
    });
    await c.toBase64(async (err:any, base64:string) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.cookie("valueCode", bcrypt.hashSync(c.value, 11), {
          maxAge: 7 * 60 * 1000,
          httpOnly: true,
        });
        res.json({
          message: "دریافت کد امنیتی با موفقیت انجام شد",
          src: base64,
          value: c.value,
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
export const validate = async (req:Request, res:Response) => {
  try {
    if (req.cookies.valueCode) {
      if (req.body?.valueCode && req.body?.phone) {
        const data = await bcrypt.compare(
          String(req.body.valueCode),
          String(req.cookies.valueCode)
        );
        const user = await userModel.findOne({ phone: req.body.phone }).lean();        
        if (data) {
          res.clearCookie("valueCode");
          res.cookie("captcha" , user ? user.phone : "no_value" , {
            maxAge: 7 * 60 * 1000,
            httpOnly: true,
          });
          res.json({
            message: "کد امنیتی معتبر است",
            is_new: !user,
          });
        } else {
          res.status(401).json({
            message: "کد امنیتی معتبر نیست",
          });
        }
      } else {
        res.status(422).json({
          message: "درخواست شما باید شامل کد امنیتی و شماره موبایل باشد",
        });
      }
    } else {
      res.status(401).json({
        message: "مدت کد امنیتی تمام شده دوباره درخواست بدید",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

