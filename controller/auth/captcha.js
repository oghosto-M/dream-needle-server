const Captcha = require("node-captcha-generator");
const bcrypt = require("bcrypt");
const userModel = require("./../../models/users/userModel");

// code captcha
exports.get = async (req, res) => {
  try {
    const c = new Captcha({
      length: 4,
      size: {
        width: 200,
        height: 75,
      },
    });
    await c.toBase64(async (err, base64) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.cookie("valueCode", bcrypt.hashSync(c.value, 11), {
          maxAge: 2 * 60 * 1000,
          httpOnly: true,
          secure: false,
        });
        res.json({
          message: "دریافت کد امنیتی با موفقیت انجام شد",
          src: base64,
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.validate = async (req, res) => {
  try {
    if (req.cookies.valueCode) {
      if (req.body.value && req.body.phone) {
        const data = await bcrypt.compare(
          String(req.body.value),
          String(req.cookies.valueCode)
        );
        const user = await userModel.findOne({ phone: req.body.phone }).lean();
        if (data) {
          res.json({
            message: "کد امنیتی معتبر است",
            is_new: user ? true : false,
          });
        } else {
          res.status(401).json({
            message: "کد امنیتی معتبر نیست",
          });
        }
      }else{
        res.status(422).json({
          message: "درخواست شما باید شامل کد امنیتی و شماره موبایل باشد",
        });
      }
    } else {
      res.status(401).json({
        message: "مدت کد امنیتی تمام شده لطفا دوباره درخواست بدید",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

// register
