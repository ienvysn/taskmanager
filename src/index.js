const express = require("express");
require("./db/mongoose"); // automatically establishes a connection to MongoDB
const User = require("./models/user");
const Task = require("./models/tasks");
const userRouter = require("./routers/userrouter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const taskRouter = require("./routers/taskrouter");
const port = 3000;
const app = express();

//EXPRESS MIDDLEWARE

// app.use((req, res, next) => {
//   if (req.method == "GET") {
//     res.send("GET REQ ae disabkle");
//   } else {
//     next(); //next is a default function (middleware)
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("Uder maintaince");
// });

app.use(express.json()); // parse incomming json to object
//made seperate router for user and task
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log("Server is up");
});
