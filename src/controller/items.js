const Items = require("../models/items");
const lodash = require("lodash");

async function createNewItem(req, res) {
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
}

async function editExisistingItem(req, res) {
  //Validate incoming update object
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "price"];
  const isValidOperation = updates.every((prop) => {
    return allowedUpdates.includes(prop);
  });
  if (!isValidOperation) {
    return res.status(400).send({ success: false, error: "Invalid Updates" });
  }
  //check if the item actually exists
  const item = await Items.findById(req.params.itemId);
  if (!item) return res.status(404).send();
  //If there is no change - return 304 - not modified
  if (lodash.isEqual({ name: item.name, price: item.price }, { ...req.body }))
    return res.status(304).send();
  //Happy case
  const updatedItem = await Items.findOneAndUpdate(
    { _id: req.params.itemId },
    {
      ...req.body,
    },
    { returnOriginal: false }
  );
  res.send({ success: true, data: updatedItem });
}

async function deleteItem(req, res) {
  const deletedItem = await Items.findByIdAndDelete(req.params.itemId);
  if (!deletedItem) return res.status(404).send();
  res.send({ success: true, data: deletedItem });
}

module.exports = { createNewItem, editExisistingItem, deleteItem };
