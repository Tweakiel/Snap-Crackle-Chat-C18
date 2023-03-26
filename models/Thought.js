// require mongoose and the Reaction model
const { Schema, model } = require("mongoose");
const ReactionSchema = require("./Reaction");

//create a schema for Thought
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//get total count of reactions on retrieval, call it reaction count. retrieves the thought's reaction count from the reactions array field on query.
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//create the Thought model using the ThoughtSchema
const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
