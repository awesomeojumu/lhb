const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register User
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, battalion } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Role & Battalion validation
    if (role && !['commander', 'commando', 'specialForce', 'globalSoldier'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    if (battalion && !['Alpha', 'Bravo', 'Charlie', 'Delta'].includes(battalion)) {
      return res.status(400).json({ message: 'Invalid battalion provided' });
    }

// Commander & Commando can assign high-level roles
if (role && ['commander', 'commando', 'specialForce'].includes(role)) {
  if (!req.user || !['commander', 'commando'].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'Only Commander or Commando can assign high-level roles' });
  }
}

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'globalSoldier',
      battalion: battalion || null
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      battalion: user.battalion,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc logout User
exports.logoutUser = (req, res) => {
  try {
    // Invalidate the token by removing it from the client side
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
    `;

    await sendEmail(user.email, 'Password Reset Request', message);
    res.json({ message: 'Reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
