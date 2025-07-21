const Log = require('../models/Log');

exports.getUserNotifications = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const notifications = logs.map((log) => ({
      message: `${log.action}: ${log.details}`,
      time: log.createdAt,
    }));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
