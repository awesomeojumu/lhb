const KPI = require('../models/KPI');
const KPIStatus = require('../models/KPIStatus');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// =======================
// Assign KPI
// =======================
exports.assignKPI = async (req, res) => {
  try {
    const { title, description, target, deadline, assignmentType, role, userIds } = req.body;

    if (!deadline || new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be a valid future date' });
    }

    if (!req.user || !['commander', 'commando'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Commander or Commando can assign KPIs' });
    }

    const kpi = await KPI.create({
      title,
      description,
      target,
      deadline,
      assignmentType: assignmentType || 'specific',
      createdBy: req.user._id,
    });

    let targetUsers = [];
    if (assignmentType === 'all') {
      targetUsers = await User.find().select('email firstName');
    } else if (assignmentType === 'role') {
      if (!role) return res.status(400).json({ message: 'Role is required for role assignment' });
      targetUsers = await User.find({ role }).select('email firstName');
    } else {
      if (!userIds || userIds.length === 0) {
        return res.status(400).json({ message: 'User IDs required for specific assignment' });
      }
      targetUsers = await User.find({ _id: { $in: userIds } }).select('email firstName');
    }

    if (targetUsers.length === 0) {
      return res.status(404).json({ message: 'No users found for this KPI assignment' });
    }

    const statusEntries = targetUsers.map((user) => ({
      user: user._id,
      kpi: kpi._id,
      progress: 0,
      status: 'Pending',
    }));
    await KPIStatus.insertMany(statusEntries);

    const emailPromises = targetUsers.map((user) => {
      const emailContent = `
        <p>Hello ${user.firstName},</p>
        <p>You have been assigned a new KPI: <strong>${title}</strong></p>
        <p>Target: ${target}</p>
        <p>Deadline: ${new Date(deadline).toDateString()}</p>
      `;
      return sendEmail(user.email, `New KPI Assigned: ${title}`, emailContent).catch((err) =>
        console.error(`Email failed for ${user.email}:`, err.message)
      );
    });
    Promise.all(emailPromises);

    res.status(201).json({
      message: `KPI '${title}' assigned to ${targetUsers.length} users.`,
      kpiId: kpi._id,
      assignedCount: targetUsers.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get All KPIs
// =======================
exports.getAllKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find().populate('createdBy', 'firstName lastName role');
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get Single KPI by ID
// =======================
exports.getKPIDetails = async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.kpiId)
      .populate('createdBy', 'firstName lastName role');
    if (!kpi) return res.status(404).json({ message: 'KPI not found' });
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update KPI
// =======================
exports.updateKPI = async (req, res) => {
  try {
    const { kpiId } = req.params;
    const { title, description, target, deadline } = req.body;

    const kpi = await KPI.findById(kpiId);
    if (!kpi) return res.status(404).json({ message: 'KPI not found' });

    if (req.user.role === 'commander' || (req.user.role === 'commando' && String(kpi.createdBy) === String(req.user._id))) {
      kpi.title = title || kpi.title;
      kpi.description = description || kpi.description;
      kpi.target = target || kpi.target;
      kpi.deadline = deadline || kpi.deadline;
      const updated = await kpi.save();
      return res.json({ message: 'KPI updated successfully', kpi: updated });
    }

    res.status(403).json({ message: 'You cannot edit this KPI' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete KPI
// =======================
exports.deleteKPI = async (req, res) => {
  try {
    const { kpiId } = req.params;
    const kpi = await KPI.findById(kpiId);
    if (!kpi) return res.status(404).json({ message: 'KPI not found' });

    if (req.user.role === 'commander' || (req.user.role === 'commando' && String(kpi.createdBy) === String(req.user._id))) {
      await KPIStatus.deleteMany({ kpi: kpiId });
      await kpi.deleteOne();
      return res.json({ message: 'KPI deleted successfully' });
    }

    res.status(403).json({ message: 'You cannot delete this KPI' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get User KPIs
// =======================
exports.getUserKPIs = async (req, res) => {
  try {
    const kpis = await KPIStatus.find({ user: req.params.userId })
      .populate('kpi', 'title description target deadline')
      .populate('user', 'firstName lastName email');
    if (!kpis || kpis.length === 0) return res.status(404).json({ message: 'No KPIs found' });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update KPI Status
// =======================
exports.updateKPIStatus = async (req, res) => {
  try {
    const { kpiStatusId } = req.params;
    const { progress, status } = req.body;

    const kpiStatus = await KPIStatus.findByIdAndUpdate(
      kpiStatusId, { progress, status }, { new: true }
    );
    if (!kpiStatus) return res.status(404).json({ message: 'KPI Status not found' });

    res.json({ message: 'KPI status updated successfully', kpiStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get My KPIs
// =======================
exports.getMyKPIs = async (req, res) => {
  try {
    const kpis = await KPIStatus.find({ user: req.user._id })
      .populate('kpi', 'title description target deadline')
      .populate('user', 'firstName lastName email');
    if (!kpis || kpis.length === 0) return res.status(404).json({ message: 'No KPIs found' });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get KPI Summary
// =======================
exports.getKPISummary = async (req, res) => {
  try {
    const summaries = await KPIStatus.find({ user: req.user._id })
      .populate('kpi', 'title target deadline')
      .select('progress status');
    if (!summaries || summaries.length === 0) {
      return res.status(404).json({ message: 'No KPI summaries found' });
    }

    const formatted = summaries.map((item) => ({
      title: item.kpi.title,
      target: item.kpi.target,
      progress: item.progress,
      status: item.status,
      deadline: item.kpi.deadline,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
