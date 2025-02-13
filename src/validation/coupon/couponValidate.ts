import validation, { ValidationSchema, RuleCustom } from "fastest-validator";
const v_coupon = new validation();

const schema_coupon: ValidationSchema = {
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
  coupon_type: {
    required: true,
    type: "string",
    enum: ["percentage", "toman"],
    messages: {
      string: "تایپ کوپن باید یکی از تایپ های مشخص باشد",
      required: "تایپ کوپن یک فیلد اجباری است",
      stringEnum: "تایپ کوپن باید یکی از تایپ های مشخص باشد",
    },
  },
  coupon_value: {
    required: true,
    type: "number",
    integer: true,
    positive: true,
    messages: {
      number: "مقدار کوپن باید تشکیل شده از اعداد باشد",
      required: "مقدار کوپن یک فیلد اجباری است",
      numberInteger: "مقدار کوپن یک عدد صحیح است",
      numberPositive: "مقدار کوپن یک عدد مثبت است",
    },
  },
  usage_limit: {
    required: true,
    type: "number",
    integer: true,
    positive: true,
    messages: {
      number: "حداکثر استفاده از کوپن باید تشکیل شده از اعداد باشد",
      required: "حداکثر استفاده از کوپن یک فیلد اجباری است",
      numberInteger: "حداکثر استفاده از کوپن یک عدد صحیح است",
      numberPositive: "حداکثر استفاده از کوپن یک عدد مثبت است",
    },
  },
  end_date: {
    required: true,
    type: "string",
    custom(value: string, errors: {
      type?: string,
      message?: string
    }[]) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        errors.push({ type: "dateFormat", message: "فرمت تاریخ نامعتبر است. لطفاً مقدار را در قالب ISO 8601 ارسال کنید." });
      }
      return value;
    },
    messages: {
      date: "زمان انقضا کوپن باید تشکیل شده از فرمت زمان باشد",
      required: "زمان انقضا کوپن یک فیلد اجباری است",
    },
  },
};

const validate_coupon = v_coupon.compile(schema_coupon);
export default validate_coupon;
