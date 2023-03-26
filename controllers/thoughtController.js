const { Thought, User, Reactionschema } = require("../models/");

module.exports = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughtData = await Thought.find();
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get a single thought by id
  async getThoughtById(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });
      console.log(thoughtData);
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create thought
  async createThought(req, res) {
    try {
      // push thought's _id to the associated user's thoughts array field
      const thoughtData = await Thought.create(req.body);
      const userData = await User.findOneAndUpdate(
        { username: thoughtData.username },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update thought by id
  async updateThought(req, res) {
    try {
      // update thought by its _id value
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        req.body,
        { new: true } // return the new updated document
      );
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete thought by id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      await User.findByIdAndUpdate(thought.userId, {
        $pull: { thoughts: thought._id },
      });
      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // add reaction to thought
  async addReaction(req, res) {
    try {
      // create reaction
      const newReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true }
      );
      //add check if thought exists
      if (!newReaction) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.status(200).json(newReaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // remove reaction from thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.status(200).json({ message: "Reaction successfully deleted" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    }
  },
};
