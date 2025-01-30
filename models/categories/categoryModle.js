// dependencies => product

const moongose = require("mongoose");
const { Schema } = require("mongoose");

const categoryModel = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "product", "training"],
    },
    category_parent: {
      type: moongose.Types.ObjectId,
      required: false,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 250,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const category = moongose.model("categories", categoryModel);

module.exports = category;
