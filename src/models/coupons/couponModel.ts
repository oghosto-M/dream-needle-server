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
      type: ["percentage", "toman"],
      required: true,
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

const coupon = moongose.model("peoducts", couponModel);

export default coupon;
