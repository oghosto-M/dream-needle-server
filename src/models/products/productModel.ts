import moongose, { Schema } from "mongoose";

const productModel = new Schema(
    {
        active_status: {
            type: Boolean,
        },
        title: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 40,
        },
        category: {
            type: moongose.Types.ObjectId,
            required: true,
        },
        low_description: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 40
        },
        full_description: {
            type: String,
            required: true,
            minlength: 30,
        },
        price: {
            type: Number,
            required: true,
            min: 10000,
        },
        gallery: {
            required: false,
            type : Array
        },
        properties: {
            required: false,
            type : Array
        },
        count_available: {
            type: Number,
            required: true,
        },
        count_purchased: {
            type: Number,
            required: true,
        },
        comment: {
            required: false,
            type : Array
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const product = moongose.model("peoducts", productModel);

export default product;
