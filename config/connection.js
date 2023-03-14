const { connect, connection } = require("mongoose");

connect("mongodb://localhost/SnapCrackleChatC18DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
