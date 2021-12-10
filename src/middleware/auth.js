const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.AT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error("Invalid token");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res
      .status(400)
      .send({ error: Object.keys(e).length ? e : "Please authenticate" });
  }
};

module.exports = auth;
