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
  getKPIDetails,
  updateKPI,
  deleteKPI,
  getMyKPIs,
  getKPISummary,
} = require('../controllers/kpiController');

// ✅ Create / Assign KPI
router.post('/', protect, authorizeRoles('commander', 'commando'), createKPIValidation, validate, assignKPI);

// ✅ My KPIs & Summary (Self)
router.get('/my', protect, getMyKPIs);
router.get('/summary', protect, getKPISummary);

// ✅ All KPIs (Commander/Commando)
router.get('/', protect, authorizeRoles('commander', 'commando'), getAllKPIs);

// ✅ KPIs for specific user
router.get('/user/:userId', protect, getUserKPIs);

// ✅ Single KPI details
router.get('/details/:kpiId', protect, getKPIDetails);

// ✅ Update KPI progress/status (Self)
router.put('/status/:kpiStatusId', protect, updateKPIStatusValidation, validate, updateKPIStatus);

// ✅ Update KPI (Commander/Commando)
router.put('/:kpiId', protect, authorizeRoles('commander', 'commando'), updateKPI);

// ✅ Delete KPI (Commander/Commando)
router.delete('/:kpiId', protect, authorizeRoles('commander', 'commando'), deleteKPI);

module.exports = router;
