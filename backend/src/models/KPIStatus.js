const mongoose = require('mongoose');

const kpiStatusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kpi: { type: mongoose.Schema.Types.ObjectId, ref: 'KPI', required: true },
    progress: { type: Number, default: 0 }, // % completed
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KPIStatus', kpiStatusSchema);
