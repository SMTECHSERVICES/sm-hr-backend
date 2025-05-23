const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Attendance = require('../models/Attendance.js');
const Employee = require('../models/Employee.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload CSV
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (let row of results) {
        const employee = await Employee.findOne({ email: row.email });
        if (employee) {
          await Attendance.create({
            employee: employee._id,
            date: new Date(row.date),
            status: row.status
          });
        }
      }
      fs.unlinkSync(req.file.path);
      res.json({ message: 'Attendance uploaded successfully' });
    });
});

// Get all attendance
router.get('/', protect, async (req, res) => {
  const attendance = await Attendance.find().populate('employee');
  res.json(attendance);
});

// Get attendance of logged-in employee
router.get('/mine', protect, async (req, res) => {
  const attendance = await Attendance.find({ employee: req.user.employeeId });
  res.json(attendance);
});

module.exports = router;
