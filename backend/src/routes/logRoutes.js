const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserNotifications } = require('../controllers/logController');

router.get('/notifications', protect, getUserNotifications);

module.exports = router;
