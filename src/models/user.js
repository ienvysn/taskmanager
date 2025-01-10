const { ServerDescription } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../models/tasks");
// Define the User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid emial");
      }
    },
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      //validation
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 6 || value.includes("password")) {
        throw new Error("Password too weak");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "userID",
});

userSchema.statics.findByCredentials = async (email, password) => {
  // console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Login in failed");
  }

  const isCorrectPass = bcrypt.compare(password, user.password);
  // console.log(isCorrectPass);

  if (!isCorrectPass) {
    throw new Error("Login in failed");
  }
  return user;
};

//hash the password| this runs before the save() is done
userSchema.pre("save", async function (next) {
  if (this.isModified) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next(); //next is used so that it doesnt get stukc in a loop since it isa a async function
});

userSchema.methods.genAuth = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "ienvysnn", {
    expiresIn: "1h",
  });
  this.tokens = this.tokens.concat({ token }); //saves the token to User Schema
  await this.save();
  return token;
};

userSchema.methods.hidePrivateData = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};
//delete user task when the user is deleted
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];
  await Task.deleteMany({ userID: userId });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
