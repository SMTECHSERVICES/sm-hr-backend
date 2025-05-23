const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  attendanceReport: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true }
    }
  ]
 
});

module.exports = mongoose.model('Attendance', attendanceSchema);
