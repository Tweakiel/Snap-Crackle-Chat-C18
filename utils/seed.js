const connection = require("../config/connection.js");
const { userData, thoughtData } = require("./data");
const { User, Thought } = require("../models");

async function seedDatabase() {
  // Delete all users and thoughts
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Create users
  const users = await User.create(userData);
  // Create thoughts
  const thoughts = await Thought.create(thoughtData);

  //associate thoughts with users
  for (const thought of thoughts) {
    const user = users.find((user) => user.username === thought.username);
    user.thoughts.push(thought._id);
    await user.save();
  }
}
connection.once("open", () => {
  seedDatabase();
  console.log("MongoDB connection established successfully");
});

connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});
