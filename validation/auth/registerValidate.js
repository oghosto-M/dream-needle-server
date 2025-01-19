const validation = require("fastest-validator");
const v = new validation();

const schema = {
  name: {
    required: true,
    type: "string",
    min: 2,
    max: 13,
    messages: {
      string: "نام باید تشکیل شده از حروف باشد",
      required: "نام یک فیلد اجباری است",
      stringMin: "نام میتواند حداقل 2 کاراکتر داشته باشد",
      stringMax: "نام میتواند حداکثر 13 کاراکتر داشته باشد",
    },
  },
  lastname: {
    required: true,
    type: "string",
    min: 2,
    max: 15,
    messages: {
      string: "نام خانوادگی باید تشکیل شده از حروف باشد",
      required: "نام خانوادگی یک فیلد اجباری است",
      stringMin: "نام خانوادگی میتواند حداقل 2 کاراکتر داشته باشد",
      stringMax: "نام خانوادگی میتواند حداکثر 15 کاراکتر داشته باشد",
    },
  },
  email: {
    required: true,
    type: "string",
    min: 7,
    max: 40,
    pattern: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g,
    messages: {
      string: "آدرس ایمیل باید تشکیل شده از حروف باشد",
      required: "ایمیل یک فیلد اجباری است",
      stringMin: "آدرس ایمیل میتواند حداقل 7 کاراکتر داشته باشد",
      stringMax: "آدرس ایمیل میتواند حداکثر 40 کاراکتر داشته باشد",
      pattern: "ایمیل نامعتبر است",
    },
  },
  phone: {
    required: true,
    type: "string",
    min: 9,
    max: 14,
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    messages: {
      string: "شماره تلفن باید تشکیل شده از حروف باشد",
      required: "شماره تلفن یک فیلد اجباری است",
      stringMin: "شماره تلفن میتواند حداقل 9 کاراکتر داشته باشد",
      stringMax: "شماره تلفن میتواند حداکثر 14 کاراکتر داشته باشد",
      pattern: "شماره تلفن نامعتبر است",
    },
  },
  password: {
    required: true,
    type: "string",
    min: 8,
    max: 20,
    messages: {
      string: "گذرواژه باید تشکیل شده از حروف باشد",
      required: "گذرواژه یک فیلد اجباری است",
      stringMin: "گذرواژه میتواند حداقل 8 کاراکتر داشته باشد",
      stringMax: "گذرواژه میتواند حداکثر 20 کاراکتر داشته باشد",
    },
  },
};

const validate = v.compile(schema);
module.exports = validate;
