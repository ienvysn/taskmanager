const { ServerDescription } = require("mongodb");
const mongoose = require("mongoose");

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

main();
// C:\Users\ACER\mongodb\bin\mongod.exe --dbpath=C:\Users\ACER\mongodb-data
