// import and configuration express
const express = require("express") 
const app = express()

// import and configuration .env
require("dotenv").config()

//connect to db 
require("./configs/db/db")

// CORS configoration 
const cookieParser = require("cookie-parser")
const { default: helmet } = require("helmet")
const cors = require("cors")
app.use(cors({credentials: true}))

// configs form data
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(helmet())


// import route
const authRouter = require("./router/auth/authRouter")
const usersRouter = require("./router/user/userRouter")


// express router 
// app.router("/api/auth" , registerRouter)
app.use("/api/auth" , authRouter)
app.use("/api/users" , usersRouter)

// app listen
app.listen(process.env.PORT ,()=>{
    console.log("server is runnig");
})