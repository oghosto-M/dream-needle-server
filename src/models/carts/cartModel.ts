import moongose, { Schema } from "mongoose";

const cartModel = new Schema(
  {
    user: {
      type: moongose.Types.ObjectId,
      required: true,
      ref:"users",
    },
    product: {
      type: moongose.Types.ObjectId,
      required: true,
      ref:"products",
    },
    count_order : {
      type: Number,
      required: false,
      default : 1
    },
    cart_coupon: {
      type: moongose.Types.ObjectId,
      required: false,
      default : null,
      ref:"coupons",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const cart = moongose.model("carts", cartModel);

export default cart;
