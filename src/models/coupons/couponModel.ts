import moongose, { Schema } from "mongoose";

const couponModel = new Schema(
  {
    active_status: {
      type: Boolean,
      required: true,
    },
    user: {
      type: moongose.Types.ObjectId,
      required: true,
    },
    product: {
      type: moongose.Types.ObjectId,
      required: true,
    },
    coupon_type: {
      required: true,
      type : String,
      enum : ["toman" , "percentage"]
    },
    coupon_value: {
      type: String,
      required: true,
    },
    used_count: {
      type: Number,
      require: true,
    },
    usage_limit: {
      type: Number,
      require: true,
    },
    end_date: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const coupon = moongose.model("coupons", couponModel);

export default coupon;
