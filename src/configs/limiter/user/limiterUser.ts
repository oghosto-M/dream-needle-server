import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 40,
  handler: (req, res) => {
    res.status(429).json({
      message: "لطفا پنج دقیقه دیگر امتحان کنید",
    });
  },
});

export default limiter;
