import validation from "fastest-validator";
const v_user = new validation();

const schema_user = {
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
  address : {
    required: false,
    type: "string",
    min: 10,
    max: 100,
    messages: {
      string: "آدرس سکونت باید تشکیل شده از حروف باشد",
      required: "آدرس سکونت یک فیلد اجباری است",
      stringMin: "آدرس سکونت میتواند حداقل 10 کاراکتر داشته باشد",
      stringMax: "آدرس سکونت میتواند حداکثر 100 کاراکتر داشته باشد",
    },
  },

};

const validate_user = v_user.compile(schema_user);
export default validate_user;
