const mongoose = require("mongoose");
const Items = require("../models/items");
const User = require("../models/user");
const connectionURL = process.env.MONGO_URL;
mongoose.connect(connectionURL, async () => {
  console.log("Migration started...");
  await loadInitialData();
  console.log("Migration completed👍👍");
});

async function loadInitialData() {
  if (!!(await User.findOne({ userName: "sample_user" }))) return;
  const user = await User.create({
    userName: "sample_user",
    email: "sample_user@gmail.com",
    firstName: "sample",
    lastName: "user",
    password: "12345678",
  });
  console.log(await User.findOne({ userName: "sample_user" }));

  if ((await Items.countDocuments().exec()) > 0) return;
  Promise.all([
    Items.create({
      name: "Gingelly oil",
      price: 250,
    }),
    Items.create({
      name: "Cardomom",
      price: 220,
    }),
    Items.create({
      name: "Rice",
      price: 50,
    }),
    Items.create({
      name: "Groundnut oil",
      price: 120,
    }),
  ]);
  return true;
}
