const { Schema, model } = require("mongoose");

//create a schema for User

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//get total count of friends on retrieval, call it friend count. retrieves the user's friend count from the friends array field on query.
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

//create the User model using the UserSchema
const User = model("User", UserSchema);

module.exports = User;
