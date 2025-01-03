// C:\Users\ACER\mongodb\bin\mongod.exe --dbpath=C:\Users\ACER\mongodb-data

const { MongoClient, ObjectID } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "task-manager";

async function connectToMongoDB() {
  const mongoClient = new MongoClient(url);
  try {
    await mongoClient.connect(); // Connect to the server
    console.log("Connected to MongoDB");
    const db = mongoClient.db(dbName); // Get the database
    console.log(`Using database: ${dbName}`);

    // const result = await db.collection("users").insertOne({
    //   name: "envy",
    //   age: 18,
    // });
    // const result = await db.collection("users").insertMany([
    //   {
    //     name: "lavnik",
    //     age: 30,
    //   },
    //   { name: "lavniks", age: 23 },
    // ]);

    // const result = await db.collection("tasks").insertMany([
    //   {
    //     description: "Test1",
    //     completed: true,
    //   },
    //   {
    //     description: "Test2",
    //     completed: false,
    //   },
    //   {
    //     description: "Test3",
    //     completed: true,
    //   },
    // ]);
    console.log("test");
    // const result = await db.collection("users").find({ name: "envy" });
    const result = await db
      .collection("tasks")
      .find({ completed: true })
      .toArray();
    console.log(result);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await mongoClient.close();
  }
}
connectToMongoDB();
