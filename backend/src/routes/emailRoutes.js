const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { sendSingleEmail, sendBulkEmail, getEmailTemplates } = require('../controllers/emailController');

router.post('/send', protect, authorizeRoles('commander', 'commando'), sendSingleEmail);
router.post('/send-bulk', protect, authorizeRoles('commander', 'commando'), sendBulkEmail);
router.get('/templates', protect, authorizeRoles('commander', 'commando'), getEmailTemplates);

module.exports = router;
