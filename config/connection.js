const mongoose = require("mongoose");

const connectionLine =
  process.env.MONGODB_URI || "mongodb://localhost/SnapCrackleChatC18DB";

mongoose.connect(connectionLine, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

module.exports = connection;
