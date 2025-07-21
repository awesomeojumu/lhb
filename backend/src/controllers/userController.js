const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent sensitive fields update
    if (req.body.role || req.body.lhbCode) {
      return res.status(403).json({ message: 'You cannot update role or lhbCode directly' });
    }

    const updatableFields = [
      'firstName', 'lastName', 'phone', 'sex', 'ageBracket', 'dateOfBirth', 'battalion',
      'relationshipStatus', 'weddingAnniversary', 'address', 'country', 'personalityType',
      'fiveFoldGift', 'leadershipRoles', 'education', 'jobStatus', 'incomeRange',
      'purposeStatus', 'primaryMountain', 'secondaryMountain', 'purposeBootcampCompleted',
      'discipleshipCompleted', 'hasVoterCard', 'hasPassport', 'hasDriversLicense'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // ✅ Commander & Commando can delete users
    if (!req.user || !['commander', 'commando'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Commander or Commando can delete users' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!req.user || !["commander", "commando"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "commander") {
      return res.status(403).json({ message: "Cannot change Commander’s role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add this to your userController.js
exports.updateUserBattalion = async (req, res) => {
  try {
    if (!req.user || !["commander", "commando"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { battalion } = req.body;
    if (!battalion) {
      return res.status(400).json({ message: "Battalion is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.battalion = battalion;
    await user.save();

    res.json({ message: "Battalion updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

