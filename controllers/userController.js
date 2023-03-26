//import models
const { User, Thought, Reaction } = require("../models");
// require object id from mongoose
const { ObjectId } = require("mongoose").Types;

module.exports = {
  // get all users
  async getAllUsers(req, res) {
    try {
      const userData = await User.find()
        .select("-__v") // exclude __v , version key
        .populate("friends") // populate friend data
        .populate("thoughts"); // populate thought data
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get one user by id
  async getUserById(req, res) {
    try {
      const singleUserData = await User.findOne({ _id: req.params.id })
        .populate("friends")
        .populate("thoughts");
      res.status(200).json(singleUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update user by id
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).json(err.message);
    }
  },

  // delete user and associated thoughts
  async deleteUser(req, res) {
    try {
      const deleteData = await User.findByIdAndDelete(req.params.id);

      //add check if user exists
      if (!deleteData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      await Thought.deleteMany({ username: deleteData.username });

      res.status(200).json(deleteData);
    } catch (err) {
      //console.log(err);
      res.status(500).json(err);
    }
  },

  // add friend to user friend list
  async addFriend(req, res) {
    try {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      ).then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // remove friend from user friend list
  async removeFriend(req, res) {
    try {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
