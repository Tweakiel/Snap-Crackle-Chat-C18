const connection = require("../config/connection.js");
const { userData, thoughtData } = require("./data");
const { User, Thought } = require("../models");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Connected to MongoDB");

  //drop existing data
  await User.deleteMany({});
  await Thought.deleteMany({});

  // add new thoughts from thoughtData
  const thoughts = await Thought.insertMany(thoughtData);

  // add new users from userData
  const users = await User.insertMany(userData);

  //associate thoughts with users relationship
});

console.log("Done seeding database");
process.exit(0);
