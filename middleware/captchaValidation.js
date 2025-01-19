function captchaValidation(req, res, next) {
  if (req.cookies.captcha) {
    return next();
  } else {
    res.status(401).json({
      message: "تایید احراز هویت شما منقضی شده است",
      captcha: false,
    });
  }
}

module.exports = captchaValidation;
