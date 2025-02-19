import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "./../../models/users/userModel";
import { CustomJwtPayload } from "../../type";
require("dotenv").config();

const secretKey = process.env.SECRET_KEY || "";

export const getInfo = async (req: Request, res: Response) => {
  try {
    const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload;
    if (token) {
      const user = await userModel.findById(token.id, "-password").lean();
      if (user) {
        res.json({
          message: "شما لاگین هستید",
          is_login: true,
          data: user,
        });
      } else {
        res.status(404).json({
          message: "کاربر با این مشخصات پیدا نشد",
        });
      }
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const logOut = async (req: Request, res: Response) => {
  try {
    const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload;
    if (token) {
      const user = await userModel.findById(token.id, "-password").lean();
      if (user) {
        res.clearCookie("token");
        res.json({
          message: "با موفقیت خارج شدید",
          is_login: false,
        });
      } else {
        res.status(404).json({
          message: "کاربر با این مشخصات پیدا نشد",
        });
      }
    } else {
      res.status(403).json({
        message: "اجازه دست رسی به این بخش را ندارید",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const is_admin = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secretKey) as { id: string };
      const user = await userModel.findById(decoded.id).lean();
      if (user) {
        if (![0, 1, 2].includes(user.role)) {
          res.status(403).json({
            message: "اجازه دسترسی ندارید"
          });
        } else {
          res.json({ message: "با موفقیت وارد شدید" , is_admin : true });
        }
      } else {
        res.status(404).json({
          message: "کاربری با این شناسه پیدا نشد"
        });
      }
    } else {
      res.status(403).json({
        message: "توکن معتبر ارسال نشده است"
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const is_user = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secretKey) as { id: string };
      const user = await userModel.findById(decoded.id).lean();
      if (user) {
          res.json({ message: "با موفقیت وارد شدید" , is_user : true });
      } else {
        res.status(404).json({
          message: "کاربری با این شناسه پیدا نشد"
        });
      }
    } else {
      res.status(403).json({
        message: "توکن معتبر ارسال نشده است"
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
export const editUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await userModel.findById(req.params.id, "-password");
  const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload;
  if (user) {
    if (user.role <= token.role) {
      res.status(403).json({
        message: "اجازه دست رسی به این کاربر را ندارید",
      });
    } else {
      if (
        req.body.name &&
        req.body.lastname &&
        req.body.lastname.length >= 2 &&
        req.body.name.length >= 2
      ) {
        await userModel
          .updateOne(
            { _id: id },
            { name: req.body.name, lastname: req.body.lastname },
          )
          .then(() => {
            res.json({
              message: "نام و نام خانوادگی کاربر با موفقیت تغیر کرد",
            });
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      } else {
        res.status(422).json({
          message: "لطفا نام و نام خانوادگی معتبر وارد کنید",
        });
      }
    }
  } else {
    res.status(404).json({
      message: "کاربر مورد نظر پیدا نشد",
    });
  }
};
export const getAll = async (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page)) || 1;
  const limit = 10;
  const searchTerm = req.query.search_phone || "";
  try {
    const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload;
    const query: Partial<Record<string, any>> = {
      role: { $gte: token.role + 1 },
    };
    if (searchTerm) {
      query.phone = { $regex: searchTerm, $options: "i" };
    }
    const users = await userModel
      .find(query, "-password")
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await userModel.countDocuments(query);
    res.json({
      count_users: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
export const getOne = async (req: Request, res: Response) => {
  const user = await userModel.findById(req.params.id, "-password");
  const token = jwt.verify(req.cookies.token, secretKey) as CustomJwtPayload;
  if (user) {
    if (user.role <= token.role) {
      res.status(403).json({
        message: "اجازه دست رسی به این کاربر را ندارید",
      });
    } else {
      res.json({
        message: "کاربر با موفقیت دریافت شد",
        data: user,
      });
    }
  } else {
    res.status(404).json({
      message: "کابری با این شناسه پیدا نشد",
    });
  }
};
