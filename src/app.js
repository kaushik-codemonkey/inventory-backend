const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const itemsRouter = require("./routers/items");
const User = require("./models/user");
const rateLimit = require("express-rate-limit");
const app = express();

//Configure rate limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "You exceeded 5 requests in a minute limit!",
  headers: true,
});

//apply rate limiter only to these apis
app.use("/api/user/signup", apiLimiter);
app.use("/api/user/login", apiLimiter);
app.use("/api/user/refresh", apiLimiter);

//
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/items", itemsRouter);

module.exports = app;
