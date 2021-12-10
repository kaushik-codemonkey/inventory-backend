const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schemaObj = {
  userName: {
    type: String,
    unique: true,
    trim: true,
    minLength: 6,
    maxLength: 30,
    validator(value) {
      if (!value.match(/^[A-Za-z0-9.@#_-]*$/g)?.length)
        throw new Error(
          "The username should be alphaNumeric with some allowed symbols(.@#_-)."
        );
    },
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("Email is invalid!");
    },
  },
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: 2,
    maxLength: 30,
    validate(val) {
      if (!validator.isAlphanumeric(val))
        throw new Error("First Name is not an alphaNumeric!");
    },
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: 2,
    maxLength: 30,
    validate(val) {
      if (!validator.isAlphanumeric(val))
        throw new Error("Last Name is not an alphaNumeric!");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(val) {
      if (val.toLowerCase().includes("password"))
        throw new Error("Should not contain the word 'password'");
    },
  },
};
const userSchema = mongoose.Schema(schemaObj, {
  timestamps: true,
});

//Hash the password before saving (if the password is edited)
userSchema.pre("save", async function (next) {
  let user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.AT_SECRET,
    {
      expiresIn: Number(process.env.AT_EXPIRY),
    }
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const user = this;
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.RT_SECRET,
    {
      expiresIn: Number(process.env.RT_EXPIRY),
    }
  );
  return refreshToken;
};
userSchema.statics.findByCredentials = async function ({ userName, password }) {
  const user = await User.findOne({ userName });
  if (!user) {
    throw new Error("User not found"); //user not found
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong username/password");
  }
  return user;
};

//To delete unwanted data when transfering data to the client
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.avatar;
  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
