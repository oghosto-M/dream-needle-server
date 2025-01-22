const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    handler: (req, res) => {
      res.status(429).json({
        message: "لطفا دو دقیقه دیگر امتحان کنید",
      });
    },
  });

module.exports = limiter;
