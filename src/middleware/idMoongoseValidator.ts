import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

function idMoongoseValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
  return new Promise((reslov, reject) => {
    console.log(req.params);
    
    if (req.params.id) {
      const id_valid = mongoose.Types.ObjectId.isValid(req.params.id);
      if (id_valid === true) {
        next();
      } else {
        res.status(400).json({
          message: "this is not id",
        });
      }
    } else {
      next();
    }
  })
}

module.exports = idMoongoseValidator
export default idMoongoseValidator;