const express = require("express");
const {
  createNewItem,
  editExisistingItem,
  deleteItem,
} = require("../controller/items");
const router = express.Router();
const auth = require("../middleware/auth");
const Items = require("../models/items");
//Get all Items
router.get("/all", auth, async (req, res) => {
  try {
    const allItems = await Items.find({}).populate("createdBy");
    res.send({ success: true, data: allItems });
  } catch (e) {
    res.status(500).send({ success: false, error: e });
  }
});
//Get items based on the Id
router.get("/:itemId", auth, async (req, res) => {
  try {
    const item = await Items.findById(req.params.itemId).populate("createdBy");
    res.send({ success: true, data: item });
  } catch (e) {
    res.status(500).send({ success: false, error: e });
  }
});
//Create new item
router.post("", auth, async (req, res) => {
  try {
    await createNewItem(req, res);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

//Update Item
router.patch("/:itemId", async (req, res) => {
  try {
    await editExisistingItem(req, res);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

//Delete Item
router.delete("/:itemId", async (req, res) => {
  try {
    await deleteItem(req, res);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});
module.exports = router;
