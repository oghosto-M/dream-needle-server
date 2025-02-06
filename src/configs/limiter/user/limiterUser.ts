import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 30,
  handler: (req, res) => {
    res.status(429).json({
      message: "لطفا پنج دقیقه دیگر امتحان کنید",
    });
  },
});

export default limiter;
