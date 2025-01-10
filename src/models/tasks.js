const { ServerDescription, Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema(
  {
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    Completed: {
      type: Boolean,
      default: false,
      trim: true,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  }, // eta samma ko is Task ko necesseary
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
