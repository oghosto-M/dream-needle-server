import moongose, { Schema } from "mongoose";

const userModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
    },
    role: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 50,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 15,
      match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    address: {
      type: String,
      required: true,
      default: "مشخصاتی ثبت نشده",
      minlength: 10,
      maxlength: 250,
    },
    phone_verify: {
      type: Boolean,
      required: true,
    },
    email_verify: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const user = moongose.model("users", userModel);

export default user;
