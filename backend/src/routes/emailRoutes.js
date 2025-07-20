const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { sendSingleEmail, sendBulkEmail } = require('../controllers/emailController');

router.post('/send', protect, authorizeRoles('commander', 'commando'), sendSingleEmail);
router.post('/send-bulk', protect, authorizeRoles('commander', 'commando'), sendBulkEmail);

module.exports = router;
