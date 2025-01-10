//REFACTORING SO THAT all the route for /task is in one place

const express = require("express");
const Task = require("../models/tasks");
const router = new express.Router();
const auth = require("../middleware/auth");

//POST a new task in database
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    userID: req.user._id,
  });
  try {
    await task.save();
    console.log("Task saved successfully:", task);
    res.status(201).send(task); // Send the created task as a response
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send(error); // Send error response if there's an issue
  }
});
//GET all tasks
// /task?Completed=true
// /task?limit=3&skip=3
router.get("/tasks", auth, async (req, res) => {
  let match = {};

  const limit = parseInt(req.query.limit) || 3; //how many data to show
  const skip = parseInt(req.query.skip) || 3; //to go to another page

  if (req.query.Completed !== undefined) {
    // Convert the query parameter to a boolean
    match.Completed = req.query.Completed === "true"; // This will return true if "true", false if "false"
  }
  try {
    const tasks = await Task.find({ userID: req.user._id, ...match })
      .limit(limit)
      .skip(skip);
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

//GET task by id
router.get("/tasks/:id", auth, async (req, res) => {
  _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, userID: req.user.id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//update task
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["Description", "Completed"];
  const isValidOptions = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOptions) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userID: req.user._id,
    });
    console.log(task);
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//deleting  task
router.delete("/tasks/:id", auth, async (req, res) => {
  _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userID: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
