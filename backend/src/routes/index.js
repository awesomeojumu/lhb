const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/kpis', require('./kpiRoutes'));
router.use('/email', require('./emailRoutes'));

module.exports = router;
