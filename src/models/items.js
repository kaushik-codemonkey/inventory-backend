const mongoose = require("mongoose");
const { ITEM_SCHEMA_NAME, USER_SCHEMA_NAME } = require("../constants");

const schemaObj = {
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  price: {
    //last bought price
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: USER_SCHEMA_NAME,
  },
};

const itemSchema = mongoose.Schema(schemaObj, {
  timestamps: true,
});

itemSchema.methods.toJSON = function () {
  //delete created user's details from item(s) details  while sending it
  const item = this;
  let itemObject = item.toObject();
  if (Array.isArray(itemObject)) {
    itemObject.forEach((item) => {
      delete item.createdBy;
    });
  } else {
    delete itemObject.createdBy;
  }
  return itemObject;
};

const Items = mongoose.model(ITEM_SCHEMA_NAME, itemSchema);
module.exports = Items;
