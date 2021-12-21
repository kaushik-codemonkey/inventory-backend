const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const itemsRouter = require("./routers/items");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/items", itemsRouter);

module.exports = app;
