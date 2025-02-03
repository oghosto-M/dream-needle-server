//import moongose
import moongose from "mongoose"

// import and configuration .env
require("dotenv").config();

// connect db
const connection = ()=>{

  return moongose
  .connect(process.env.LINK_DB as string)
  .then(() => {
    console.log("moongose is ready");
  })
  .catch((err) => {
    console.log(err);
  });
}

// export db function
export default connection