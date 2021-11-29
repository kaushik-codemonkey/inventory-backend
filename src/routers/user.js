const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");

//Sign up API - register user

router.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save(); //the user is actually also saved inside genereteAuthToken - try commenting this stmt out
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.code == 11000) {
      return res
        .status(400)
        .send({ error: "User Name already taken or User already exists" });
    }
    res.status(400).send(e);
  }
});

// Sign in API
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials({
      ...req.body,
    });
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message || e);
  }
});

// Sign out API
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens?.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
