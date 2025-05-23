const Leave = require('../models/leaveModel.js');

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  try {
    const newLeave = new Leave({ ...req.body, employee: req.user._id });
    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin gets all leave applications
exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().populate('employee', 'name email');
  res.json(leaves);
};

// Employee gets their leaves
exports.getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id });
  res.json(leaves);
};

// Admin approves or rejects leave
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
};
