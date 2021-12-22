const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");
const { generateAccessTokenByRefreshToken } = require("../controller/user");
const { errorMessage } = require("../constants");
//Sign up API - register user

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save(); //the user is actually also saved inside genereteAuthToken - try commenting this stmt out
    const token = await user.generateAuthToken();
    const refresh = await user.generateRefreshToken();
    res.status(201).send({ user, token, refreshToken: refresh });
  } catch (e) {
    if (e.code == 11000) {
      return res
        .status(400)
        .send({ error: "User Name already taken or User already exists" });
    }
    res.status(400).send({ success: false, error: errorMessage["5xx"] });
  }
});

// Sign in API
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials({
      ...req.body,
    });
    const token = await user.generateAuthToken();
    const refresh = await user.generateRefreshToken();
    res.send({ user, token, refreshToken: refresh });
  } catch (e) {
    res.status(400).send({ success: false, error: errorMessage["5xx"] });
  }
});

// Sign out API
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens?.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ success: false, error: errorMessage["5xx"] });
  }
});

router.get("", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ success: false, error: errorMessage["5xx"] });
  }
});
//API to update user details
router.patch("", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "email",
    "password",
    "userName",
    "firstName",
    "lastName",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ success: false, error: errorMessage["5xx"] });
  }
});
//API to delete a user
router.delete("", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ success: false, error: errorMessage["5xx"] });
  }
});
//API to get access token using refreshToken
router.get("/refresh", async (req, res) => {
  try {
    await generateAccessTokenByRefreshToken(req, res);
  } catch (error) {
    res.status(500).send({ success: false, error: errorMessage["5xx"] });
  }
});
module.exports = router;
