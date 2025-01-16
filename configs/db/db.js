//import moongose
const moongose = require("mongoose");

// import and configuration .env
require("dotenv").config();

// connect db
const connect = moongose
  .connect(process.env.LINK_DB)
  .then(() => {
    console.log("moongose is ready");
  })
  .catch((err) => {
    console.log(err);
});

// export db function
module.exports = connect