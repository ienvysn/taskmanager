//REFACTORING SO THAT all the route for /user is in one place

const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");

//login USer
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genAuth();
    res.status(200).send({ user: user.hidePrivateData(), token });
    console.log("LOGGEED IN");
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});
//POST a new user in database
router.post("/users", async (req, res) => {
  const user = new User(req.body); // Use req.body to access the incoming request data
  try {
    const token = await user.genAuth();
    // Save the user to the database
    console.log("User saved successfully:", user);
    res.status(201).send({ user: user.hidePrivateData(), token }); // Send the created user as a response
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send(error); // Send error response if there is an issue
  }
});

// GET user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user.hidePrivateData()); //req.user comes from Auth
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
router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    res.send("User deleted");
    console.log("test");
  } catch (error) {
    res.status(400).send({ error: "Failed to delete user" });
  }
});

//update user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOptions = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOptions) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.user._id);

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).send({ error: "Failed to update user" });
  }
});

//To upload files
const avatar = multer({
  dest: "images",
  limits: {
    fileSize: 1000000, //size in bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)&/)) {
      //regular expression
      return cb(new error("please upload a photo"));
    }
    cb(undefined, true);
  },
});
router.post("/users/me/avatar", avatar.single("avatar"), (req, res) => {
  res.send();
});

module.exports = router;
// //GET user by ID   || THIS IS NO LONGER REQUIRED
// router.get("/users/:id", auth, async (req, res) => {
//   _id = req.params.id;

//   try {
//     user = await User.findById(_id);
//     if (!user) {
//       console.log("No user found");
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch {
//     res.status(500).send({ error: "Failed to get user" });
//   }
// });

// EXPLAINATION
// First we require all the necessary things like expres and the userDB. The we set a new router which is linked with "index.js"
//
// POST, GET and DELETE are the router used and they are used for different things.
//
// In the route, we have "auth" which authenticates the user. if the route has "auth" then the user cannot do anything withouot being authenticated
//
//
//
