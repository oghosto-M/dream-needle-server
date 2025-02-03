import { Request, Response , NextFunction } from "express";

function captchaValidation(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.captcha) {
    return next();
  } else {
    res.status(401).json({
      message: "تایید احراز هویت شما منقضی شده است",
      captcha: false,
    });
  }
}

export default captchaValidation;
