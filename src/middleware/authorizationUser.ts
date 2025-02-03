import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "./../models/users/userModel";
import { CustomJwtPayload } from "../type";
require("dotenv").config();


async function authorization(req: Request, res: Response, next: NextFunction) {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({
      message: "تنظیمات سرور به درستی پیکربندی نشده است.",
    });
  }
  if (req.cookies.token) {
    const token = await jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload
    if (token) {
      const user = await userModel.findById(token.id).lean();
      if (user) {
        next();
      } else {
        res.status(403).json({
          message: "اجازه دست رسی به این بخش را ندارید 1",
        });
      }
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید2",
      });
    }
  } else {
    res.status(403).json({
      message: "شما وارد نیستید",
      is_login: false,
    });
  }
}

export default authorization;
