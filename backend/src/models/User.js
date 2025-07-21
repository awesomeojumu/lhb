const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ===========================
// USER SCHEMA DEFINITION
// ===========================
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },

  sex: { type: String, enum: ['Male', 'Female'] },
  ageBracket: { type: String, enum: ['18-25', '26-35', '36-45', '46-60', '60+'] },
  dateOfBirth: Date,

  battalion: { type: String, enum: ['Alpha', 'Bravo', 'Charlie', 'Delta'] },
  lhbCode: { type: String, unique: true, sparse: true },

  relationshipStatus: { type: String, enum: ['Single', 'Engaged', 'Married'] },
  weddingAnniversary: Date,

  address: String,
  country: String,

  personalityType: String,
  fiveFoldGift: { type: String, enum: ['Apostle', 'Pastor', 'Evangelist', 'Teacher', 'Prophet'] },
  leadershipRoles: [String],

  education: { type: String, enum: ['SSCE', 'OND', 'HND', 'Bachelors', 'Masters', 'PhD'] },
  jobStatus: { type: String, enum: ['Employed', 'Self Employed', 'Contract', 'Unemployed'] },
  incomeRange: String,

  purposeStatus: { type: String, enum: ['Discovered', 'Not Yet Discovered', 'In Progress'] },
  primaryMountain: String,
  secondaryMountain: String,

  purposeBootcampCompleted: { type: Boolean, default: false },
  discipleshipCompleted: { type: Boolean, default: false },

  hasVoterCard: { type: Boolean, default: false },
  hasPassport: { type: Boolean, default: false },
  hasDriversLicense: { type: Boolean, default: false },

  role: {
    type: String,
    enum: ['commander', 'commando', 'specialForce', 'globalSoldier'],
    default: 'globalSoldier',
  },

  kpiProgress: { type: Number, default: 0 }, // % completed (0-100)
  completedKpis: { type: Number, default: 0 },
  inProgressKpis: { type: Number, default: 0 },
  notStartedKpis: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },

  password: { type: String, required: true, minlength: 6, select: false }, // select:false hides it in queries
  createdAt: { type: Date, default: Date.now },

  // For password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,


});

// ===========================
// PASSWORD ENCRYPTION (Pre-Save Middleware)
// ===========================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===========================
// PASSWORD COMPARISON METHOD
// ===========================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
