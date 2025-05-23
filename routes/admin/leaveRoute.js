const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Employee = require('../../models/Employee.js');
const Attendance = require('../../models/Attendance.js');
const Leave = require('../../models/leaveModel.js');
const {adminOnly} = require('../../middleware/adminMiddleware.js')
const getDatesInRange = require('../../utils/getDateRange.js')


dotenv.config();

const router = express.Router();

router.use(adminOnly)

router.get('/all',async(req,res)=>{
     try {
    const pendingLeaves = await Leave.find({ status: 'Pending' })
      .populate('employee') // fetch complete employee info from User model
      .sort({ createdAt: -1 });

   return res.status(200).json(pendingLeaves);
  } catch (error) {
    console.error('Error fetching pending leaves:', error);
  return  res.status(500).json({ message: 'Server error while fetching pending leaves' });
  }
})

router.get('/reason/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        console.log(id,'from leaveroure')
        const leaveDetail = await Leave.findById(id).populate('employee');
        return res.status(200).json(leaveDetail)
    } catch (error) {
         console.error('Error fetching pending leaves:', error);
    return res.status(500).json({ message: 'Server error while fetching pending leaves' });
    }

})

router.put('/:id/status',async(req,res)=>{
   const { id } = req.params;
  const { status } = req.body;

  // Optional: validate status input
  const validStatuses = ['Pending', 'Approved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true } // returns the updated document
    ).populate("employee")

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found.' });
    }

     if (status === "Approved") {
      const { fromDate, toDate, employee } = leave;

      const attendanceDates = getDatesInRange(new Date(fromDate), new Date(toDate));

      // Find or create employee attendance record
      let attendance = await Attendance.findOne({ employee: employee._id });
      if (!attendance) {
        attendance = new Attendance({ employee: employee._id, attendanceReport: [] });
      }

      attendanceDates.forEach(date => {
        const existingIndex = attendance.attendanceReport.findIndex(
          entry => new Date(entry.date).toDateString() === date.toDateString()
        );

        if (existingIndex > -1) {
          attendance.attendanceReport[existingIndex].status = 'Leave';
        } else {
          attendance.attendanceReport.push({ date, status: 'Leave' });
        }
      });

      await attendance.save();
    }

    res.status(200).json(leave);
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Server error.' });
  }

})


module.exports = router;