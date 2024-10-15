const User = require("../models/User");

// Get all users who are not approved
const getUnapprovedUsers = async (req, res) => {
  try {
    // Fetch users who are not approved
    const unapprovedUsers = await User.find({ isApproved: false });
    res.status(200).json(unapprovedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Approve user by updating their approval status
const approveUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Approve user if they are not already approved
    if (!user.isApproved) {
      user.isApproved = true;
      await user.save();
      return res.status(200).json({ msg: "User approved" });
    } else {
      return res.status(400).json({ msg: "User is already approved" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Reject user by updating their approval status
const rejectUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Reject user if they are not already rejected
    if (user.isApproved) {
      user.isApproved = false;
      await user.save();
      return res.status(200).json({ msg: "User rejected" });
    } else {
      return res.status(400).json({ msg: "User is already rejected" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  getUnapprovedUsers,
  approveUser,
  rejectUser,
};
