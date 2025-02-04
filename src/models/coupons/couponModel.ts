import moongose, { Schema } from "mongoose";

const productModel = new Schema(
    {
        active_status: {
            type: Boolean,
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
            required: true
        },
        coupon_value: {
            type: String,
            required: true
        },
        used_count: {
            type: Number,
            require: true
        },
        usage_limit: {
            type: Number,
            require: true
        },
        end_date: {
            type: Date,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const product = moongose.model("peoducts", productModel);

export default product;
