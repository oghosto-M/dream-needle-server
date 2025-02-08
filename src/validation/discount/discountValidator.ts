import validation, { ValidationSchema } from "fastest-validator";
const v_discount = new validation();

const schema_discount: ValidationSchema = {
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
      string: "نام تخفیف باید تشکیل شده از حروف باشد",
      required: "نام تخفیف یک فیلد اجباری است",
      stringMin: "نام تخفیف میتواند حداقل 8 کاراکتر داشته باشد",
      stringMax: "نام تخفیف میتواند حداکثر 40 کاراکتر داشته باشد",
    },
  },
  discount_type: {
    required: true,
    type: "string",
    enum: ["percentage", "toman"],
    messages: {
      string: "تایپ تخفیف باید یکی از تایپ های مشخص باشد",
      required: "تایپ تخفیف یک فیلد اجباری است",
      stringEnum: "تایپ تخفیف باید یکی از تایپ های مشخص باشد",
    },
  },
  discount_value: {
    required: true,
    type: "number",
    integer: true,
    positive: true,
    messages: {
      number: "مقدار تخفیف باید تشکیل شده از اعداد باشد",
      required: "مقدار تخفیف یک فیلد اجباری است",
      numberInteger: "مقدار تخفیف یک عدد صحیح است",
      numberPositive: "مقدار تخفیف یک عدد مثبت است",
    },
  },
  end_date: {
    required: true,
    type: "string",
    custom(value: string, errors: any) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        errors.dateFormat = "فرمت تاریخ نامعتبر است. لطفاً مقدار را در قالب ISO 8601 ارسال کنید."
      }
      return value;
    },
    messages: {
      date: "زمان انقضا تخفیف تشکیل شده از فرمت زمان باشد",
      required: "زمان انقضا تخفیفیلد اجباری است",
    },
  },
};

const validate_discount = v_discount.compile(schema_discount);
export default validate_discount;
