import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      message: "لطفا یک دقیقه دیگر امتحان کنید",
    });
  },
});

export default limiter;
