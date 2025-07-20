const sendEmail = require('../utils/sendEmail');

// @desc Send single email
exports.sendSingleEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await sendEmail(to, subject, html);
    res.json({ message: `Email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Send bulk email
exports.sendBulkEmail = async (req, res) => {
  try {
    const { recipients, subject, html } = req.body;
    if (!recipients || recipients.length === 0 || !subject || !html) {
      return res.status(400).json({ message: 'Recipients, subject, and html are required' });
    }
    await Promise.all(recipients.map((to) => sendEmail(to, subject, html)));
    res.json({ message: `Bulk emails sent to ${recipients.length} users` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
