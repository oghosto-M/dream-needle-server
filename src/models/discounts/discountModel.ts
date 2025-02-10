import moongose, { Schema } from "mongoose";

const discountModel = new Schema(
  {
    active_status: {
      type: Boolean,
      required: true,
    },
    product : {
      type : moongose.Types.ObjectId,
      require : true
    },
    title: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 40,
    },
    discount_type: {
      required: true,
      type : String,
      enum : ["toman" , "percentage"]
    },
    discount_value: {
      type: String,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const discount = moongose.model("discounts", discountModel);

export default discount;
