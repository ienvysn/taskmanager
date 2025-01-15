const { ServerDescription } = require("mongodb");
const mongoose = require("mongoose");

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

main();
// C:\Users\ACER\mongodb\bin\mongod.exe --dbpath=C:\Users\ACER\mongodb-data
