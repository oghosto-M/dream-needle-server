import validation, { ValidationSchema } from "fastest-validator";
const v_product = new validation();

const schema_product: ValidationSchema = {
  active_status: {
    required: true,
    type: "boolean",
    messages: {
      boolean:
        "محصول شما باید یکی از وضعیت های فعال یا غیر فعال بودن را دارا باشد",
      required:
        "محصول شما باید یکی از وضعیت های فعال یا غیر فعال بودن را دارا باشد",
    },
  },
  title: {
    required: true,
    type: "string",
    min: 8,
    max: 40,
    messages: {
      string: "نام محصول باید تشکیل شده از حروف باشد",
      required: "نام محصول یک فیلد اجباری است",
      stringMin: "نام محصول میتواند حداقل 8 کاراکتر داشته باشد",
      stringMax: "نام محصول میتواند حداکثر 40 کاراکتر داشته باشد",
    },
  },
  low_description: {
    required: true,
    type: "string",
    min: 5,
    max: 40,
    messages: {
      string: "توضیحات کوتاه محصول باید تشکیل شده از حروف باشد",
      required: "توضیحات کوتاه محصول یک فیلد اجباری است",
      stringMin: "توضیحات کوتاه محصول میتواند حداقل 5 کاراکتر داشته باشد",
      stringMax: "توضیحات کوتاه محصول میتواند حداکثر 40 کاراکتر داشته باشد",
    },
  },
  full_description: {
    required: true,
    type: "string",
    min: 30,
    messages: {
      string: "توضیحات محصول باید تشکیل شده از حروف باشد",
      required: "توضیحات محصول یک فیلد اجباری است",
      stringMin: "توضیحات محصول میتواند حداقل 30 کاراکتر داشته باشد",
    },
  },
  price: {
    required: true,
    type: "number",
    min: 10000,
    integer: true,
    messages: {
      number: "قیمت محصول باید تشکیل شده از حروف باشد",
      required: "قیمت محصول یک فیلد اجباری است",
      numberMin: "قیمت محصول باید بیشتر از 10000 تومان باشد",
      numberInteger: "قیمت محصول یک عدد صحیح است",
      numberPositive: "قیمت محصول یک عدد مثبت است",
    },
  },
  gallery: {
    required: false,
    type: "array",
  },
  properties: {
    required: false,
    type: "array",
  },
  count_available: {
    required: true,
    type: "number",
    min: 0,
    integer: true,
    messages: {
      number: "موجودی محصول باید تشکیل شده از حروف باشد",
      required: "موجودی محصول یک فیلد اجباری است",
      numberMin: "موجودی محصول باید بیشتر از 0 باشد",
      numberInteger: "موجودی محصول یک عدد صحیح است",
      numberPositive: "موجودی محصول یک عدد مثبت است",
    },
  },
  comment: {
    required: false,
    type: "array",
  },
};

const validate_product = v_product.compile(schema_product);
export default validate_product;
