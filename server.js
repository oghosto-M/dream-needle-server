
// import and configoration express
const express = require("express");
const app = express();

// import and configoration .env
require("dotenv").config();

//connect to db
require("./configs/db/db");

// cookie-parser configoration
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// helmet configoration
const helmet = require("helmet");
app.use(helmet());

// CORS configoration
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",
  "https://dream-needle.ir",
  "https://www.dream-needle.ir",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware import
const authorizationAdmin = require("./middleware/authorizationAdmin")
const authorizationUser = require("./middleware/authorizationUser")
const limiterUser = require("./configs/limiter/user/limiterUser")

// import route
const authRouter = require("./router/auth/authRouter");
const usersRouter = require("./router/user/userRouter");

// express router
app.use("/api/auth", authRouter);
app.use("/api/users", limiterUser , authorizationUser , usersRouter);

// app listen
app.listen(process.env.PORT, () => {
  console.log("server is runnig");
});
