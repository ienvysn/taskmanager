//REFACTORING SO THAT all the route for /user is in one place

const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

//POST a new user in database
router.post("/users", async (req, res) => {
  const user = new User(req.body); // Use req.body to access the incoming request data
  try {
    const token = await user.genAuth();
    // Save the user to the database
    console.log("User saved successfully:", user);
    res.status(201).send({ user, token }); // Send the created user as a response
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send(error); // Send error response if there is an issue
  }
});

// GET user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user); //req.user comes from Auth
});

//GET user by ID
router.get("/users/:id", auth, async (req, res) => {
  _id = req.params.id;

  try {
    user = await User.findById(_id);
    if (!user) {
      console.log("No user found");
      return res.status(404).send();
    }
    res.send(user);
  } catch {
    res.status(500).send({ error: "Failed to get user" });
  }
});

//login USer
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    const token = await user.genAuth();
    res.send({ user, token });
    console.log("LOGGEED IN");
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//deleting  user
router.delete("/users/:id", auth, async (req, res) => {
  _id = req.params.id;
  try {
    user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: "Failed to update user" });
  }
});

//update user
router.patch("/users/:id", auth, async (req, res) => {
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

// EXPLAINATION
// First we require all the necessary things like expres and the userDB. The we set a new router which is linked with "index.js"
//
// POST, GET and DELETE are the router used and they are used for different things.
//
// In the route, we have "auth" which authenticates the user. if the route has "auth" then the user cannot do anything withouot being authenticated
//
//
//
//
//
