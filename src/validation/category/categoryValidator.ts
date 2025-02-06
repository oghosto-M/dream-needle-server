
import validation from "fastest-validator";
const v_categoty = new validation();

const schema_categoty = {
  type: {
    required: true,
    ...{ type: "array", min: 1 },
    type: "array",
    items: {
      type: "string",  
      enum: ["blog", "product", "training"],
    }, 
    messages: {
      string: "تایپ باید تشکیل شده از حروف باشد",
      required: "تایپ یک فیلد اجباری است",
      arrayMin:"شما باید حداقل یک تایپ را انتخاب کنید",
      stringEnum: "لطفا از تایپ های مشخص شده استفاده کنید",
      stringMin: "تایپ میتواند حداقل 2 کاراکتر داشته باشد",
      stringMax: "تایپ میتواند حداکثر 30 کاراکتر داشته باشد",
    },
  },
  title: {
    required: true,
    type: "string",
    min: 2,
    max: 15,
    messages: {
      string: "نام دسته بندی باید تشکیل شده از حروف باشد",
      required: "نام دسته بندی یک فیلد اجباری است",
      stringMin: "نام دسته بندی میتواند حداقل 2 کاراکتر داشته باشد",
      stringMax: "نام دسته بندی میتواند حداکثر 30 کاراکتر داشته باشد",
    },
  },
  description: {
    required: false,
    type: "string",
    min: 10,
    max: 100,
    messages: {
      string: "توضیحات دسته بندی باید تشکیل شده از حروف باشد",
      required: "توضیحات دسته بندی یک فیلد اجباری است",
      stringMin: "توضیحات دسته بندی میتواند حداقل 10 کاراکتر داشته باشد",
      stringMax: "توضیحات دسته بندی میتواند حداکثر 250 کاراکتر داشته باشد",
    },
  },
};

const validate_categoty = v_categoty.compile(schema_categoty);
export default validate_categoty;
