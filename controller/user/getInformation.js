const userModel = require("./../../models/users/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getInfo = async (req, res) => {
  try {
    const token = jwt.decode(req.cookies.token, process.env.SECRET_KEY);
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
exports.logOut = async (req, res) => {
  try {
    const token = jwt.decode(req.cookies.token, process.env.SECRET_KEY);
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
exports.set_admin = async (req, res) => {
  try {
    const token = jwt.decode(req.cookies.token, process.env.SECRET_KEY);
    if (token) {
      const user = await userModel.findById(token.id, "-password").lean();
      if (user) {
        if (
          req.body.phone_admin &&
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(
            req.body.phone_admin
          )
        ) {
          if (req.body.role) {
            if (
              req.body.role === 1 ||
              req.body.role === 2 ||
              req.body.role === 3
            ) {
              await userModel
                .updateOne(
                  { phone: req.body.phone_admin },
                  { role: req.body.role }
                )
                .then(() => {
                  res.json({
                    message: "کاربر به عنوان ادمین در نظر گرفته شد ",
                  });
                })
                .catch((err) => {
                  req.status(500).send(err);
                });
            } else {
              res.status(422).json({
                message: "سطح کاربری صحیح را انتخاب کنید",
              });
            }
          } else {
            res.status(422).json({
              message: "درخواست شما باید شامل سطح کاربر",
            });
          }
        } else {
          res.status(422).json({
            message: "لطفا از یک شماره تلفن معتبر استفاده کنید",
          });
        }
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
exports.editUser = async (req, res) => {
  const id = req.params.id;
  const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
  const user = await userModle.findById(id).lean();
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
          { name: req.body.name, lastname: req.body.lastname }
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
};
exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const searchTerm = req.query.search_phone || "";
  try {
    const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    const query = { role: { $gte: token.role + 1 } };
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
exports.getOne = async (req, res) => {
  const user = await userModel.findById(req.params.id, "-password");
  const token = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
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
