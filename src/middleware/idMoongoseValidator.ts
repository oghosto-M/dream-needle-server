import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

function idMoongoseValidator(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  return new Promise((reslov, reject) => {
    if (req.params.id) {
      const id_valid = mongoose.Types.ObjectId.isValid(req.params.id);
      if (id_valid === true) {
        next();
      } else {
        res.status(400).json({
          message: "لطفا یک شناسه معتبر وارد کنید",
        });
      }
    } else {
      next();
    }
  });
}

module.exports = idMoongoseValidator;
export default idMoongoseValidator;
