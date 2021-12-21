const mongoose = require("mongoose");

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
};

const itemSchema = mongoose.Schema(schemaObj, {
  timestamps: true,
});
const Items = mongoose.model("Items", itemSchema);
module.exports = Items;
