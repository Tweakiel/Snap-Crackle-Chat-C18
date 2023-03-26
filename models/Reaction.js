// require schema, model and types from mongoose
const { Schema, model, Types } = require("mongoose");

// create a reaction SCHEMA ONLY
const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent thought _id
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,

    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// schema only, no model, because this will be nested in the Thought model

module.exports = ReactionSchema;
