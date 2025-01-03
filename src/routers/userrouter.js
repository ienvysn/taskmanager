//REFACTORING SO THAT all the route for /user is in one place

const express = require("express");
const User = require("../models/user");
const router = new express.Router();

//POST a new user in database
router.post("/users", async (req, res) => {
  const user = new User(req.body); // Use req.body to access the incoming request data
  try {
    await user.save(); // Save the user to the database
    console.log("User saved successfully:", user);
    res.status(201).send(user); // Send the created user as a response
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send(error); // Send error response if there's an issue
  }
});

// GET all user
router.get("/users", async (req, res) => {
  try {
    user = await User.find();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET user by ID
router.get("/users/:id", async (req, res) => {
  _id = req.params.id;

  try {
    user = await User.findById(_id);
    if (!user) {
      console.log("No user found");
      return res.status(404).send();
    }
    res.send(user);
  } catch {
    res.status(500).send(error);
  }
});

//deleting  user
router.delete("/users/:id", async (req, res) => {
  _id = req.params.id;
  try {
    user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

//update user
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOptions = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOptions) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).send({ error: "Failed to update user" });
  }
});

module.exports = router;
