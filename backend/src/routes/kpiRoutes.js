const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createKPIValidation,
  updateKPIStatusValidation,
} = require('../validations/kpiValidation');

const {
  assignKPI,
  getUserKPIs,
  updateKPIStatus,
  getAllKPIs,
  updateKPI,
  deleteKPI,
  getKPISummary,
} = require('../controllers/kpiController');

// Assign KPI (Commander/Commando only)
router.post(
  '/',
  protect,
  authorizeRoles('commander', 'commando'),
  createKPIValidation,
  validate,
  assignKPI
);

// Get KPIs for a user (Self or Admin)
router.get('/user/:userId', protect, getUserKPIs);

// Update KPI progress/status (Self)
router.put('/status/:kpiStatusId', protect, updateKPIStatusValidation, validate, updateKPIStatus);

// Get all KPIs (Commander/Commando)
router.get('/', protect, authorizeRoles('commander', 'commando'), getAllKPIs);

// Update KPI (Commander can edit all, Commando can edit their own)
router.put('/:kpiId', protect, authorizeRoles('commander', 'commando'), updateKPI);

// ✅ Delete KPI (Commander can delete all, Commando only their own)
router.delete('/:kpiId', protect, authorizeRoles('commander', 'commando'), deleteKPI);

// Get My KPIs (Self)
const { getMyKPIs } = require('../controllers/kpiController');

// Get KPIs summary (Commander/Commando)
router.get('/summary', protect, authorizeRoles('commander', 'commando'), getKPISummary);

// 
router.get('/summary', protect, getKPISummary);

router.get('/my', protect, getMyKPIs);
module.exports = router;
