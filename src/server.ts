
// import and configoration express
import express from "express";
const app = express();

// import and configoration .env
require("dotenv").config()

//connect to db
require("./src/configs/db/db")

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
  origin: function (origin:any, callback:any) {
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
import authorizationAdmin from "./middleware/authorizationAdmin" ;
import authorizationUser from "./middleware/authorizationUser" ;
import idMoongoseValidator from "./middleware/idMoongoseValidator" ;
import limiterUser from "./configs/limiter/user/limiterUser" ;

// use middleware
app.use(idMoongoseValidator)

// import route
import categoryRouter from "./router/category/categoryRouter";
import usersRouter from "./router/user/userRouter";
import authRouter from "./router/auth/authRouter";


// express router
app.use("/api/auth", authRouter);
app.use("/api/users", limiterUser , authorizationUser , usersRouter);
app.use("/api/categories", limiterUser , categoryRouter);

// app listen
app.listen(process.env.PORT, () => {
  console.log("server is runnig");
});
