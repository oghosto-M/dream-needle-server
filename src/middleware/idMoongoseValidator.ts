import moongose from "mongoose";
import { Request, Response, NextFunction } from "express";

function idMoongoseValidator(req: Request, res: Response, next: NextFunction) {
  if (req.params.id) {
    const id_valid = moongose.Types.ObjectId.isValid(req.params.id);
    if (id_valid === true) {
      return next();
    } else {
      return res.status(400).json({
        message: "این شناسه فرمت صحیح ندارم",
      });
    }
  } else {
    next();
  }
}

export default idMoongoseValidator;