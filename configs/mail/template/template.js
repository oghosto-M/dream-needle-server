require("dotenv").config();

exports.templateLogin = ({ email, code }) => {
  return {
    from: `"dream-needle.ir" <${process.env.ADDRESS_EMAIL}>`,
    to: email,
    subject: "تایید حساب کاربری",
    text: `کد ورود شما : ${code}`,
    html: `<!DOCTYPE html>  
<html lang="fa">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>تایید حساب کاربری</title>  
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
        }  
        p {  
            color: #555;  
            line-height: 1.6;  
        }  
    </style>  
</head>  
<body>  
    <div class="container">  
        <h2>تایید حساب کاربری</h2>  
        <p>👇 کد 5 رقمی شما برای ورود</p>  
        <div class="code">${code}</div>
        <p>لطفا این کد را در صفحه ورود وارد کنید</p>  
        <p>با تشکر از شما ❤️</p>  
        <a href:"dream-needle.ir">سوزن رویا</a>  
    </div>  
</body>  
            </html>  `,
  };
};
