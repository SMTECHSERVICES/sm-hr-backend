const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
//const roleMiddleware = require('../middleware/roleMiddleware.js');
const {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
} = require('../controllers/leaveController.js');

// Employee apply leave
router.post('/apply', protect, applyLeave);

// Admin get all leaves
router.get('/all', protect, roleMiddleware('admin'), getAllLeaves);

// Employee get own leaves
router.get('/my', protect, getMyLeaves);

// Admin approve/reject
router.put('/update/:id', protect, roleMiddleware('admin'), updateLeaveStatus);

module.exports = router;
