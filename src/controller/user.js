const jwt = require("jsonwebtoken");
const User = require("../models/user");
async function generateAccessTokenByRefreshToken(req, res) {
  const refreshToken = req.query?.refreshToken;
  if (!refreshToken) {
    return res.status(400).send({ error: "Refresh Token required!" });
  }
  const decoded = jwt.verify(refreshToken, process.env.RT_SECRET);
  let user = await User.findOne({ _id: decoded._id });
  if (!user) return res.status(404).send();
  const newAuthToken = await user.generateAuthToken();
  return res.send({ token: newAuthToken, refreshToken });
}
module.exports = { generateAccessTokenByRefreshToken };
