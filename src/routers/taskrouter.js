//REFACTORING SO THAT all the route for /tsk is in one place

const express = require("express");
const Task = require("../models/tasks");
const router = new express.Router();

//GET all tasks
router.get("/tasks", async (req, res) => {
  try {
    task = await Task.find();
    res.send(task);
  } catch {
    res.statusCode().send;
  }
});
//POST a new task in database
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    console.log("Task saved successfully:", task);
    res.status(201).send(task); // Send the created task as a response
  } catch {
    console.error("Error saving user:", error);
    res.status(400).send(error); // Send error response if there's an issue
  }
});
//GET task by id
router.get("/tasks/:id", async (req, res) => {
  _id = req.params.id;
  try {
    task = await Task.findById(_id);
    if (!task) {
      console.log("No task found");
      return req.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

//update task
router.patch("/tasks/:id", async (req, res) => {
  _id = req.params.id;
  try {
    task = await Task.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

//deleting  task
router.delete("/tasks/:id", async (req, res) => {
  _id = req.params.id;
  try {
    task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
