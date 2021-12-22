const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Items = require("../models/items");
//Get all Items
router.get("/all", auth, async (req, res) => {
  try {
    const allItems = await Items.find({});
    res.send({ message: "Successfull", data: allItems });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});
//Get items based on the Id
router.get("/:itemId", auth, async (req, res) => {
  try {
    const item = await Items.findById(req.params.itemId);
    res.send({ message: "Successfull", data: item });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});
//Create new item
router.post("", auth, async (req, res) => {
  try {
    //Check if the itemName already exists - if exists - just update the price & send 400 else 401 with item obj
    const exisistingItem = await Items.findOneAndUpdate(
      { name: req.body.name },
      { ...req.body },
      { returnOriginal: false }
    );
    if (exisistingItem)
      return res
        .status(400)
        .send({ message: "Item price updated!", data: exisistingItem });
    //
    const finalBody = { ...req.body };
    const item = new Items(finalBody);
    await item.save();
    return res.status(401).send({ message: "Item created!", data: item });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
});
module.exports = router;
