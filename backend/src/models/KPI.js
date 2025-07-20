const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    target: { type: String, required: true },
    actual: { type: String, default: '0' },
    deadline: { type: Date, required: true },
    assignmentType: { type: String, enum: ['all', 'role', 'specific'], default: 'specific' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KPI', kpiSchema);

