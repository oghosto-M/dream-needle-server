const moongose = require("mongoose");

function idMoongoseValidator(req, res, next) {
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

module.exports = idMoongoseValidator;