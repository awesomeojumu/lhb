const mongoose = require("mongoose");
const KPI = require("../models/KPI");
const KPIStatus = require("../models/KPIStatus");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ✅ Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// =======================
// Assign KPI (ANY AUTHENTICATED USER)
// =======================
exports.assignKPI = async (req, res) => {
  try {
    const { title, description, target, deadline, assignmentType, role, userIds } = req.body;

    // ✅ Validate deadline
    if (!deadline || new Date(deadline) < new Date()) {
      return res.status(400).json({ message: "Deadline must be a valid future date" });
    }

    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    // ✅ Create KPI
    const kpi = await KPI.create({
      title,
      description,
      target,
      deadline,
      assignmentType: assignmentType || "specific",
      createdBy: req.user._id,
    });

    // ✅ Determine Target Users
    let targetUsers = [];
    if (assignmentType === "all") {
      targetUsers = await User.find().select("email firstName");
    } else if (assignmentType === "role") {
      if (!role) {
        return res.status(400).json({ message: "Role is required for role assignment" });
      }
      targetUsers = await User.find({ role }).select("email firstName");
    } else {
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "User IDs required for specific assignment" });
      }

      // ✅ Validate each ID
      const validUserIds = userIds.filter((id) => isValidObjectId(id));
      if (validUserIds.length === 0) {
        return res.status(400).json({ message: "No valid User IDs provided" });
      }

      targetUsers = await User.find({ _id: { $in: validUserIds } }).select("email firstName");
    }

    if (targetUsers.length === 0) {
      return res.status(404).json({ message: "No users found for this KPI assignment" });
    }

    // ✅ Create KPIStatus Entries
    const statusEntries = targetUsers.map((user) => ({
      user: user._id,
      kpi: kpi._id,
      progress: 0,
      status: "Pending",
    }));
    await KPIStatus.insertMany(statusEntries);

    // ✅ Send Emails (Async - Won't Block Response)
    Promise.allSettled(
      targetUsers.map((user) =>
        sendEmail(
          user.email,
          `New KPI Assigned: ${title}`,
          `<p>Hello ${user.firstName},</p>
          <p>You have been assigned a new KPI: <strong>${title}</strong></p>
          <p>Target: ${target}</p>
          <p>Deadline: ${new Date(deadline).toDateString()}</p>`
        )
      )
    );

    return res.status(201).json({
      message: `KPI '${title}' assigned to ${targetUsers.length} users.`,
      kpiId: kpi._id,
      assignedCount: targetUsers.length,
    });
  } catch (error) {
    console.error("assignKPI Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get All KPIs
// =======================
exports.getAllKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find()
      .populate("createdBy", "firstName lastName role")
      .sort({ createdAt: -1 });

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
    const { kpiId } = req.params;
    if (!isValidObjectId(kpiId)) {
      return res.status(400).json({ message: "Invalid KPI ID" });
    }

    const kpi = await KPI.findById(kpiId).populate("createdBy", "firstName lastName role");
    if (!kpi) return res.status(404).json({ message: "KPI not found" });

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
    if (!isValidObjectId(kpiId)) {
      return res.status(400).json({ message: "Invalid KPI ID" });
    }

    const { title, description, target, deadline } = req.body;
    const kpi = await KPI.findById(kpiId);
    if (!kpi) return res.status(404).json({ message: "KPI not found" });

    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({ message: "Deadline must be a valid future date" });
    }

    kpi.title = title || kpi.title;
    kpi.description = description || kpi.description;
    kpi.target = target || kpi.target;
    kpi.deadline = deadline || kpi.deadline;

    const updated = await kpi.save();
    res.json({ message: "KPI updated successfully", kpi: updated });
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
    if (!isValidObjectId(kpiId)) {
      return res.status(400).json({ message: "Invalid KPI ID" });
    }

    const kpi = await KPI.findById(kpiId);
    if (!kpi) return res.status(404).json({ message: "KPI not found" });

    await KPIStatus.deleteMany({ kpi: kpiId });
    await kpi.deleteOne();
    res.json({ message: "KPI deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get KPIs for a Specific User
// =======================
exports.getUserKPIs = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const kpis = await KPIStatus.find({ user: userId })
      .populate("kpi", "title description target deadline")
      .populate("user", "firstName lastName email");

    res.json(kpis || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update KPI Status (Self)
// =======================
exports.updateKPIStatus = async (req, res) => {
  try {
    const { kpiStatusId } = req.params;
    if (!isValidObjectId(kpiStatusId)) {
      return res.status(400).json({ message: "Invalid KPI Status ID" });
    }

    const { progress, status } = req.body;
    const kpiStatus = await KPIStatus.findByIdAndUpdate(
      kpiStatusId,
      { progress, status },
      { new: true }
    );

    if (!kpiStatus) return res.status(404).json({ message: "KPI Status not found" });

    res.json({ message: "KPI status updated successfully", kpiStatus });
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
      .populate("kpi", "title description target deadline")
      .populate("user", "firstName lastName email");

    res.json(kpis || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get KPI Summary (My Overview)
// =======================
exports.getKPISummary = async (req, res) => {
  try {
    const summaries = await KPIStatus.find({ user: req.user._id })
      .populate("kpi", "title target deadline")
      .select("progress status");

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
