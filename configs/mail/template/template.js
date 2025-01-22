require("dotenv").config();

const parent = ({ email, code, title, discription }) => {
  return {
    from: `"dream-needle.ir" <${process.env.ADDRESS_EMAIL}>`,
    to: email,
    subject: title,
    text: `کد تایید شما : ${code}`,
    html: `
<!DOCTYPE html>
<html lang="fa">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazir&display=swap" rel="stylesheet"> <!-- لود فونت Vazir -->
    <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
        }

        h2 {
            color: #2563eb;
            font-family: sans-serif;
        }

        .code {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            border: 2px solid #2563eb;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            font-family: sans-serif;
        }

        p {
            color: #555;
            line-height: 1.6;
            font-family: sans-serif;
        }

        a {
            color: #2563eb;
            line-height: 1.6;
            font-family: sans-serif;
            font-weight: bold;
            margin-top: 15px;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>تایید حساب ایمیل</h2>
        <p>👇 کد 5 رقمی شما برای ثبت ایمیل</p>
        <div class="code">${code}</div>
        <p>${discription}</p>
        <p>با تشکر از شما ❤️</p>
        <a href="https://dream-needle.ir">سوزن رویا</a>
    </div>
</body>

</html>
`,
  };
};

exports.templateLogin = ({ email, code }) => {
  return parent({
    email,
    code,
    title: "تایید کد ایمیل",
    discription: "این کد را در صفحه ورود وارد کنید",
  });
};
exports.templateRegisterCode = ({ email, code }) => {
  return parent({
    email,
    code,
    title: "تایید ایمیل",
    discription: "این کد را در صفحه ثبت نام وارد کنید",
  });
};
exports.templateChangePasswordCode = ({ email, code }) => {
  return parent({
    email,
    code,
    title: "تغیر گذرواژه",
    discription: "این کد را در صفحه تغیر گذرواژه وارد کنید",
  });
};
exports.templateChangeEmailCode = ({ email, code }) => {
    return parent({
      email,
      code,
      title: "تغیر ایمیل",
      discription: "این کد را در صفحه تغیر ایمیل وارد کنید",
    });
  };
