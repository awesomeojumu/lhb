const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g., "LOGIN", "ASSIGN_KPI"
    details: { type: String }, // More info about the action
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
