// dependencies => product

import moongose, { Schema } from "mongoose";

const categoryModel = new Schema(
  {
    type: {
      type: ["blog", "product", "training"],
      required: true,
    },
    category_parent: {
      type: moongose.Types.ObjectId,
      required: false,
      ref : "categories"
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
  },
);

const category = moongose.model("categories", categoryModel);

export default category;
