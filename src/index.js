const express = require("express");
require("./db/mongoose"); // automatically establishes a connection to MongoDB
const User = require("./models/user");
const Task = require("./models/tasks");
const userRouter = require("./routers/userrouter");
const bcrypt = require("bcrypt");

const taskRouter = require("./routers/taskrouter");
const port = 3000;
const app = express();

app.use(express.json()); // parse incomming json to object

//made seperate router for user and task
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log("Server is up");
});

const myFunction = async () => {
  const password = "12345";
  const hpass = await bcrypt.hash(password, 8);
  console.log(hpass, password);
};
myFunction();
