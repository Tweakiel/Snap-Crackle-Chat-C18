//import models
const { User, Thought } = require("../models");
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
      const updateData = await User.findOneAndUpdate(req.params.id, req.body, {
        new: true,
      }); // new: true, return the new updated document
      res.status(200).json(updateData);
    } catch (err) {
      //console.log(err);
      res.status(500).json(err);
    }
  },

  // delete user and associated thoughts
  async deleteUser(req, res) {
    try {
      const deleteData = await User.findOneAndDelete(req.params.id);

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
      //check for user by id
      const user = await User.findOne({ _id: req.params.id });
      //check if friend exists
      const friend = await User.findOne({ _id: req.params.friendId });

      if (!user) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      if (!friend) {
        return res
          .status(404)
          .json({ message: "No friend found with this id!" });
      }

      //check if friend is already in friend list
      if (user.friends.includes(req.params.friendId)) {
        return res
          .status(400)
          .json({ message: "Friend already exists in friend list!" });
      }

      //add friend to friend list by pushing friend id to friends array
      user.friends.push(req.params.friend_id);
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete friend from user friend list
  async deleteFriend(req, res) {
    try {
      // inverse method of add friend
      const user = await User.findOne({ _id: req.params.id });
      const friend = await User.findOne({ _id: req.params.friendId });

      // same checks as add friend
      if (!user) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      if (!friend) {
        return res
          .status(404)
          .json({ message: "No friend found with this id!" });
      }

      if (!user.friends.includes(req.params.friendId)) {
        return res
          .status(400)
          .json({ message: "Friend does not exist in friend list!" });
      }

      // remove friend from friend list by pulling friend id from friends array
      user.friends.pull(req.params.friend_id);
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
