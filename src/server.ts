// import and configoration express
import express from "express";
const app = express();

// import and configoration .env
require("dotenv").config();

//connect to db
require("./configs/db/db");

// cookie-parser configoration
import cookieParser from "cookie-parser";
app.use(cookieParser());

// helmet configoration
import helmet from "helmet";
app.use(helmet());

// CORS configoration
import cors from "cors";
const allowedOrigins = [
  "http://localhost:3000",
  "https://dream-needle.ir",
  "https://www.dream-needle.ir",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware import

import limiterUser from "./configs/limiter/user/limiterUser";

// use middleware
app.use(limiterUser);

// import route
import categoryRouter from "./router/category/categoryRouter";
import productRouter from "./router/product/productRouter";
import usersRouter from "./router/user/userRouter";
import authRouter from "./router/auth/authRouter";
import couponRouter from "./router/coupon/couponRouter";
import discountRouter from "./router/discount/discountRouter";
import cartRouter from "./router/cart/cartRouter";

// import userModel from "./models/users/userModel"; 
// const setter = async()=>{
//   await userModel.updateOne({phone : "09398896930"} , {role : 0})
// }
// setter()

// express router
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/discounts", discountRouter);
app.use("/api/carts", cartRouter);



// app listen
app.listen(process.env.PORT, () => {
  console.log("server is runnig");
});
