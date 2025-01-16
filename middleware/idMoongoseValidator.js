const moongose = require("mongoose");

function idMoongoseValidator(req, res, next) {
  if (req.params.id) {
    const id_valid = moongose.Types.ObjectId.isValid(require.params.id);
    if (id_valid) {
      return next();
    } else {
      return res.status(400).json({
        message: "This ID is not in the correct format",
      });
    }
  } else {
    next();
  }
}
