const { ServerDescription } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");

const Task = mongoose.model("Task", {
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  Completed: {
    type: Boolean,
    default: false,
    trim: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = Task;
