import { Request, Response } from "express";
import { user } from "../../type";

import userModel from "./../../models/users/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate_register from "./../../validation/auth/registerValidate";
import { configs } from "../../configs/sms/sendSms";
import transporter from "../../configs/mail/nodemailer";
import axios from "axios";

require("dotenv").config();
const secretKey = process.env.SECRET_KEY || "";

export const register_sendCode_phone = async (req: Request, res: Response) => {
  try {
    if (
      req.body.phone &&
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(req.body.phone) === true
    ) {
      const random_code = Math.floor(10000 + Math.random() * 90000);
      const hashed_random_code = await bcrypt.hash(String(random_code), 11);
      const user = await userModel.findOne({ phone: req.body.phone }).lean();

      if (!user) {
       await axios(
          configs({ phone: req.body.phone, code: String(random_code) }),
        )
          .then(() => {
            res.cookie("code_phone_register", {code : hashed_random_code , phone : req.body.phone}, {
              maxAge: 2 * 60 * 1000,
              httpOnly: true,
            });
            res.json({
              message: "کد برای تلفن شما ارسال شد",
            });
          });
      } else {
        res.status(401).json({
          message: "کاربری با این شماره تلفن قبلا ثبت شده",
        });
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل شماره تلفن معتبر باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const verify_register_phone = async (req: Request, res: Response) => {
  try {
    const cookie_phone = req.cookies.code_phone_register
    if (
      req.body.phone &&
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(req.body.phone) === true
    ) {
      if (req.body.phone === cookie_phone.phone) {
        if (req.body.code?.length === 5) {
          
          const code_validate = await bcrypt.compare(req.body.code , cookie_phone.code)
          if (code_validate  === true) {
            if (req.body.password &&  req.body.password.length >= 8) {
          const hashed_password = await bcrypt.hash(req.body.password , 11)

              await userModel.create({
                name : "نام ثبت نشده",
                lastname :"نام خانوادگی ثبت نشده",
                phone : req.body.phone,
                email : "آدرس ایمیل ثبت نشده",
                password : hashed_password,
                email_verify : false,
                phone_verify : true ,
                address : "محل سکونت مشخصی ثبت نشده",
                role : 3
              }).then(()=>{
                res.json({
                  message : "ثبت نام شما با موفقیت انجام شد"
                })
              }).catch((err)=>{
                res.status(500).send(err)
              })
            }else{
              res.status(422).json({
                message: "درخواست شما باید شامل گذرواژه 8 رقمی باشد",
              });
            }
          } else {
            res.status(401).json({
              message: "کد نامعتبر است",
            });
          }
        }else{
          res.status(422).json({
            message: "درخواست شما باید شامل کد تایید پنج رقمی باشد",
          });
        }
      }else{
        res.status(422).json({
          message: "شماره تلفن شما با شماره تلفن اولیه برابر نیست",
        });
      }
    } else {
      res.status(422).json({
        message: "درخواست شما باید شامل شماره تلفن معتبر باشد",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};